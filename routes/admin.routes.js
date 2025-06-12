import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  adminChangePasswordValidation,
  adminCreateValidation,
  adminUpdateValidation,
} from "../validations/admin.validation.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changePassword,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", getAllAdmins);
router.get("/:id", validateParams(idParamValidation), getAdminById);
router.post("/", validateBody(adminCreateValidation), createAdmin);
router.put(
  "/:id/change-password",
  validateParams(idParamValidation),
  validateBody(adminChangePasswordValidation),
  changePassword
);

router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(adminUpdateValidation),
  updateAdmin
);
router.delete("/:id", validateParams(idParamValidation), deleteAdmin);

export default router;
