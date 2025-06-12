import express from "express";
import { idParamValidation } from "../validations/common.validation.js";
import {
  categoryCreateValidation,
  categoryUpdateValidation,
} from "../validations/category.validation.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categories.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", validateParams(idParamValidation), getCategoryById);
router.post("/", validateBody(categoryCreateValidation), createCategory);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(categoryUpdateValidation),
  updateCategory
);
router.delete("/:id", validateParams(idParamValidation), deleteCategory);

export default router;
