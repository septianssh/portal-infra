// models/User.js

import { DataTypes } from "sequelize";
import portalDB from "../utils/database.js";

const User = portalDB.define("portal_users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});

export default User;
