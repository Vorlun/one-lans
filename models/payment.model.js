import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Contract } from "./contracts.model.js";

export const Payment = sequelize.define(
  "payments",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    paid_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

Contract.hasMany(Payment, { foreignKey: "contract_id" });
Payment.belongsTo(Contract, { foreignKey: "contract_id" });
