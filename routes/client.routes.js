import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  clientChangePasswordValidation,
  clientCreateValidation,
  clientUpdateValidation,
} from "../validations/client.validation.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  verifyClientEmail,
  getClientsCancelledServicesInDateRange,
  getClientPaymentsWithServicesAndOwners,
} from "../controllers/client.controller.js";
import { changePassword } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", getAllClients);
router.get("/:client_id/payments/details",getClientPaymentsWithServicesAndOwners);
router.get("/cancelled-clients", getClientsCancelledServicesInDateRange);
router.get("/:id", validateParams(idParamValidation), getClientById);
router.post("/", validateBody(clientCreateValidation), createClient);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(clientUpdateValidation),
  updateClient
);
router.put(
  "/:id/change-password",
  validateParams(idParamValidation),
  validateBody(clientChangePasswordValidation),
  changePassword
);
router.delete("/:id", validateParams(idParamValidation), deleteClient);
router.get("/verify-email/:token", verifyClientEmail);


export default router;
