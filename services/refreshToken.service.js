import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { RefreshToken } from "../models/refreshToken.model.js";
import config from "config";

export const refreshTokenService = {
  async save({ user_id, role, refreshToken, userAgent, ipAddress }) {
    const token_hash = await bcrypt.hash(refreshToken, 10);
    const days = config.get(`jwt.${role}.refreshExpiresInDays`);
    const expires_at = new Date(Date.now() + days * 86400000);

    return RefreshToken.create({
      user_id,
      role,
      token_hash,
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at,
    });
  },

  async findValid({ user_id, role, refreshToken }) {
    const tokens = await RefreshToken.findAll({
      where: {
        user_id,
        role,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    for (const token of tokens) {
      if (await bcrypt.compare(refreshToken, token.token_hash)) {
        return token;
      }
    }

    return null;
  },

  async deleteOne(id) {
    return RefreshToken.destroy({ where: { id } });
  },

  async deleteAll({ user_id, role }) {
    return RefreshToken.destroy({ where: { user_id, role } });
  },
};
