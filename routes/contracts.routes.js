import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  contractCreateValidation,
  contractUpdateValidation,
} from "../validations/contract.validation.js";
import { createContract, deleteContract, getAllContracts, getContractById, updateContract } from "../controllers/contract.controller.js";


const router = express.Router();

router.get("/", getAllContracts);
router.get("/:id", validateParams(idParamValidation), getContractById);
router.post("/", validateBody(contractCreateValidation), createContract);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(contractUpdateValidation),
  updateContract
);
router.delete("/:id", validateParams(idParamValidation), deleteContract);

export default router;
