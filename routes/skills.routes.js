import express from "express";
import { idParamValidation } from "../validations/common.validation.js";
import { skillCreateValidation, skillUpdateValidation } from "../validations/skill.validation.js";
import { createSkill, deleteSkill, getAllSkills, getSkillById, updateSkill } from "../controllers/skills.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllSkills);
router.get("/:id", validateParams(idParamValidation), getSkillById);
router.post("/", validateBody(skillCreateValidation), createSkill);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(skillUpdateValidation),
  updateSkill
);
router.delete("/:id", validateParams(idParamValidation), deleteSkill);

export default router;
