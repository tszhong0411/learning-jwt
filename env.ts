import dotenv from "dotenv";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined");
}

export const env = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
