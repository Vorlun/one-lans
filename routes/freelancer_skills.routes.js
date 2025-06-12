import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { idParamValidation } from "../validations/common.validation.js";
import { addFreelancerSkill, deleteFreelancerSkill, getFreelancerSkills, updateFreelancerSkill } from "../controllers/freelancer_skills.controller.js";
import { freelancerSkillCreateValidation, freelancerSkillUpdateValidation } from "../validations/freelancerSkill.validation.js";

const router = express.Router();

router.get(
  "/:freelancer_id",
  getFreelancerSkills
);
router.post(
  "/",
  validateBody(freelancerSkillCreateValidation),
  addFreelancerSkill
);
router.patch(
  "/:freelancer_id/:skill_id",
  validateBody(freelancerSkillUpdateValidation),
  updateFreelancerSkill
);
router.delete(
  "/:freelancer_id/:skill_id",
  deleteFreelancerSkill
);

export default router;
