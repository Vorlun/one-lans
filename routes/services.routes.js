import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  serviceCreateValidation,
  serviceUpdateValidation,
} from "../validations/service.validation.js";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  getServicesUsedInDateRange,
  updateService,
} from "../controllers/services.controller.js";

import authGuard from "../middlewares/guards/auth.guard.js";
import roleGuard from "../middlewares/guards/role.guard.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/used", getServicesUsedInDateRange);
router.get("/:id", validateParams(idParamValidation), getServiceById);

router.post(
  "/",
  authGuard("admin"),
  roleGuard(["admin"]),
  validateBody(serviceCreateValidation),
  createService
);
router.patch(
  "/:id",
  authGuard("admin"),
  roleGuard(["admin"]),
  validateParams(idParamValidation),
  validateBody(serviceUpdateValidation),
  updateService
);
router.delete(
  "/:id",
  authGuard("admin"),
  roleGuard(["admin"]),
  validateParams(idParamValidation),
  deleteService
);

export default router;
