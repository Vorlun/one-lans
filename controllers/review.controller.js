import { Review } from "../models/review.model.js";
import { Client } from "../models/client.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Contract } from "../models/contracts.model.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Client,
          as: "fromClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Client,
          as: "toClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "fromFreelancer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "toFreelancer",
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
      message: "All reviews retrieved",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: "fromClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Client,
          as: "toClient",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "fromFreelancer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Freelancer,
          as: "toFreelancer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Contract,
          attributes: ["id", "start_date", "end_date"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review retrieved",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.update(req.body);
    res.status(200).json({
      success: true,
      message: "Review updated",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.destroy();
    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    next(error);
  }
};
