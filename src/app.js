import express from "express";
import cors from "cors"; // Importa el paquete cors
import userroutes from './routes/USERS.routes.js';
import statusroutes from './routes/STATUS.routes.js';
import roleroutes from './routes/ROLES.routes.js';
import categoryroutes from './routes/CATEGORIES.routes.js';
import productroutes from './routes/PRODUCTS.routes.js';
import orderroutes from './routes/ORDERS.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());


app.use(userroutes);
app.use(statusroutes);
app.use(roleroutes);
app.use(categoryroutes);
app.use(productroutes);
app.use(orderroutes);

export default app;
