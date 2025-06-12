import { Admin } from "../models/admin.model.js";
import { Client } from "../models/client.model.js";
import { Freelancer } from "../models/freelancer.model.js";

export const getUserByRole = async (role, email) => {
  if (!role || !email) return null;

  switch (role) {
    case "admin":
      return await Admin.findOne({ where: { email } });
    case "client":
      return await Client.findOne({ where: { email } });
    case "freelancer":
      return await Freelancer.findOne({ where: { email } });
    default:
      return null;
  }
};
