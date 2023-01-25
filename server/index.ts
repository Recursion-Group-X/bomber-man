const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");
import { connect } from "http2";
import { Room } from "./room";
import {
  joinRoom,
  leaveRoom,
  playerBomb,
  playerInterval,
  startGame,
} from "./utils";

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!").end();
});

export const rooms = [
  new Room("Room 1"),
  new Room("Room 2"),
  new Room("Room 3"),
  new Room("Room 4"),
];

app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT || 8080, () => {
  // const server = app.listen("3001", () => {
  console.log("Server is Running");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("enter_lobby", () => {
    socket.emit("send_rooms", rooms);
  });

  socket.on("join_room", (data) => {
    joinRoom(socket, data);
  });

  socket.on("start_game", (data) => {
    startGame(socket, data);
  });

  socket.on("player_interval", (data) => {
    playerInterval(socket, data);
  });

  socket.on("player_bomb", (data) => {
    playerBomb(socket, data);
  });

  socket.on("leave_room", (roomName) => {
    leaveRoom(socket, roomName);
  });

  socket.on("disconnect", () => {
    removeSocketFromRooms(socket);
    console.log("disconnected.");
  });
});

function removeSocketFromRooms(socket): void {
  for (let i: number = 0; i < rooms.length; i++) {
    const room: Room = rooms[i];
    socket.leave(room.roomName);
    room.removePlayerFromRoom(socket.id);
    if (room.players.length === 0 && room.deadPlayers.length === 0) {
      rooms[i] = new Room(room.roomName);
    }
  }
}
