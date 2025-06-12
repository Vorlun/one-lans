import { Message } from "../models/message.model.js";
import { Client } from "../models/client.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Contract } from "../models/contracts.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: Client,
          as: "senderClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "senderFreelancer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Contract,
          attributes: ["id", "start_date", "end_date"],
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: "All messages retrieved",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: "senderClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "senderFreelancer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Contract,
          attributes: ["id", "start_date", "end_date"],
        },
      ],
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message retrieved",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.update(req.body);
    res.status(200).json({
      success: true,
      message: "Message updated",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.destroy();
    res.status(200).json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    next(error);
  }
};
