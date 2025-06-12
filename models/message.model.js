import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Message = sequelize.define(
  "messages",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    contract_id: { type: DataTypes.INTEGER, allowNull: false },

    sender_id: { type: DataTypes.INTEGER, allowNull: false },

    sender_type: {
      type: DataTypes.ENUM("client", "freelancer"),
      allowNull: false,
    },

    content: { type: DataTypes.TEXT, allowNull: false },

    send_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);
