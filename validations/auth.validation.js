import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("admin", "client", "freelancer")
    .required()
    .messages({
      "any.only": `"role" must be one of [admin, client, freelancer]`,
    }),
});
