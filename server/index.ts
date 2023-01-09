const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");
import { Player } from "./player";
import { Room } from "./room";

const rooms = [
  new Room("Room 1"),
  new Room("Room 2"),
  new Room("Room 3"),
  new Room("Room 4"),
  new Room("Room 5"),
  new Room("Room 6"),
  new Room("Room 7"),
  new Room("Room 8"),
];

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

  socket.on("enter_lobby", () => {
    socket.emit("send_rooms", rooms);
  });

  socket.on("join_room", (data) => {
    let room: Room = getRoom(data.roomName);
    socket.join(room.roomName);
    const newPlayer = new Player(
      data.playerName,
      room.players.length + 1,
      socket.id
    );
    room.addPlayer(newPlayer);
    sendGameStatus(room, socket);
    socket.emit("send_player_id", room.players.length);
    console.log("User Joined Room: " + room.roomName);
  });

  socket.on("start_game", (data) => {
    const room: Room = getRoom(data.roomName);
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
    const room: Room = getRoom(data.roomName);
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
    const room = getRoom(data.roomName);
    const player: Player = room.getPlayer(data.player.playerId);
    player.putBomb(room.stage);
    sendGameStatus(room, socket);
  });

  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
  });

  socket.on("disconnect", () => {
    removeSocketFromRooms(socket);
    console.log("disconnected.");
    socket.emit("disconnection");
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

function getRoom(roomName: string): Room {
  const room: Room[] | null = rooms.filter(
    (room) => room.roomName === roomName
  );
  if (room.length === 0) return null;
  return room[0];
}

function removeSocketFromRooms(socket): void {
  for (let i: number = 0; i < rooms.length; i++) {
    const room: Room = rooms[i];
    socket.leave(room.roomName);
    room.removePlayerFromRoom(socket.id);
  }
}

function resetRoom(roomName): void {
  for (let i: number = 0; i < rooms.length; i++) {
    const room: Room = rooms[i];
    if (room.roomName === roomName) {
      rooms[i] = new Room(roomName);
      return;
    }
  }
  return;
}
