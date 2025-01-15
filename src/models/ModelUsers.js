import { DataTypes } from "sequelize";
import sequelize from "../database/conection.js"; // Importamos la conexión

const User = sequelize.define("User", {
  Uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  FullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  PhoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  BirthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  Rol: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UpdateAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "USERS", // Nombre de la tabla en la base de datos
  schema: "DA",      // Esquema de la tabla
  timestamps: false, // Si no usas `createdAt` y `updatedAt` estándar
});

export default User;
