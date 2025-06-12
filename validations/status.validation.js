import Joi from "joi";

export const statusCreateValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const statusUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(50),
});
