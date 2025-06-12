import Joi from "joi";

export const serviceCreateValidation = Joi.object({
  freelancer_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().required(),
  tech_stack: Joi.string().min(2).max(255).required(),
  is_active: Joi.boolean(),
});

export const serviceUpdateValidation = Joi.object({
  freelancer_id: Joi.number().integer(),
  category_id: Joi.number().integer(),
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  price: Joi.number().positive(),
  tech_stack: Joi.string().min(2).max(255),
  is_active: Joi.boolean(),
});
