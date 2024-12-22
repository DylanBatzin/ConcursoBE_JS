import express from "express"
import userroutes from './routes/USERS.routes.js'
import statusroutes from './routes/STATUS.routes.js'
import roleroutes from './routes/ROLES.routes.js'
import categoryroutes from './routes/CATEGORIES.routes.js'
import productroutes from './routes/PRODUCTS.routes.js'
import orderroutes from './routes/ORDERS.routes.js'

const app = express()
app.use(express.json())
app.use(userroutes,statusroutes,roleroutes,categoryroutes,productroutes,orderroutes)


export default app