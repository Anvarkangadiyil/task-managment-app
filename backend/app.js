import express from "express"
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})