import { Category } from "./categories.model.js";
import { Client } from "./client.model.js";
import { Contract } from "./contracts.model.js";
import { Freelancer } from "./freelancer.model.js";
import { FreelancerSkill } from "./freelancer_skills.model.js";
import { Message } from "./message.model.js";
import { Payment } from "./payment.model.js";
import { Review } from "./review.model.js";
import { Service } from "./services.model.js";
import { Skill } from "./skills.model.js";
import { Status } from "./status.model.js";

export const applyAssociations = () => {
  // ========== Freelancer ↔ Skill (Many-to-Many) ==========
  Freelancer.belongsToMany(Skill, {
    through: FreelancerSkill,
    foreignKey: "freelancer_id",
    otherKey: "skill_id",
  });

  Skill.belongsToMany(Freelancer, {
    through: FreelancerSkill,
    foreignKey: "skill_id",
    otherKey: "freelancer_id",
  });

  // ========== Freelancer ↔ Service (One-to-Many) ==========
  Freelancer.hasMany(Service, { foreignKey: "freelancer_id" });
  Service.belongsTo(Freelancer, { foreignKey: "freelancer_id" });

  // ========== Category ↔ Service (One-to-Many) ==========
  Category.hasMany(Service, { foreignKey: "category_id" });
  Service.belongsTo(Category, { foreignKey: "category_id" });

  // ========== Client ↔ Contract (One-to-Many) ==========
  Client.hasMany(Contract, { foreignKey: "client_id" });
  Contract.belongsTo(Client, { foreignKey: "client_id" });

  // ========== Freelancer ↔ Contract (One-to-Many) ==========
  Freelancer.hasMany(Contract, { foreignKey: "freelancer_id" });
  Contract.belongsTo(Freelancer, { foreignKey: "freelancer_id" });

  // ========== Service ↔ Contract (One-to-Many) ==========
  Service.hasMany(Contract, { foreignKey: "service_id" });
  Contract.belongsTo(Service, { foreignKey: "service_id" });

  // ========== Status ↔ Contract (One-to-Many) ==========
  Status.hasMany(Contract, { foreignKey: "status_id" });
  Contract.belongsTo(Status, { foreignKey: "status_id" });

  // ========== Contract ↔ Review (One-to-Many) ==========
  Contract.hasMany(Review, { foreignKey: "contract_id" });
  Review.belongsTo(Contract, { foreignKey: "contract_id" });

  // ========== Review ↔ Client & Freelancer (Polymorphic) ==========
  Review.belongsTo(Client, {
    foreignKey: "from_user_id",
    as: "fromClient",
    constraints: false,
  });
  Review.belongsTo(Client, {
    foreignKey: "to_user_id",
    as: "toClient",
    constraints: false,
  });
  Review.belongsTo(Freelancer, {
    foreignKey: "from_user_id",
    as: "fromFreelancer",
    constraints: false,
  });
  Review.belongsTo(Freelancer, {
    foreignKey: "to_user_id",
    as: "toFreelancer",
    constraints: false,
  });

  // ========== Contract ↔ Message (One-to-Many) ==========
  Contract.hasMany(Message, { foreignKey: "contract_id" });
  Message.belongsTo(Contract, { foreignKey: "contract_id" });

  // ========== Message ↔ Client & Freelancer (Polymorphic sender) ==========
  Message.belongsTo(Client, {
    foreignKey: "sender_id",
    as: "senderClient",
    constraints: false,
  });
  Message.belongsTo(Freelancer, {
    foreignKey: "sender_id",
    as: "senderFreelancer",
    constraints: false,
  });

  // ========== Contract ↔ Payment (One-to-Many) ==========
  Contract.hasMany(Payment, { foreignKey: "contract_id" });
  Payment.belongsTo(Contract, { foreignKey: "contract_id" });
};
