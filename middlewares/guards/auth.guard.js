import { jwtServices } from "../../services/jwt.service.js";

export default (role) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Authorization token required" });
      }

      const token = authHeader.split(" ")[1];
      const jwtService = role && role in jwtServices ? jwtServices[role] : null;

      if (!jwtService) {
        return res.status(400).json({ message: "Invalid role type" });
      }

      const decoded = jwtService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
