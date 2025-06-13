import express from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  getContractRemainingAmount,
  updatePayment,
} from "../controllers/payment.controller.js";
import { idParamValidation } from "../validations/common.validation.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { paymentCreateValidation, paymentUpdateValidation } from "../validations/payment.validation.js";

const router = express.Router();

router.get("/", getAllPayments);
router.get(
  "/remaining/:id",
  validateParams(idParamValidation),
  getContractRemainingAmount
);
router.post("/", validateBody(paymentCreateValidation), createPayment);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(paymentUpdateValidation),
  updatePayment
);
router.get("/:id", validateParams(idParamValidation), getPaymentById);
router.delete("/:id", validateParams(idParamValidation), deletePayment);

export default router;
