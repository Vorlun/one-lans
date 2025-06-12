import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const FreelancerSkill = sequelize.define(
  "freelancer_skills",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER, allowNull: false },
    skill_id: { type: DataTypes.INTEGER, allowNull: false },
    level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced", "expert"),
      allowNull: false,
    },
  },
  { timestamps: false }
);
