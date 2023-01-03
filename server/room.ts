import { Stage } from "./stage";
import { Player } from "./player";

export interface RoomMap {
  [roomId: string]: Room;
}

export class Room {
  players: Player[] = [];
  roomName: string;
  stage: Stage;
  time: number;
  constructor(roomName: string) {
    this.roomName = roomName;
    this.stage = new Stage();
    this.time = 0;
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
}
