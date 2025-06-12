import Joi from "joi";

export const messageCreateValidation = Joi.object({
  contract_id: Joi.number().integer().required(),
  sender_id: Joi.number().integer().required(),
  sender_type: Joi.string().valid("client", "freelancer").required(),
  content: Joi.string().min(1).required(),
  send_at: Joi.date().optional(), 
  is_read: Joi.boolean().optional(),
});

export const messageUpdateValidation = Joi.object({
  content: Joi.string().min(1),
  is_read: Joi.boolean(),
});
