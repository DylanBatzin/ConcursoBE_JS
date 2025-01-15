import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js"; // Conexión a la base de datos

const Order = sequelize.define("Order", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  UserUuid: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  StatusUuid: {
    type: DataTypes.UUID,
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
  },
}, {
  tableName: "ORDERS", // Nombre de la tabla en la base de datos
  schema: "DA",       // Esquema en la base de datos
  timestamps: false,  // Sequelize manejará manualmente las fechas
});

export default Order;
