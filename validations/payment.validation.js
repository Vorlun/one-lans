import Joi from "joi";

export const createPaymentValidation = Joi.object({
  contract_id: Joi.number().integer().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().max(10).required(),
  payment_method: Joi.string().required(),
  paid_at: Joi.date().optional(),
  status: Joi.string().valid("pending", "completed", "failed").required(),
});
