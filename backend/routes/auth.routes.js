import { Router } from "express";
import { getMe, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authorize } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), signUp);
authRouter.post("/login", validate(loginSchema), signIn);
authRouter.post("/logout", signOut);
authRouter.get("/me", authorize, getMe);

export default authRouter;


