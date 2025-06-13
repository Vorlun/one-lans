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
import { Payment } from "../models/payment.model.js";


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

export const getClientsCancelledServicesInDateRange = async (
  req,
  res,
  next
) => {
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
        status_id: 1, // assuming 1 means cancelled
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
          include: [
            { model: Freelancer, attributes: ["id", "full_name"] },
            { model: Category, attributes: ["id", "name"] },
          ],
        },
      ],
    });

    const clients = contracts
      .map((c) => c.client)
      .filter(
        (client, index, self) =>
          client && self.findIndex((x) => x.id === client.id) === index
      );

    res.status(200).json({
      success: true,
      message: `Clients who cancelled services between ${start_date} and ${end_date}`,
      data: clients,
    });
  } catch (err) {
    next(err);
  }
};

export const getClientPaymentsWithServicesAndOwners = async (
  req,
  res,
  next
) => {
  try {
    const { client_id } = req.params;

    const payments = await Payment.findAll({
      include: [
        {
          model: Contract,
          required: true,
          where: { client_id },
          include: [
            {
              model: Service,
              attributes: ["id", "title", "price"],
              include: [
                {
                  model: Freelancer,
                  attributes: ["id", "full_name", "email"],
                },
              ],
            },
            {
              model: Client,
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
      order: [["paid_at", "DESC"]],
    });

    const result = payments.map((payment) => ({
      payment_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.payment_method,
      paid_at: payment.paid_at,
      status: payment.status,
      service: {
        id: payment.contract.service?.id,
        title: payment.contract.service?.title,
        price: payment.contract.service?.price,
      },
      owner: payment.contract.service?.freelancer,
      client: payment.contract.client,
      start_date: payment.contract.start_date,
      end_date: payment.contract.end_date,
    }));

    res.status(200).json({
      success: true,
      message:
        "Client tomonidan amalga oshirilgan paymentlar ro'yxati (xizmat va freelancer bilan)",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
