import { Admin } from "../models/admin.model.js";
import { Client } from "../models/client.model.js";
import { Freelancer } from "../models/freelancer.model.js";

export const getUserByRole = async (role, email) => {
  if (role === "admin") return await Admin.findOne({ where: { email } });
  if (role === "client") return await Client.findOne({ where: { email } });
  if (role === "freelancer")
    return await Freelancer.findOne({ where: { email } });
  return null;
};
