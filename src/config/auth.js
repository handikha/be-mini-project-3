import dotenv from "dotenv";

dotenv.config();

export const secret = process.env.JWT_SECRET || "secret";
export const expiresIn = process.env.JWT_EXPIRATION_TIME || "1d";
