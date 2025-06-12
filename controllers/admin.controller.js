import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";

const findAdminByIdOrThrow = async (id) => {
  const admin = await Admin.findByPk(id, {
    attributes: { exclude: ["password_hash"] },
  });

  if (!admin) {
    const error = new Error("Admin not found");
    error.status = 404;
    throw error;
  }

  return admin;
};

export const createAdmin = async (req, res, next) => {
  try {
    const { full_name, email, password, confirm_password, role } = req.body;

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

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      full_name,
      email,
      password_hash,
      role,
    });

    const { password_hash: _, ...adminData } = admin.toJSON();
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminData,
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(old_password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await admin.update({ password_hash, updated_at: new Date() });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: admins, count: total } = await Admin.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins,
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

export const getAdminById = async (req, res, next) => {
  try {
    const admin = await findAdminByIdOrThrow(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, role, is_active } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : admin.password_hash;

    await admin.update({
      full_name: full_name ?? admin.full_name,
      email: email ?? admin.email,
      password_hash,
      role: role ?? admin.role,
      is_active: is_active ?? admin.is_active,
      updated_at: new Date(),
    });

    const { password_hash: _, ...adminData } = admin.toJSON();
    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: adminData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.destroy();

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
