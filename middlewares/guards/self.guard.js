import { userJwtService } from "../../services/jwt.service.js";

export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = userJwtService.verifyAccessToken(token);

    const tokenUserId = decoded.id;
    const targetUserId = req.params.id || req.body.id;

    if (!targetUserId) {
      return res
        .status(400)
        .json({ message: "User ID required in params or body" });
    }

    if (String(tokenUserId) !== String(targetUserId)) {
      return res
        .status(403)
        .json({ message: "Faqat oz profilingizni tahrirlashingiz mumkin" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
