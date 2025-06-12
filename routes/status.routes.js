import express from "express";
import { createStatus, deleteStatus, getAllStatus, getStatusById, updateStatus } from "../controllers/status.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { statusCreateValidation, statusUpdateValidation } from "../validations/status.validation.js";
import { idParamValidation } from "../validations/common.validation.js";

const router = express.Router();

router.get("/", getAllStatus);
router.get("/:id", validateParams(idParamValidation), getStatusById);
router.post("/", validateBody(statusCreateValidation), createStatus);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(statusUpdateValidation),
  updateStatus
);
router.delete("/:id", validateParams(idParamValidation), deleteStatus);

export default router;
