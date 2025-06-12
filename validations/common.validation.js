import Joi from "joi";

export const idParamValidation = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
