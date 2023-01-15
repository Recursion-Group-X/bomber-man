import { atom, PrimitiveAtom } from 'jotai'
import { config1 } from '../bombermanConfig'
import { Player } from '../models/Player'
import { Stage } from '../models/Stage'
import { Enemies } from '../models/Enemies'

export const canvasRefAtom: any = atom(null)
const currentStage = new Stage(config1)
currentStage.setBreakableBlock()
export const currentStageAtom: PrimitiveAtom<number[][]> = atom(currentStage.getBoard())

export const playerAtom = atom<Player>(new Player('GUESTUSER'))
// export const enemiesAtom = atom<Enemies>(new Enemies(config1, currentStage.getBoard()))

export const enemiesAtom: PrimitiveAtom<Enemies[]> = atom([
  new Enemies(config1, currentStage.getBoard()),
  new Enemies(config1, currentStage.getBoard()),
  new Enemies(config1, currentStage.getBoard()),
])

// online game
export const socketAtom = atom<any>(null)
export const roomNameAtom: PrimitiveAtom<string> = atom('')
export const playersLastDirection: PrimitiveAtom<string> = atom('stay')
export const playerNameAtom: PrimitiveAtom<string> = atom('GUESTUSER')
