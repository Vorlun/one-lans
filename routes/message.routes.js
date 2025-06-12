import express from "express";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { createMessage, deleteMessage, getAllMessages, getMessageById, updateMessage } from "../controllers/message.controller.js";
import { idParamValidation } from "../validations/common.validation.js";
import { messageCreateValidation, messageUpdateValidation} from "../validations/message.validation.js"
const router = express.Router();

router.post("/", validateBody(messageCreateValidation), createMessage);
router.get("/", getAllMessages);
router.get("/:id", validateParams(idParamValidation), getMessageById);
router.patch(
  "/:id",
  validateParams(idParamValidation),
  validateBody(messageUpdateValidation),
  updateMessage
);
router.delete("/:id", validateParams(idParamValidation), deleteMessage);

export default router;
