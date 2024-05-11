import express from "express";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/session";
import participantRoutes from "./routes/participant";
import cors from "cors";
import cookieParser from "cookie-parser";
import { server, app } from "./websocketServer";

// Middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/participants", participantRoutes);

// Ping endpoint
app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: 'VC server running successfully' });
});

// Server
const PORT: number = 8800;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
