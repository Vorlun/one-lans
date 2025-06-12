import { Status } from "../models/status.model.js";

export const createStatus = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exists = await Status.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Status already exists",
      });
    }

    const status = await Status.create({ name });

    res.status(201).json({
      success: true,
      message: "Status created",
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllStatus = async (req, res, next) => {
  try {
    const status = await Status.findAll();
    res.status(200).json({
      success: true,
      message: "Status retrieved",
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

export const getStatusById = async (req, res, next) => {
  try {
    const status = await Status.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status retrieved",
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const status = await Status.findByPk(id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }

    status.name = name;
    await status.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStatus = async (req, res, next) => {
  try {
    const status = await Status.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }

    await status.destroy();

    res.status(200).json({
      success: true,
      message: "Status deleted",
    });
  } catch (err) {
    next(err);
  }
};
