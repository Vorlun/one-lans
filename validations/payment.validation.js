import Joi from "joi";

export const paymentCreateValidation = Joi.object({
  contract_id: Joi.number().integer().required().messages({
    "any.required": `"contract_id" majburiy`,
    "number.base": `"contract_id" butun son bo'lishi kerak`,
  }),

  amount: Joi.number().positive().required().messages({
    "any.required": `"amount" majburiy`,
    "number.base": `"amount" son bo'lishi kerak`,
    "number.positive": `"amount" musbat bo'lishi kerak`,
  }),

  currency: Joi.string().valid("UZS", "USD", "EUR").required().messages({
    "any.required": `"currency" majburiy`,
    "any.only": `"currency" faqat UZS, USD yoki EUR bo'lishi mumkin`,
  }),

  payment_method: Joi.string()
    .valid("click", "payme", "cash", "bank_transfer", "visa", "humo")
    .required()
    .messages({
      "any.required": `"payment_method" majburiy`,
      "any.only": `"payment_method" click, payme, visa, humo, cash yoki bank_transfer bo'lishi mumkin`,
    }),

  paid_at: Joi.date().optional().messages({
    "date.base": `"paid_at" sana formatida bo'lishi kerak`,
  }),

  status: Joi.string()
    .valid("pending", "completed", "failed")
    .optional()
    .messages({
      "any.only": `"status" faqat pending, completed yoki failed bo'lishi mumkin`,
    }),
});


export const paymentUpdateValidation = Joi.object({
  amount: Joi.number().positive().messages({
    "number.base": `"amount" son bo'lishi kerak`,
    "number.positive": `"amount" musbat bo'lishi kerak`,
  }),

  currency: Joi.string().valid("UZS", "USD", "EUR").messages({
    "any.only": `"currency" faqat UZS, USD yoki EUR bo'lishi mumkin`,
  }),

  payment_method: Joi.string()
    .valid("click", "payme", "cash", "bank_transfer")
    .messages({
      "any.only": `"payment_method" click, payme, cash yoki bank_transfer bo'lishi mumkin`,
    }),

  paid_at: Joi.date().messages({
    "date.base": `"paid_at" sana formatida bo'lishi kerak`,
  }),

  status: Joi.string().valid("pending", "completed", "failed").messages({
    "any.only": `"status" faqat pending, completed yoki failed bo'lishi mumkin`,
  }),
});
