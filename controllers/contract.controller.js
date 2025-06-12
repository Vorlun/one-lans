import { Contract } from "../models/contracts.model.js";
import { Client } from "../models/client.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Service } from "../models/services.model.js";
import { Status } from "../models/status.model.js";

export const createContract = async (req, res, next) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json({
      success: true,
      message: "Contract created",
      data: contract,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: Client, attributes: ["id", "full_name", "email"] },
        { model: Freelancer, attributes: ["id", "full_name", "email"] },
        { model: Service, attributes: ["id", "title", "price"] },
        { model: Status, attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Contracts retrieved",
      data: contracts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        { model: Client, attributes: ["id", "full_name", "email"] },
        { model: Freelancer, attributes: ["id", "full_name", "email"] },
        { model: Service, attributes: ["id", "title", "price"] },
        { model: Status, attributes: ["id", "name"] },
      ],
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contract retrieved",
      data: contract,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContract = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    await contract.update(req.body);

    res.status(200).json({
      success: true,
      message: "Contract updated",
      data: contract,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContract = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    await contract.destroy();

    res.status(200).json({
      success: true,
      message: "Contract deleted",
    });
  } catch (err) {
    next(err);
  }
};
