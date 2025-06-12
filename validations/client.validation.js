import Joi from "joi";

export const clientCreateValidation = Joi.object({
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
  avatar_url: Joi.string().uri({ scheme: ["http", "https"] }),
  company_name: Joi.string(),
});

export const clientUpdateValidation = Joi.object({
  full_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  phone: Joi.string(),
  is_verified: Joi.boolean(),
  avatar_url: Joi.string().uri(),
  company_name: Joi.string(),
});

export const clientChangePasswordValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "any.only": "New password and confirm password must match",
    }),
});
