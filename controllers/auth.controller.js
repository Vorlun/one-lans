import bcrypt from "bcryptjs";
import config from "config";
import { getUserByRole } from "../services/getUserByRole.service.js";
import { jwtServices } from "../services/jwt.service.js";
import { refreshTokenService } from "../services/refreshToken.service.js";

const supportedRoles = ["admin", "client", "freelancer"];

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!supportedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const user = await getUserByRole(role, email);
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.admin_type === "super_admin" ? "super_admin" : role, 
      ...(role === "admin" && { admin_type: user.admin_type }), 
    };
    
    const jwtService = jwtServices[role];
    const tokens = jwtService.generateTokens(payload);

    await refreshTokenService.save({
      user_id: user.id,
      role: role === "admin" ? "admin" : role,
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
      message: "Login successful.",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    let decoded, jwtService, role;
    for (const r of supportedRoles) {
      try {
        decoded = jwtServices[r].verifyRefreshToken(refreshToken);
        jwtService = jwtServices[r];
        role = r;
        break;
      } catch {}
    }

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const { id, email } = decoded;
    const user = await getUserByRole(role, email);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const tokenRecord = await refreshTokenService.findValid({
      user_id: id,
      role,
      refreshToken,
    });

    if (!tokenRecord) {
      return res.status(401).json({ message: "Invalid or unknown token." });
    }

    await refreshTokenService.deleteOne(tokenRecord.id);

    const newTokens = jwtService.generateTokens({ id, email, role });

    await refreshTokenService.save({
      user_id: id,
      role,
      refreshToken: newTokens.refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresIn: config.get(`jwt.${role}.refreshExpiresInDays`),
    });

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: config.get("jwt.cookieMaxAge"),
    });

    res.status(200).json({
      message: "Token refreshed successfully.",
      accessToken: newTokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not found." });
    }

    let decoded, role;
    for (const r of supportedRoles) {
      try {
        decoded = jwtServices[r].verifyRefreshToken(refreshToken);
        role = r;
        break;
      } catch {}
    }

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const { id } = decoded;
    const tokenRecord = await refreshTokenService.findValid({
      user_id: id,
      role,
      refreshToken,
    });

    if (tokenRecord) {
      await refreshTokenService.deleteOne(tokenRecord.id);
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};
