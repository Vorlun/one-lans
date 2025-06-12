import { Skill } from "../models/skills.model.js";

export const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exists = await Skill.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({ name });

    res.status(201).json({
      success: true,
      message: "Skill created",
      data: skill,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json({
      success: true,
      message: "Skills retrieved",
      data: skills,
    });
  } catch (err) {
    next(err);
  }
};

export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill retrieved",
      data: skill,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const skill = await Skill.findByPk(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    skill.name = name;
    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated",
      data: skill,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await skill.destroy();

    res.status(200).json({
      success: true,
      message: "Skill deleted",
    });
  } catch (err) {
    next(err);
  }
};
