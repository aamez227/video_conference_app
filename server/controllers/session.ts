import { Request, Response } from "express";
import { db } from "../connect";

export const createSession = async (req: any, res: Response): Promise<void> => {
    const { sessionName, sessionTime, timerDuration } = req.body;
    const hostId = req.id;
    const participants: any[] = [];
    const raisedHands: any[] = [];
    const q = "INSERT INTO conference_sessions (hostId, sessionName, sessionTime, timerDuration, participants, raisedHands) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(q, [hostId, sessionName, sessionTime, timerDuration, JSON.stringify(participants), JSON.stringify(raisedHands)], (err, result) => {
        if (err) return res.status(500).json(err);

        const sessionId = result.insertId;
        const getSessionQuery = "SELECT * FROM conference_sessions WHERE id = ?";
        db.query(getSessionQuery, [sessionId], (err, sessionData) => {
            if (err) return res.status(500).json(err);

            if (sessionData.length > 0) {
                return res.status(201).json({ message: 'Session created successfully', session: sessionData[0] });
            } else {
                return res.status(500).json({ message: 'Failed to fetch created session details' });
            }
        });
    });
};


export const getAllSessions = async (req: any, res: Response): Promise<void> => {
    const hostId = req.id;

    const q = "SELECT * FROM conference_sessions WHERE hostId=?";

    db.query(q, [hostId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: 'No sessions found for the host' });
        }
        return res.json(data);
    });
};

export const getSessionDetails = async (req: any, res: Response): Promise<void> => {
    const sessionId = req.params.sessionId;
    const hostId = req.id;

    const q = `
        SELECT 
            conference_sessions.*, 
            CONCAT('[', GROUP_CONCAT(
                JSON_OBJECT(
                    'name', participants.name,
                    'sessionId', participants.sessionId
                )
                ORDER BY participants.name
            ), ']') AS participants
        FROM 
            conference_sessions
        LEFT JOIN 
            participants 
            ON participants.sessionId = conference_sessions.id
        WHERE 
            conference_sessions.id = ? AND conference_sessions.hostId = ?
        GROUP BY 
            conference_sessions.id
    `;

    db.query(q, [sessionId, hostId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        const participants = JSON.parse(data[0].participants);
        data[0].participants = participants;
        return res.json(data[0]);
    });
};

export const updateSessionDetails = async (req: any, res: Response): Promise<void> => {
    const sessionId = req.params.sessionId;
    const hostId = req.id;
    const { sessionName, sessionTime, isExpired, timerDuration } = req.body;

    const sessionExistQuery = "SELECT * FROM conference_sessions WHERE id = ? AND hostId = ?";
    db.query(sessionExistQuery, [sessionId, hostId], (err, sessionData) => {
        if (err) return res.status(500).json(err);

        if (sessionData.length === 0) {
            return res.status(404).json({ message: 'Session not found or unauthorized' });
        }

        const updateQuery = "UPDATE conference_sessions SET sessionName = ?, sessionTime = ?, isExpired = ?, timerDuration = ? WHERE id = ?";
        db.query(updateQuery, [sessionName, sessionTime, isExpired, timerDuration, sessionId], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ message: 'Session updated successfully' });
        });
    });
};

export const deleteSession = async (req: any, res: Response): Promise<void> => {
    const sessionId = req.params.sessionId;
    const hostId = req.id;

    const sessionExistQuery = "SELECT * FROM conference_sessions WHERE id = ? AND hostId = ?";
    db.query(sessionExistQuery, [sessionId, hostId], (err, sessionData) => {
        if (err) return res.status(500).json(err);

        if (sessionData.length === 0) {
            return res.status(404).json({ message: 'Session not found or unauthorized' });
        }

        const deleteParticipantsQuery = "DELETE FROM participants WHERE sessionId = ?";
        db.query(deleteParticipantsQuery, [sessionId], (err, result) => {
            if (err) return res.status(500).json(err);

            const deleteSessionQuery = "DELETE FROM conference_sessions WHERE id = ?";
            db.query(deleteSessionQuery, [sessionId], (err, result) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json({ message: 'Session deleted successfully' });
            });
        });
    });
};

