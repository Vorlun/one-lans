import jwt from "jsonwebtoken";
import config from "config";

class JwtService {
  constructor({
    accessSecret,
    refreshSecret,
    accessExpiresIn,
    refreshExpiresInDays,
  }) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiresIn = accessExpiresIn;
    this.refreshExpiresIn = `${refreshExpiresInDays}d`;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    });
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.accessSecret);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecret);
  }
}

export const jwtServices = {
  admin: new JwtService({
    accessSecret: config.get("jwt.admin.accessSecret"),
    refreshSecret: config.get("jwt.admin.refreshSecret"),
    accessExpiresIn: config.get("jwt.admin.accessExpiresIn"),
    refreshExpiresInDays: config.get("jwt.admin.refreshExpiresInDays"),
  }),
  client: new JwtService({
    accessSecret: config.get("jwt.client.accessSecret"),
    refreshSecret: config.get("jwt.client.refreshSecret"),
    accessExpiresIn: config.get("jwt.client.accessExpiresIn"),
    refreshExpiresInDays: config.get("jwt.client.refreshExpiresInDays"),
  }),
  freelancer: new JwtService({
    accessSecret: config.get("jwt.freelancer.accessSecret"),
    refreshSecret: config.get("jwt.freelancer.refreshSecret"),
    accessExpiresIn: config.get("jwt.freelancer.accessExpiresIn"),
    refreshExpiresInDays: config.get("jwt.freelancer.refreshExpiresInDays"),
  }),
};
