import express from "express"
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth",authRouter)





app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})