import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js";

const Role = sequelize.define("Role", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING(50),
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
  tableName: "ROLES",
  schema: "DA",
  timestamps: false,
});

export default Role;