import express from "express";
import adminRouter from "./admin.routes.js";
import clientRouter from "./client.routes.js";
import freelancerRouter from "./freelancer.routes.js";
import authRouter from "./auth.routes.js"; 
import freelancerSkillsRouter from "./freelancer_skills.routes.js"
import skillsRouter from "./skills.routes.js"
import categoriesRouter from "./categories.routes.js"
import servicesRouter from "./services.routes.js"
import statusRouter from "./status.routes.js"
import contractRouter from "./contracts.routes.js"
import reviewRouter from "./review.routes.js"
import messageRouter from "./message.routes.js"
import paymentRouter from "./payment.routes.js"

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/client", clientRouter);
router.use("/freelancer", freelancerRouter);
router.use("/freelancerSkills", freelancerSkillsRouter)
router.use("/auth/:role", authRouter);
router.use("/skills", skillsRouter)
router.use("/categories", categoriesRouter)
router.use("/services", servicesRouter)
router.use("/status", statusRouter)
router.use("/contract", contractRouter)
router.use("/review", reviewRouter)
router.use("/message", messageRouter)
router.use("/payment", paymentRouter)

export default router;
