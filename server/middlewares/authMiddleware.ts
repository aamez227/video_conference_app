import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secretKey = "P58BbYYqwi";

interface DecodedToken {
    id: string;
}

export const authenticateJWT = (
    req: Request & { id?: string },
    res: Response,
    next: NextFunction
): void => {
    const token: string = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

    if (token) {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" });
            } else {
                req.id = (decodedToken as DecodedToken).id;
                next();
            }
        });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};