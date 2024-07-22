import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);

app.use(express.static("public"));

const io = new SocketServer(server);

let users = [];

io.on("connection", (socket) => {
  console.log("Made Socket Connection", socket.id);

  socket.on("join", (data) => {
    users.push(data);
    io.sockets.emit("join", data);
  });

  socket.on("joined", () => {
    socket.emit("joined", users);
  });

  socket.on("rollDice", (data) => {
    users[data.id].pos = data.pos;
    const turn = data.num != 6 ? (data.id + 1) % users.length : data.id;
    io.sockets.emit("rollDice", data, turn);
  });

  socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
