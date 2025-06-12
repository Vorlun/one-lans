import Joi from "joi";

export const adminCreateValidation = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password and confirm password must match",
    }),
  role: Joi.string().valid("super_admin", "moderator").required(),
});


export const adminUpdateValidation = Joi.object({
  full_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  is_active: Joi.boolean(),
  role: Joi.string().valid("super_admin", "moderator"),
});


export const adminChangePasswordValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "any.only": "New password and confirm password must match",
    }),
});
