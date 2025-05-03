import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://vercel-deployment-black-eight.vercel.app"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //io.emit() is used to send the event to all the conected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("callUser", ({ userToCall, signalData, from }) => {
    console.log("🚀 ~ socket.on ~ from:", from);
    console.log("🚀 ~ socket.on ~ signalData:", signalData);
    console.log("🚀 ~ socket.on ~ userToCall:", userToCall);
    console.log("triggerf in this side");
    io.to(userSocketMap[userToCall]).emit("incomingCall", {
      signal: signalData,
      from,
    });
  });

  socket.on("calling", (message) => {
    socket.broadcast.emit("calling", message);
  });

  socket.on("disconnected", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
