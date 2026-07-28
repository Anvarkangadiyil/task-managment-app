import { config } from "dotenv";

const envMode = process.env.NODE_ENV || "development";

config({ path: `.env.${envMode}.local` });

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  DIRECT_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;
