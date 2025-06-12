import express from "express";
import config from "config";
import { errorHandler } from "./middlewares/errorHandler.js";
import mainRouter from "./routes/index.routes.js";
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";
import logger from "./services/logger.service.js";

import { applyAssociations } from "./models/associations.js";
applyAssociations();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRouter);

app.use((req, res, next) => {
  logger.warn(`Not Found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    type: "NotFound",
    message: `API endpoint ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const PORT = config.get("port") || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully.");

    await sequelize.sync({ alter: true });
    logger.info("Database synchronized.");

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Fatal error starting server: " + error.message);
    process.exit(1);
  }
})();
