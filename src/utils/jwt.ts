import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_PAYLOAD } from "../constants.js"

dotenv.config();

const SHARED_SECRET = process.env.SHARED_SECRET

export function generateToken(): string {
    return jwt.sign({ app: JWT_PAYLOAD }, SHARED_SECRET, { expiresIn: "5m" });
}
