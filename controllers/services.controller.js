import { Op, fn, col, literal } from "sequelize";
import { Service } from "../models/services.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Category } from "../models/categories.model.js";
import { Contract } from "../models/contracts.model.js";
import { Client } from "../models/client.model.js";

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service successfully created",
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
      message: "All services retrieved",
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
      message: "Service retrieved successfully",
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
      message: "Service updated successfully",
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
      message: "Service deleted successfully",
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
        message: "start_date and end_date query parameters are required",
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
      .map((c) => c.service)
      .filter((s, i, arr) => arr.findIndex((x) => x?.id === s?.id) === i);

    res.status(200).json({
      success: true,
      message: "Services used in date range retrieved",
      data: usedServices,
    });
  } catch (err) {
    next(err);
  }
};

export const getClientsByServiceInDateRange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date and end_date query parameters are required",
      });
    }

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        service_id: id,
        start_date: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "full_name", "email", "phone"],
        },
      ],
    });

    const clientsMap = new Map();
    contracts.forEach((contract) => {
      if (contract.client) {
        clientsMap.set(contract.client.id, contract.client);
      }
    });

    res.status(200).json({
      success: true,
      message: `Clients who used this service between ${start_date} and ${end_date}`,
      data: Array.from(clientsMap.values()),
    });
  } catch (err) {
    next(err);
  }
};

export const getTopFreelancersByService = async (req, res, next) => {
  try {
    const { service_title } = req.query;
    if (!service_title) {
      return res.status(400).json({
        success: false,
        message: "service_title query parametri kerak",
      });
    }

    const topFreelancers = await Contract.findAll({
      include: [
        {
          model: Service,
          where: {
            title: { [Op.iLike]: `%${service_title}%` },
          },
          attributes: ["id", "title", "freelancer_id"],
          include: [
            {
              model: Freelancer,
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
      attributes: [[fn("COUNT", col("contracts.id")), "total_completed"]],
      group: ["service.id", "service.freelancer_id", "service->freelancer.id"],
      order: [[literal("total_completed"), "DESC"]],
    });

    const formatted = topFreelancers.map((contract) => ({
      freelancer: contract.service.freelancer,
      service: {
        id: contract.service.id,
        title: contract.service.title,
      },
      total_completed: contract.get("total_completed"),
    }));

    res.status(200).json({
      success: true,
      message: "Berilgan xizmat boyicha eng kop bajargan freelancerlar",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};
