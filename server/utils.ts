import { Room } from "./room";
import { Player } from "./player";
import { rooms } from "./index";

export const joinRoom = (socket, data) => {
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
};

export const startGame = (socket, data) => {
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
};

export const playerInterval = (socket, data) => {
  const room: Room = getRoom(data.roomName);
  if (room.getPlayer(data.player.playerId) == null) return;
  const player: Player = room.getPlayer(data.player.playerId);
  player.direction = data.player.direction;
  player.move(room.stage); 
  if (!player.isAlive) {
    room.removePlayer(player);
  }
  if (room.players.length <= 1) {
    finishGame(socket, room);
  }
  sendGameStatus(room, socket);
  if (!room.isShrinking && room.getGameTime() > 120) {
    room.startShrink();
  }
};

export const playerBomb = (socket, data) => {
  const room = getRoom(data.roomName);
  const player: Player = room.getPlayer(data.player.playerId);
  player.putBomb(room.stage);
  sendGameStatus(room, socket);
};

export const leaveRoom = (socket, roomName) => {
  socket.leave(roomName);
  const room: Room = getRoom(roomName);
  room.players = room.players.filter((player) => player.socketId !== socket.id);
};

function getRoom(roomName: string): Room {
  const room: Room[] | null = rooms.filter(
    (room) => room.roomName === roomName
  );
  if (room.length === 0) return null;
  return room[0];
}

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
  for (let i: number = 0; i < rooms.length; i++) {
    const room: Room = rooms[i];
    if (room.roomName === roomName) {
      rooms[i] = new Room(roomName);
      return;
    }
  }
  return;
}

function finishGame(socket, room): void {
  for (let i = 0; i < room.players.length; i++)
    room.removePlayer(room.players[i]);
  socket.to(room.roomName).emit("send_game_result", room.deadPlayers);
  socket.emit("send_game_result", room.deadPlayers);
  resetRoom(room.roomName);
}
