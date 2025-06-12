import { Client } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import mailService from "../services/mail.service.js";
import config from "config";
import { v4 as uuidv4 } from "uuid";
import { Contract } from "../models/contracts.model.js";
import { Service } from "../models/services.model.js";
import { Op } from "sequelize";
import { Freelancer } from "../models/freelancer.model.js";
import { Category } from "../models/categories.model.js";


const findClientByIdOrThrow = async (id) => {
  const client = await Client.findByPk(id, {
    attributes: { exclude: ["password_hash"] },
  });

  if (!client) {
    const error = new Error("Client not found");
    error.status = 404;
    throw error;
  }

  return client;
};

export const createClient = async (req, res, next) => {
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

    const existing = await Client.findOne({ where: { phone } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const email_token = uuidv4();
    const email_token_expire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const client = await Client.create({
      full_name,
      phone,
      email,
      password_hash,
      email_token,
      email_token_expire,
    });

    const verifyLink = `http://localhost:${config.get(
      "port"
    )}/api/client/verify-email/${email_token}`;
    await mailService.sendVerificationLink(email, full_name, verifyLink);

    const { password_hash: _, ...clientData } = client.toJSON();

    res.status(201).json({
      success: true,
      message: "Client created. Activation link sent to email.",
      data: clientData,
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const isMatch = await bcrypt.compare(old_password, client.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await client.update({ password_hash, updated_at: new Date() });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: clients, count: total } = await Client.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
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

export const getClientById = async (req, res, next) => {
  try {
    const client = await findClientByIdOrThrow(req.params.id);
    res.status(200).json({
      success: true,
      message: "Client retrieved successfully",
      data: client,
    });
  } catch (err) {
    next(err);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone, email, password } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (phone && phone !== client.phone) {
      const existing = await Client.findOne({ where: { phone } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : client.password_hash;

    await client.update({
      full_name: full_name ?? client.full_name,
      phone: phone ?? client.phone,
      email: email ?? client.email,
      password_hash,
      updated_at: new Date(),
    });

    const { password_hash: _, ...clientData } = client.toJSON();
    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: clientData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await client.destroy();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyClientEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const client = await Client.findOne({ where: { email_token: token } });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (client.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Client already verified",
      });
    }

    if (client.email_token_expire < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    client.is_verified = true;
    client.email_token = null;
    client.email_token_expire = null;
    await client.save();

    res.status(200).json({
      success: true,
      message: "Client email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getClientsUsedServicesInDateRange = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date va end_date query parametrlari talab qilinadi",
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
          model: Client,
          attributes: ["id", "full_name", "email", "phone"],
        },
        {
          model: Service,
          attributes: ["id", "title", "price"],
        },
      ],
    });

    const clientsMap = new Map();
    contracts.forEach((contract) => {
      if (contract.client) {
        clientsMap.set(contract.client.id, contract.client);
      }
    });

    const uniqueClients = Array.from(clientsMap.values());

    res.status(200).json({
      success: true,
      message: "Berilgan sanalar oraligida xizmatdan foydalangan klientlar",
      data: uniqueClients,
    });
  } catch (err) {
    next(err);
  }
};

export const getClientsCancelledServicesInDateRange = async (req,res,next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date va end_date query parametrlari kerak",
      });
    }

    const cancelledContracts = await Contract.findAll({
      where: {
        status_id: 1,
        start_date: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Service,
          include: [
            { model: Freelancer, attributes: ["id", "full_name", "email"] },
            { model: Category, attributes: ["id", "name"] },
          ],
        },
      ],
    });

    const cancelledClients = cancelledContracts
      .map((contract) => contract.client)
      .filter(
        (client, index, self) =>
          index === self.findIndex((c) => c?.id === client?.id)
      );

    res.status(200).json({
      success: true,
      message: "Bekor qilingan xizmatlardan foydalangan clientlar ro'yxati",
      data: cancelledClients,
    });
  } catch (err) {
    next(err);
  }
};

export const getClientPaymentsWithOwners = async (req, res, next) => {
  try {
    const { client_id } = req.params;

    const contracts = await Contract.findAll({
      where: { client_id },
      include: [
        {
          model: Service,
          attributes: ["id", "title", "price"],
        },
        {
          model: Freelancer,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Client,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    const payments = contracts.map(contract => ({
      client: contract.client,
      service: contract.service,
      owner: contract.freelancer,
      price: contract.service?.price,
      start_date: contract.start_date,
      end_date: contract.end_date,
    }));

    res.status(200).json({
      success: true,
      message: "Client tomonidan amalga oshirilgan paymentlar ro'yxati",
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};
