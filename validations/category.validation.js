import Joi from "joi";

export const categoryCreateValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const categoryUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(50),
});
