import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { createSession , deleteSession, getAllSessions, getParticipantSession, getSessionDetails, joinSession, updateSessionDetails } from "../controllers/session";

const router = express.Router()

router.get("/participants/:sessionId", getParticipantSession);
router.post("/join", joinSession);

router.use(authenticateJWT);

router.route("/")
    .post(createSession)
    .get(getAllSessions);

router.route("/:sessionId")
    .get(getSessionDetails)
    .put(updateSessionDetails)
    .delete(deleteSession);

export default router