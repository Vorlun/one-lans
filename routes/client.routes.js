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
  getClientsUsedServicesInDateRange,
  getClientsCancelledServicesInDateRange,
  getClientPaymentsWithOwners,
} from "../controllers/client.controller.js";
import { changePassword } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", getAllClients);
router.get("/payments/:client_id", getClientPaymentsWithOwners);
router.get("/cancelled-clients", getClientsCancelledServicesInDateRange);
router.get("/used-services", getClientsUsedServicesInDateRange);
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
