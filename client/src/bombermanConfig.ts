export interface Config {
  x: number
  y: number
  breakableBlocks: number
}

export const config1: Config = {
  x: 17,
  y: 17,
  breakableBlocks: 30,
}

export interface DeadPlayer {
  name: string
  playerId: number
  deathTime: number
}

export interface OnlinePlayer {
  playerId: number
  name: string
  x: number
  y: number
  size: number
  direction: string
  speed: number
  numOfBombs: number
  bombPower: number
  isAlive: boolean
}
