import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const portalDB = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: (msg) => {
    // Log only SQL errors
    if (msg.startsWith('ERROR:')) logger.error(msg);
  },
});

export default portalDB;
