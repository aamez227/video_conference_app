import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {origin:"http://localhost:3000", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], credentials: true},
});

io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
  
    socket.on("host-join-room", (roomId: string) => {
    console.log(`Socket host-join-room: ${roomId}`);
      socket.join(roomId);
    });
  
    socket.on("participant-join-room", (roomId: string, name: string) => {
      console.log(`Socket participant-join-room: ${roomId}`);
      socket.join(roomId);
      io.to(roomId).emit("participant-join-room", name);
    });
  
    socket.on("start-timer", (roomId: string, duration: number) => {
      io.to(roomId).emit("timer-started", duration);
    });
  
    socket.on("raise-hand", (roomId: string, participantId: string) => {
      io.to(roomId).emit("hand-raised", participantId);
    });
  
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

export { app, server, io };
