const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {}; // roomId -> [{ id, role, position }]

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ id, role, roomId = "main" }) => {
    if (!rooms[roomId]) rooms[roomId] = [];
    const player = { id, role, position: [0, 0, 0] };
    rooms[roomId].push(player);
    socket.join(roomId);

    // تحديث جميع اللاعبين
    io.to(roomId).emit("updatePlayers", rooms[roomId]);
  });

  socket.on("move", ({ id, pos, roomId = "main" }) => {
    const room = rooms[roomId];
    if (!room) return;
    const player = room.find((p) => p.id === id);
    if (player) player.position = pos;
    io.to(roomId).emit("playerMoved", { id, pos });
  });

  socket.on("disconnecting", () => {
    const socketRooms = Array.from(socket.rooms);
    socketRooms.forEach((roomId) => {
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
        io.to(roomId).emit("updatePlayers", rooms[roomId]);
      }
    });
  });
});

server.listen(5000, () => console.log("Socket.IO server running on port 5000"));
