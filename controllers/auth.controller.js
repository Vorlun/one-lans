import bcrypt from "bcryptjs";
import config from "config";
import { getUserByRole } from "../services/getUserByRole.service.js";
import { jwtServices } from "../services/jwt.service.js";
import { refreshTokenService } from "../services/refreshToken.service.js";

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await getUserByRole(role, email);

    if (!user)
      return res.status(401).json({ message: "Email yoki parol notogri" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Email yoki parol notogri" });

    const payload = { id: user.id, email: user.email, role };
    const jwtService = jwtServices[role];
    const tokens = jwtService.generateTokens(payload);

    await refreshTokenService.save({
      user_id: user.id,
      role,
      refreshToken: tokens.refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresIn: config.get(`jwt.${role}.refreshExpiresInDays`),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: config.get("jwt.cookieMaxAge"),
    });

    res.status(200).json({
      message: "Kirish muvaffaqiyatli",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ message: "Token topilmadi" });

    let decoded;
    let jwtService;

    for (const role of ["admin", "client", "freelancer"]) {
      try {
        decoded = jwtServices[role].verifyRefreshToken(refreshToken);
        jwtService = jwtServices[role];
        break;
      } catch {}
    }

    if (!decoded)
      return res
        .status(401)
        .json({ message: "Token yaroqsiz yoki muddati tugagan" });

    const { id, email, role } = decoded;
    const user = await getUserByRole(role, email);
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    const tokenRecord = await refreshTokenService.findValid({
      user_id: id,
      role,
      refreshToken,
    });

    if (!tokenRecord)
      return res
        .status(401)
        .json({ message: "Token notogri yoki topilmadi" });

    const tokens = jwtService.generateTokens({ id, email, role });

    await refreshTokenService.deleteOne(tokenRecord.id);
    await refreshTokenService.save({
      user_id: id,
      role,
      refreshToken: tokens.refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresIn: config.get(`jwt.${role}.refreshExpiresInDays`),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: config.get("jwt.cookieMaxAge"),
    });

    res.status(200).json({
      message: "Token yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ message: "Token topilmadi" });

    let decoded;
    let role;

    for (const r of ["admin", "client", "freelancer"]) {
      try {
        decoded = jwtServices[r].verifyRefreshToken(refreshToken);
        role = r;
        break;
      } catch {}
    }

    if (!decoded) return res.status(401).json({ message: "Token yaroqsiz" });

    const { id } = decoded;

    const tokenRecord = await refreshTokenService.findValid({
      user_id: id,
      role,
      refreshToken,
    });

    if (tokenRecord) await refreshTokenService.deleteOne(tokenRecord.id);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Chiqish muvaffaqiyatli" });
  } catch (err) {
    next(err);
  }
};
