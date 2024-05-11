import { Request, Response } from "express";
import { db } from "../connect";

export const getHostView = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};