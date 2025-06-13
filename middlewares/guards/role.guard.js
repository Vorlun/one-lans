export default function roleGuard(requiredRoles = []) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Token not found." });
    }

    const isSuperAdminRequest = requiredRoles.includes("super_admin");

    if (isSuperAdminRequest) {
      if (user.role === "admin" && user.admin_type === "super_admin") {
        return next();
      } else {
        return res.status(403).json({ message: "Super admin access only." });
      }
    }

    if (!requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied for this role." });
    }

    next();
  };
}
