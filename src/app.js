import express from "express"
import userroutes from './routes/USERS.routes.js'

const app = express()
app.use(express.json())
app.use(userroutes)


export default app