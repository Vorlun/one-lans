import Joi from "joi";

export const freelancerSkillCreateValidation = Joi.object({
  freelancer_id: Joi.number().integer().required(),
  skill_id: Joi.number().integer().required(),
  level: Joi.string()
    .valid("beginner", "intermediate", "advanced", "expert")
    .required(),
});


export const freelancerSkillUpdateValidation = Joi.object({
  level: Joi.string().valid("beginner", "intermediate", "advanced", "expert"),
});
  