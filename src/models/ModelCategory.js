import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js";

const Category = sequelize.define("Category", {
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
  tableName: "CATEGORIES",
  schema: "DA",
  timestamps: false,
});

export default Category;