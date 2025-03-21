import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SHARED_SECRET = process.env.SHARED_SECRET

interface AuthPayload {
    app: string;
}

export function authenticateRequest(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SHARED_SECRET) as AuthPayload;
        req.body.auth = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
}


