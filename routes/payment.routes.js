import express from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  getContractRemainingAmount,
} from "../controllers/payment.controller.js";
import { idParamValidation } from "../validations/common.validation.js";
import { createPaymentValidation } from "../validations/payment.validation.js";
import { validateBody, validateParams } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllPayments);
router.get(
  "/remaining/:id",
  validateParams(idParamValidation),
  getContractRemainingAmount
);
router.get("/:id", validateParams(idParamValidation), getPaymentById);
router.post("/", validateBody(createPaymentValidation), createPayment);
router.delete("/:id", validateParams(idParamValidation), deletePayment);

export default router;
