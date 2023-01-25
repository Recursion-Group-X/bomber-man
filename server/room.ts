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
  isShrinking: boolean = false;
  constructor(roomName: string) {
    this.roomName = roomName;
    this.stage = new Stage();
  }

  startGame(): void {
    this.gameStartTime = new Date().getTime();
  }

  getGameTime(): number {
    return (new Date().getTime() - this.gameStartTime) / 1000;
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
    let deathTime = this.getGameTime();
    this.players = this.players.filter((p) => p.playerId !== player.playerId);
    if (this.players.length === 0) deathTime = this.getGameTime() + 10;
    this.deadPlayers.push({
      name: player.name,
      playerId: player.playerId,
      deathTime,
      killedBy: player.killedBy,
    });
  }

  async startShrink(): Promise<void> {
    this.isShrinking = true;
    let sideLen: number = 15;
    let start: number = 1;
    while (sideLen > 8) {
      await this.stage.shrinkAround(sideLen, start);
      sideLen -= 2;
      start += 1;
    }
  }
}
