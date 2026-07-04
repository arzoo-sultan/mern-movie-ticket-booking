import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { inngest,functions } from "./inngest/index.js";
import {serve} from 'inngest/express'
import showRouter from "./routes/show.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import { stripeWebhooks } from "./controllers/stripewebhook.controller.js";
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.get("/debug-cors", (req, res) => {
  res.json({ corsOrigin: process.env.CORS_ORIGIN });
});
app.use(clerkMiddleware())
//Stripe Webhook
app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())//enables parsing of cookies in incoming requests
//routes
app.get("/",(req,res)=>{ res.send("Welcome to the server")})
app.use('/api/inngest',serve({
    client:inngest,
    functions
}))
app.use('/api/show',showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user/',userRouter)
// import userRouter from './routes/user.routes.js';//userRouter is a  name used for router coz in ES6 we can import (router) under a different name
// // routes declaration
// app.use("/api/v1/users",userRouter)//users is a prefix for requests that are coming to userRouter
//https://localhost:3000/users/register
//https://localhost:3000/api/v1/users/register
export {app};