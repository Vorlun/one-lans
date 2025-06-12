import { FreelancerSkill } from "../models/freelancer_skills.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Skill } from "../models/skills.model.js";

export const addFreelancerSkill = async (req, res, next) => {
  try {
    const { freelancer_id, skill_id, level } = req.body;

    const freelancer = await Freelancer.findByPk(freelancer_id);
    const skill = await Skill.findByPk(skill_id);

    if (!freelancer || !skill) {
      return res.status(404).json({
        success: false,
        message: "Freelancer or skill not found.",
      });
    }

    const existing = await FreelancerSkill.findOne({
      where: { freelancer_id, skill_id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This skill is already assigned to the freelancer.",
      });
    }

    const newSkill = await FreelancerSkill.create({
      freelancer_id,
      skill_id,
      level,
    });

    res.status(201).json({
      success: true,
      message: "Skill successfully assigned to the freelancer.",
      data: newSkill,
    });
  } catch (err) {
    next(err);
  }
};

export const getFreelancerSkills = async (req, res, next) => {
  try {
    const { freelancer_id } = req.params;

    const freelancer = await Freelancer.findByPk(freelancer_id, {
      include: {
        model: Skill,
        through: { attributes: ["level"] },
      },
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Freelancer skills retrieved successfully.",
      data: freelancer.skills,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFreelancerSkill = async (req, res, next) => {
  try {
    const { freelancer_id, skill_id } = req.params;
    const { level } = req.body;

    const skill = await FreelancerSkill.findOne({
      where: { freelancer_id, skill_id },
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Assigned skill for the freelancer not found.",
      });
    }

    skill.level = level;
    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill level updated successfully.",
      data: skill,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFreelancerSkill = async (req, res, next) => {
  try {
    const { freelancer_id, skill_id } = req.params;

    const deleted = await FreelancerSkill.destroy({
      where: { freelancer_id, skill_id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or already deleted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Freelancer's skill successfully deleted.",
    });
  } catch (err) {
    next(err);
  }
};
