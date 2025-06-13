import Joi from "joi";

const passwordRules = Joi.string().min(6).max(64).required().messages({
  "string.min": "Parol kamida 6 belgidan iborat bo'lishi kerak",
  "string.max": "Parol 64 belgidan oshmasligi kerak",
  "any.required": "Parol kiritilishi shart",
});

export const adminCreateValidation = Joi.object({
  full_name: Joi.string().trim().required().messages({
    "string.empty": "To'liq ism kiritilishi shart",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.email": "Email manzili noto‘g‘ri formatda",
    "string.empty": "Email kiritilishi shart",
  }),

  password: passwordRules,

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Parol va tasdiqlash paroli mos emas",
      "any.required": "Parolni tasdiqlash shart",
    }),

  role: Joi.string().valid("admin").required().messages({
    "any.only": "Ruxsat etilgan rollar:admin",
  }),
});

export const adminUpdateValidation = Joi.object({
  full_name: Joi.string().trim(),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6).max(64),
  is_active: Joi.boolean(),
  role: Joi.string().valid("admin"),
});

export const adminChangePasswordValidation = Joi.object({
  old_password: passwordRules.label("Joriy parol"),

  new_password: passwordRules.label("Yangi parol"),

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "any.only": "Yangi parol va tasdiqlash mos emas",
      "any.required": "Yangi parolni tasdiqlash shart",
    }),
});
