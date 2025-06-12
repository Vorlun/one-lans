import c from "config";
import { Sequelize } from "sequelize";

export default new Sequelize(
  c.get("db_name"), 
  c.get("db_username"),
  c.get("db_password"),
  {
    dialect: "postgres",
    logging: true,
    host: c.get("db_host"),
    port: c.get("db_port"),
  }
);
