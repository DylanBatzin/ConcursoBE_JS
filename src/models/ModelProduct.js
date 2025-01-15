import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js";

const Product = sequelize.define("Product", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  Code: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Brand: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  Category: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'CATEGORIES',
      key: 'Uuid'
    }
  },
  StatusUuid: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'STATUS',
      key: 'Uuid'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updateAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "PRODUCTS",
  schema: "DA",
  timestamps: false,
});

export default Product;