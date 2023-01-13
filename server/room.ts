import { Stage } from "./stage";
import { Player } from "./player";

interface DeadPlayer {
  name: string;
  playerId: number;
  deathTime: number;
  killedBy: string;
}

export class Room {
  players: Player[] = [];
  deadPlayers: DeadPlayer[] = [];
  roomName: string;
  stage: Stage;
  gameStartTime: number;
  constructor(roomName: string) {
    this.roomName = roomName;
    this.stage = new Stage();
  }

  startGame(): void {
    this.gameStartTime = new Date().getTime();
  }

  getPlayer(playerId: number): Player | null {
    for (let i: number = 0; i < this.players.length; i++) {
      if (this.players[i].playerId === playerId) {
        return this.players[i];
      }
    }
    return null;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  // disconnection
  removePlayerFromRoom(socketId: string): void {
    this.players = this.players.filter((p) => p.socketId !== socketId);
  }

  // dead
  removePlayer(player: Player): void {
    this.players = this.players.filter((p) => p.playerId !== player.playerId);
    this.deadPlayers.push({
      name: player.name,
      playerId: player.playerId,
      deathTime: (new Date().getTime() - this.gameStartTime) / 1000,
      killedBy: player.killedBy,
    });
  }
}
