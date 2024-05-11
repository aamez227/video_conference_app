import { Request, Response } from "express";
import { db } from "../connect";

export const raiseHand = async (req: Request, res: Response): Promise<void> => {
    const participantId = req.params.participantId;
    const sessionId = req.params.sessionId;

    const sessionCheckQuery = "SELECT id FROM conference_sessions WHERE id = ?";
    db.query(sessionCheckQuery, [sessionId], (sessionErr, sessionResult) => {
        if (sessionErr) {
            return res.status(500).json(sessionErr);
        } else if (sessionResult.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        } else {
            const raiseHandQuery = "UPDATE participants SET raisedHand = true WHERE id = ?";
            db.query(raiseHandQuery, [participantId], (raiseHandErr, raiseHandResult) => {
                if (raiseHandErr) {
                    return res.status(500).json(raiseHandErr);
                }

                const checkRaisedHandsQuery = "SELECT raisedHands FROM conference_sessions WHERE id = ?";
                db.query(checkRaisedHandsQuery, [sessionId], (checkErr, checkResult) => {
                    if (checkErr) {
                        return res.status(500).json(checkErr);
                    }

                    let raisedHands = JSON.parse(checkResult[0].raisedHands || '[]');
                        raisedHands.push(participantId);
                        raisedHands = JSON.stringify(raisedHands);
                        const updateSessionQuery = "UPDATE conference_sessions SET raisedHands = ? WHERE id = ?";
                        db.query(updateSessionQuery, [raisedHands, sessionId], (updateErr, updateResult) => {
                            if (updateErr) {
                                return res.status(500).json(updateErr);
                            }
                            return res.status(200).json({ message: 'Hand raised successfully' });
                        });
                });
            });
        }
    });
};
