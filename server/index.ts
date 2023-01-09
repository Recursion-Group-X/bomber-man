const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");
import { Player } from "./player";
import { Bomb } from "./bomb";
import { Room, RoomMap } from "./room";

const rooms: RoomMap = {};

app.use(cors());
app.use(express.json());

const server = app.listen("3001", () => {
  console.log("Server is Running");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("join_room", (data) => {
    let room: Room;
    if (rooms[data.roomName] === undefined) {
      room = new Room(data.roomName);
      rooms[data.roomName] = room;
    }
    room = rooms[data.roomName];
    socket.join(data.roomName);
    const newPlayer = new Player(
      data.playerName,
      rooms[data.roomName].players.length + 1
    );
    room.addPlayer(newPlayer);
    sendGameStatus(room, socket);
    socket.emit("send_player_id", room.players.length);
    console.log("User Joined Room: " + data.roomName);
  });

  socket.on("start_game", (data) => {
    const room: Room = rooms[data.roomName];
    console.log("game start: ", room.roomName);
    room.startGame();
    socket.emit("initialize_game", {
      players: room.players,
      stage: room.stage.board,
    });
    socket.to(data.roomName).emit("initialize_game", {
      players: room.players,
      stage: room.stage.board,
    });
  });

  socket.on("player_interval", (data) => {
    const room: Room = rooms[data.roomName];
    if (room.getPlayer(data.player.playerId) == null) return;
    const player: Player = room.getPlayer(data.player.playerId);
    player.direction = data.player.direction;
    player.move(room.stage);
    if (!player.isAlive) {
      room.removePlayer(player);
    }
    if (room.players.length <= 0) {
      socket.to(data.roomName).emit("send_game_result", room.deadPlayers);
      socket.emit("send_game_result", room.deadPlayers);
      resetRoom(room.roomName);
    }
    sendGameStatus(room, socket);
  });

  socket.on("player_bomb", (data) => {
    const room = rooms[data.roomName];
    const player: Player = room.getPlayer(data.player.playerId);
    player.putBomb(room.stage);
    sendGameStatus(room, socket);
  });

  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
  });

  socket.on("disconnect", () => {
    console.log("disconnected.");
  });
});

function sendGameStatus(room: Room, socket: any): void {
  socket.to(room.roomName).emit("send_game_status", {
    players: room.players,
    stage: room.stage.board,
  });
  socket.emit("send_game_status", {
    players: room.players,
    stage: room.stage.board,
  });
}

function resetRoom(roomName): void {
  rooms[roomName] = new Room(roomName);
}
