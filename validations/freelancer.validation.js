import Joi from "joi";

export const freelancerCreateValidation = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password and confirm password must match",
    }),
  phone: Joi.string(),
  bio: Joi.string(),
  experience_years: Joi.number().integer(),
  avatar_url: Joi.string().uri(),
});

export const freelancerUpdateValidation = Joi.object({
  full_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  phone: Joi.string(),
  is_verified: Joi.boolean(),
  bio: Joi.string(),
  experience_years: Joi.number().integer(),
  avatar_url: Joi.string().uri(),
  rating: Joi.number().min(0).max(5),
});

export const freelancerChangePasswordValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "any.only": "New password and confirm password must match",
    }),
});