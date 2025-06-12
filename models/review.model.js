// models/review.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Review = sequelize.define(
  "reviews",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    from_user_id: { type: DataTypes.INTEGER, allowNull: false },
    to_user_id: { type: DataTypes.INTEGER, allowNull: false },
    contract_id: { type: DataTypes.INTEGER, allowNull: false },

    from_user_type: {
      type: DataTypes.ENUM("client", "freelancer"),
      allowNull: false,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },

    comment: { type: DataTypes.TEXT },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);
