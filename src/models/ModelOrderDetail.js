import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js";
import Order from "./ModelOrders.js";

const OrderDetail = sequelize.define("OrderDetail", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  OrderUuid: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'ORDERS',
      key: 'Uuid'
    }
  },
  ProductUuuid: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'PRODUCTS',
      key: 'Uuid'
    }
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SubTotal: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: "ORDERDETAILS",
  schema: "DA",
  timestamps: false,
});

// Definir las relaciones
OrderDetail.belongsTo(Order, {
  foreignKey: 'OrderUuid',
  targetKey: 'Uuid'
});

Order.hasMany(OrderDetail, {
  foreignKey: 'OrderUuid',
  sourceKey: 'Uuid'
});

export default OrderDetail;