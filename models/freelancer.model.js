import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Freelancer = sequelize.define(
  "freelancers",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    bio: { type: DataTypes.TEXT },
    experience_years: { type: DataTypes.INTEGER },
    avatar_url: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL },
    email_token: { type: DataTypes.STRING, unique: true },
    email_token_expire: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);
