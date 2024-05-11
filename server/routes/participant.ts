import express from "express";
import { raiseHand } from "../controllers/participant";

const router = express.Router()

router.put("/:participantId/:sessionId/raise-hand", raiseHand);

export default router