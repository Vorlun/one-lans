import express from "express";
import { reviewCreateValidation, reviewUpdateValidation } from "../validations/review.validation.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from "../controllers/review.controller.js";
import { idParamValidation } from "../validations/common.validation.js";

const router = express.Router();

router.post("/", validateBody(reviewCreateValidation), createReview);
router.get("/", getAllReviews);
router.get("/:id", validateParams(idParamValidation), getReviewById);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(reviewUpdateValidation),
  updateReview
);
router.delete("/:id", validateParams(idParamValidation), deleteReview);

export default router;
