import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Client = sequelize.define(
  "clients",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    avatar_url: { type: DataTypes.TEXT },
    company_name: { type: DataTypes.STRING },
    email_token: { type: DataTypes.STRING, unique: true },
    email_token_expire: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);
