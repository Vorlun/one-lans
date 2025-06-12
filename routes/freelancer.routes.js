import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import {
  freelancerChangePasswordValidation,
  freelancerCreateValidation,
  freelancerUpdateValidation,
} from "../validations/freelancer.validation.js";
import { idParamValidation } from "../validations/common.validation.js";
import {
  createFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  verifyFreelancerEmail,
  getTopFreelancersByService,
} from "../controllers/freelancer.controller.js";
import { changePassword } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", getAllFreelancers);
router.get("/topFreelancerByService", getTopFreelancersByService);
router.get("/:id", validateParams(idParamValidation), getFreelancerById);
router.post("/", validateBody(freelancerCreateValidation), createFreelancer);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(freelancerUpdateValidation),
  updateFreelancer
);
router.put(
  "/:id/change-password",
  validateParams(idParamValidation),
  validateBody(freelancerChangePasswordValidation),
  changePassword
);
router.delete("/:id", validateParams(idParamValidation), deleteFreelancer);
router.get("/verify-email/:token", verifyFreelancerEmail);

export default router;
