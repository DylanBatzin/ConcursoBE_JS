import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js";

const Status = sequelize.define("Status", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  UpdateAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "STATUS",
  schema: "DA",
  timestamps: false,
});

export default Status;