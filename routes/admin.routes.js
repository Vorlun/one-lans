import express from "express";
import authGuard from "../middlewares/guards/auth.guard.js";
import roleGuard from "../middlewares/guards/role.guard.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  adminCreateValidation,
  adminUpdateValidation,
  adminChangePasswordValidation,
} from "../validations/admin.validation.js";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changePassword,
} from "../controllers/admin.controller.js";

const router = express.Router();

// router.use(authGuard(["admin"]));

// router.use(roleGuard(["super_admin"]));

router.post("/", validateBody(adminCreateValidation), createAdmin);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(adminUpdateValidation),
  updateAdmin
);
router.put(
  "/:id/change-password",
  validateParams(idParamValidation),
  validateBody(adminChangePasswordValidation),
  changePassword
);
router.delete("/:id", validateParams(idParamValidation), deleteAdmin);
router.get("/", getAllAdmins);
router.get("/:id", validateParams(idParamValidation), getAdminById);

export default router;
