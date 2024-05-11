import { Request, Response } from "express";
import { db } from "../connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
}

const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const comparePassword = (password: string, hashedPassword: string): boolean => {
    return bcrypt.compareSync(password, hashedPassword);
};

const generateToken = (id: number): string => {
    return jwt.sign({ id }, "P58BbYYqwi");
};

export const register = (req: Request, res: Response): void => {
    const { fullName, email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], (err: Error | null, data: User[]) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        const hashedPassword = hashPassword(password);

        const insertQuery =
            "INSERT INTO users (`fullName`,`email`,`password`) VALUES (?)";

        const values = [fullName, email, hashedPassword];

        db.query(insertQuery, [values], (err: Error | null, data: any) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });
};

export const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], (err: Error | null, data: User[]) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        const isValidPassword = comparePassword(password, data[0].password);

        if (!isValidPassword)
            return res.status(400).json("Wrong password or email!");

        const token = generateToken(data[0].id);

        const { password: _, ...others } = data[0];

        res
            .cookie("accessToken", token, {
                httpOnly: true,
            })
            .status(200)
            .json(others);
    });
};


export const logout = (req: Request, res: Response): void => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    }).status(200).json("User has been logged out.");
};
