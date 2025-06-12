import Joi from "joi";

export const skillCreateValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const skillUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(50),
});
  