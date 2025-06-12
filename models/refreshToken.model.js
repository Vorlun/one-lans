import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const RefreshToken = sequelize.define(
  "refresh_tokens",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "client", "freelancer"),
      allowNull: false,
    },
    token_hash: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.STRING },
    ip_address: { type: DataTypes.STRING },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    timestamps: false,
  }
);
