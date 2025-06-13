export default function selfGuard(req, res, next) {
  const paramId =
    req.params.id || req.params.client_id || req.params.freelancer_id;
  const { id: userId, role, admin_type } = req.user || {};

  if (!paramId || !userId) {
    return res.status(400).json({ message: "Missing ID parameters." });
  }

  if (role === "admin" && admin_type === "super_admin") {
    return next();
  }

  if (String(paramId) !== String(userId)) {
    return res
      .status(403)
      .json({ message: "Access denied. Not your resource." });
  }

  next();
}
