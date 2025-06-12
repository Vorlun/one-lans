import { Payment } from "../models/payment.model.js";
import { Contract } from "../models/contracts.model.js";
import { Service } from "../models/services.model.js";

export const createPayment = async (req, res, next) => {
  try {
    const { contract_id, amount, currency, payment_method, paid_at, status } =
      req.body;

    const contract = await Contract.findByPk(contract_id, {
      include: [{ model: Service, attributes: ["price"] }],
    });

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    const servicePrice = contract.service.price;

    const totalPaid =
      (await Payment.sum("amount", { where: { contract_id } })) || 0;
    const remaining = servicePrice - totalPaid;

    if (amount > remaining) {
      return res.status(400).json({
        success: false,
        message: `Overpayment detected. Remaining balance is ${remaining}`,
      });
    }

    const payment = await Payment.create({
      contract_id,
      amount,
      currency,
      payment_method,
      paid_at,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Payment created",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({ include: [{ model: Contract }] });
    res
      .status(200)
      .json({ success: true, message: "Payments retrieved", data: payments });
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Contract }],
    });

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Payment retrieved", data: payment });
  } catch (err) {
    next(err);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    await payment.destroy();

    res.status(200).json({ success: true, message: "Payment deleted" });
  } catch (err) {
    next(err);
  }
};

export const getContractRemainingAmount = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [{ model: Service, attributes: ["price"] }],
    });

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    const totalPaid =
      (await Payment.sum("amount", {
        where: { contract_id: req.params.id },
      })) || 0;
    const remaining = contract.service.price - totalPaid;

    res.status(200).json({
      success: true,
      message: "Remaining amount calculated",
      data: { remaining, totalPaid, total: contract.service.price },
    });
  } catch (err) {
    next(err);
  }
};
  