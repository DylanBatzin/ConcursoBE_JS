import User from './ModelUsers.js';
import Order from './ModelOrders.js';
import OrderDetail from './ModelOrderDetail.js';
import Status from './ModelStatus.js';
import Role from './ModelRoles.js';
import Product from './ModelProduct.js';
import Category from './ModelCategory.js';

// Relaciones User - Role
User.belongsTo(Role, {
  foreignKey: 'Rol',
  targetKey: 'Uuid'
});

Role.hasMany(User, {
  foreignKey: 'Rol',
  sourceKey: 'Uuid'
});

// Relaciones User - Order
User.hasMany(Order, {
  foreignKey: 'UserUuid',
  sourceKey: 'Uuid'
});

Order.belongsTo(User, {
  foreignKey: 'UserUuid',
  targetKey: 'Uuid'
});

// Relaciones Order - OrderDetail
Order.hasMany(OrderDetail, {
  foreignKey: 'OrderUuid',
  sourceKey: 'Uuid'
});

OrderDetail.belongsTo(Order, {
  foreignKey: 'OrderUuid',
  targetKey: 'Uuid'
});

// Relaciones Order - Status
Order.belongsTo(Status, {
  foreignKey: 'StatusUuid',
  targetKey: 'Uuid'
});

Status.hasMany(Order, {
  foreignKey: 'StatusUuid',
  sourceKey: 'Uuid'
});

// Relaciones Product - Category
Product.belongsTo(Category, {
  foreignKey: 'Category',
  targetKey: 'Uuid'
});

Category.hasMany(Product, {
  foreignKey: 'Category',
  sourceKey: 'Uuid'
});

// Relaciones Product - Status
Product.belongsTo(Status, {
  foreignKey: 'StatusUuid',
  targetKey: 'Uuid'
});

Status.hasMany(Product, {
  foreignKey: 'StatusUuid',
  sourceKey: 'Uuid'
});

// Relaciones Product - OrderDetail
Product.hasMany(OrderDetail, {
  foreignKey: 'ProductUuuid',
  sourceKey: 'Uuid'
});

OrderDetail.belongsTo(Product, {
  foreignKey: 'ProductUuuid',
  targetKey: 'Uuid'
});

// Exportar los modelos con sus relaciones
export {
  User,
  Order,
  OrderDetail,
  Status,
  Role,
  Product,
  Category
};