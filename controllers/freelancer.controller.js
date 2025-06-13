import { Freelancer } from "../models/freelancer.model.js";
import { Skill } from "../models/skills.model.js";
import bcrypt from "bcryptjs";
import mailService from "../services/mail.service.js";
import config from "config";
import { v4 as uuidv4 } from "uuid";
import { Service } from "../models/services.model.js";
import { Contract } from "../models/contracts.model.js";
import sequelize from "../config/db.js"; 
import { Op } from "sequelize";

const findFreelancerByIdOrThrow = async (id) => {
  const freelancer = await Freelancer.findByPk(id, {
    attributes: { exclude: ["password_hash"] },
    include: {
      model: Skill,
      attributes: ["id", "name"], 
      through: {
        attributes: ["level"],
      },
    },
  });

  if (!freelancer) {
    const error = new Error("Freelancer not found");
    error.status = 404;
    throw error;
  }

  return freelancer;
};

export const createFreelancer = async (req, res, next) => {
  try {
    const { full_name, phone, email, password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm_password are required",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm_password do not match",
      });
    }

    const existing = await Freelancer.findOne({ where: { phone } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const email_token = uuidv4();
    const email_token_expire = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const freelancer = await Freelancer.create({
      full_name,
      phone,
      email,
      password_hash,
      email_token,
      email_token_expire,
    });

    const verifyLink = `http://localhost:${config.get(
      "port"
    )}/api/freelancer/verify-email/${email_token}`;
    await mailService.sendVerificationLink(email, full_name, verifyLink);

    const { password_hash: _, ...freelancerData } = freelancer.toJSON();

    res.status(201).json({
      success: true,
      message: "Freelancer created. Activation link sent to email.",
      data: freelancerData,
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const freelancer = await Freelancer.findByPk(id);
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    const isMatch = await bcrypt.compare(
      old_password,
      freelancer.password_hash
    );
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await freelancer.update({ password_hash });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllFreelancers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: freelancers, count: total } =
      await Freelancer.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        attributes: { exclude: ["password_hash"] },
        order: [["created_at", "DESC"]],
        include: {
          model: Skill,
          attributes: ["id", "name"],
          through: {
            attributes: ["level"],
          },
        },
      });

    res.status(200).json({
      success: true,
      message: "Freelancers retrieved successfully",
      data: freelancers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getFreelancerById = async (req, res, next) => {
  try {
    const freelancer = await findFreelancerByIdOrThrow(req.params.id);

    res.status(200).json({
      success: true,
      message: "Freelancer retrieved successfully",
      data: freelancer,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFreelancer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone, email, password } = req.body;

    const freelancer = await Freelancer.findByPk(id);
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    if (phone && phone !== freelancer.phone) {
      const existing = await Freelancer.findOne({ where: { phone } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : freelancer.password_hash;

    await freelancer.update({
      full_name: full_name ?? freelancer.full_name,
      phone: phone ?? freelancer.phone,
      email: email ?? freelancer.email,
      password_hash,
    });

    const { password_hash: _, ...freelancerData } = freelancer.toJSON();
    res.status(200).json({
      success: true,
      message: "Freelancer updated successfully",
      data: freelancerData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFreelancer = async (req, res, next) => {
  try {
    const freelancer = await Freelancer.findByPk(req.params.id);
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    await freelancer.destroy();

    res.status(200).json({
      success: true,
      message: "Freelancer deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyFreelancerEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const freelancer = await Freelancer.findOne({
      where: { email_token: token },
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (freelancer.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Freelancer already verified",
      });
    }

    if (freelancer.email_token_expire < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    await freelancer.update({
      is_verified: true,
      email_token: null,
      email_token_expire: null,
    });

    res.status(200).json({
      success: true,
      message: "Freelancer email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};