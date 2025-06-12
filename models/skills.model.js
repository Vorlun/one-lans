import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Skill = sequelize.define(
  "skills",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { timestamps: false }
);
