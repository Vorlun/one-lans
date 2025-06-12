import Joi from "joi";

export const contractCreateValidation = Joi.object({
  client_id: Joi.number().integer().required(),
  freelancer_id: Joi.number().integer().required(),
  service_id: Joi.number().integer().required(),
  status_id: Joi.number().integer().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional(),
});

export const contractUpdateValidation = Joi.object({
  client_id: Joi.number().integer(),
  freelancer_id: Joi.number().integer(),
  service_id: Joi.number().integer(),
  status_id: Joi.number().integer(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
