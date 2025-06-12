import { Service } from "../models/services.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Category } from "../models/categories.model.js";
import { Op } from "sequelize";
import { Contract } from "../models/contracts.model.js";

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service created",
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: Freelancer, attributes: ["id", "full_name", "email"] },
        { model: Category, attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Services retrieved",
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        { model: Freelancer, attributes: ["id", "full_name", "email"] },
        { model: Category, attributes: ["id", "name"] },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service retrieved",
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.update(req.body);

    res.status(200).json({
      success: true,
      message: "Service updated",
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.destroy();

    res.status(200).json({
      success: true,
      message: "Service deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getServicesUsedInDateRange = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date and end_date query params are required",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        start_date: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      include: [
        {
          model: Service,
          include: [
            { model: Freelancer, attributes: ["id", "full_name", "email"] },
            { model: Category, attributes: ["id", "name"] },
          ],
        },
      ],
    });

    const usedServices = contracts
      .map((contract) => contract.service)
      .filter((s, i, arr) => arr.findIndex(t => t?.id === s?.id) === i);

    res.status(200).json({
      success: true,
      message: "Services used in date range retrieved",
      data: usedServices,
    });
  } catch (err) {
    next(err);
  }
};
