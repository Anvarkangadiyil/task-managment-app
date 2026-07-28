import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import taskRoute from "./routes/tasks.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

