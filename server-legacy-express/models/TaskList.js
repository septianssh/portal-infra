// models/TaskList.js
import { DataTypes } from "sequelize";
import portalDB from "../utils/database.js";

const TaskList = portalDB.define("portal_tasklist", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Running",
  },
  jobId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "N/A",
  },
});

export default TaskList;