export const joinSession = async (req: Request, res: Response): Promise<void> => {
    const { sessionId, name } = req.body;

    const sessionExistQuery = "SELECT id FROM conference_sessions WHERE id = ?";
    db.query(sessionExistQuery, [sessionId], (err, sessionData) => {
        if (err) return res.status(500).json(err);

        if (sessionData.length === 0) {
            return res.status(404).json({ message: 'Session does not exist' });
        }

        const participantQuery = "SELECT id FROM participants WHERE sessionId = ? AND name = ?";
        db.query(participantQuery, [sessionId, name], (err, existingParticipants) => {
            if (err) return res.status(500).json(err);

            if (existingParticipants.length > 0) {
                const participantId = existingParticipants[0].id;

                const fetchParticipantsQuery = "SELECT participants FROM conference_sessions WHERE id = ?";
                db.query(fetchParticipantsQuery, [sessionId], (err, sessionData) => {
                    if (err) return res.status(500).json(err);

                    const participantsArray = JSON.parse(sessionData[0].participants);

                    if (participantsArray.includes(participantId)) {
                        return res.status(400).json({ message: 'Participant already exists in this session' });
                    }

                    participantsArray.push(participantId);
                    const updateParticipantsQuery = "UPDATE conference_sessions SET participants = ? WHERE id = ?";
                    db.query(updateParticipantsQuery, [JSON.stringify(participantsArray), sessionId], (err) => {
                        if (err) return res.status(500).json(err);

                        return res.status(201).json({ message: 'Joined session successfully', participantId: participantId });
                    });
                });
            } else {
                const createParticipantQuery = "INSERT INTO participants (sessionId, name) VALUES (?, ?)";
                db.query(createParticipantQuery, [sessionId, name], (err, result) => {
                    if (err) return res.status(500).json(err);

                    const participantId = result.insertId;

                    const fetchParticipantsQuery = "SELECT participants FROM conference_sessions WHERE id = ?";
                    db.query(fetchParticipantsQuery, [sessionId], (err, sessionData) => {
                        if (err) return res.status(500).json(err);

                        const participantsArray = JSON.parse(sessionData[0].participants);

                        if (participantsArray.includes(participantId)) {
                            return res.status(500).json({ message: 'Participant ID already exists in the participants array' });
                        }

                        participantsArray.push(participantId);
                        const updateParticipantsQuery = "UPDATE conference_sessions SET participants = ? WHERE id = ?";
                        db.query(updateParticipantsQuery, [JSON.stringify(participantsArray), sessionId], (err) => {
                            if (err) return res.status(500).json(err);

                            return res.status(201).json({ message: 'Joined session successfully', participantId: participantId });
                        });
                    });
                });
            }
        });
    });
};

export const getParticipantSession = async (req: any, res: Response): Promise<void> => {
    const sessionId = req.params.sessionId;
    console.log("SAdf", sessionId);
    const q = `
    SELECT 
    conference_sessions.*, 
    CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
            'name', participants.name,
            'sessionId', participants.sessionId
        )
        ORDER BY participants.name
    ), ']') AS participants,
    users.id AS hostId,
    users.fullName AS hostName,
    users.email AS hostEmail
FROM 
    conference_sessions
LEFT JOIN 
    participants 
    ON participants.sessionId = conference_sessions.id
LEFT JOIN
    users
    ON users.id = conference_sessions.hostId
WHERE 
    conference_sessions.id = ?
GROUP BY 
    conference_sessions.id
    `;

    db.query(q, [sessionId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        const participants = JSON.parse(data[0].participants);
        data[0].participants = participants;
        return res.json(data[0]);
    });
};