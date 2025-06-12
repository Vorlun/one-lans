import Joi from "joi";

export const reviewCreateValidation = Joi.object({
  from_user_id: Joi.number().integer().required(),
  from_user_type: Joi.string().valid("client", "freelancer").required(),
  to_user_id: Joi.number().integer().required(),
  contract_id: Joi.number().integer().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

export const reviewUpdateValidation = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().allow(""),
});
