import jwt from "jsonwebtoken";
import config from "config";

class JwtService {
  constructor(roleKey) {
    const jwtConfig = config.get(`jwt.${roleKey}`);
    this.accessSecret = jwtConfig.accessSecret;
    this.refreshSecret = jwtConfig.refreshSecret;
    this.accessExpiresIn = jwtConfig.accessExpiresIn;
    this.refreshExpiresIn = `${jwtConfig.refreshExpiresInDays}d`;
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

const supportedJwtRoles = ["admin", "client", "freelancer"];
export const jwtServices = supportedJwtRoles.reduce((acc, roleKey) => {
  acc[roleKey] = new JwtService(roleKey);
  return acc;
}, {});
