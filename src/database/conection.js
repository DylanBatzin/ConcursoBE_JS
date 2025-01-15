import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mssql",
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: "SQLEXPRESS"
      }
    },
    logging: false
  }
);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};

export default sequelize;