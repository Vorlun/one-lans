import { jwtServices } from "../../services/jwt.service.js";

/**
 * Auth Guard Middleware
 * @param {string[]} allowedRoles - e.g., ['admin', 'super_admin', 'client', 'freelancer']
 */
export default function authGuard(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Authorization token required." });
      }

      const token = authHeader.split(" ")[1];
      let decoded = null;
      let matchedRole = null;

      for (const [roleKey, service] of Object.entries(jwtServices)) {
        try {
          const tempDecoded = service.verifyAccessToken(token);

          if (
            allowedRoles.includes("super_admin") &&
            tempDecoded.role === "admin" &&
            tempDecoded.admin_type === "super_admin"
          ) {
            decoded = tempDecoded;
            matchedRole = "admin";
            break;
          }          

          if (allowedRoles.includes(tempDecoded.role)) {
            decoded = tempDecoded;
            matchedRole = tempDecoded.role;
            break;
          }
        } catch {}
      }

      if (!decoded || !matchedRole) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Unauthorized access." });
    }
  };
}
