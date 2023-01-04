import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomNameAtom, socketAtom } from '../atom/Atom'

interface Player {
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

let playerId: number = 0
const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const [players, setPlayers] = useState<Player[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [stage, setStage] = useState<number[][]>([[]])
  const navigate = useNavigate()

  useEffect(() => {
    socket?.on('send_player_id', (id: number) => {
      playerId = id
      console.log('your id is ', id)
    })
    socket?.on('send_game_status', (data: { players: Player[]; stage: number[][] }) => {
      setPlayers(data.players)
      setStage(data.stage)
    })
    socket?.on('initialize_game', (data: { players: Player[]; stage: number[][] }) => {
      initializeGame(data)
    })
  }, [socket])

  const handleStartGame = (): void => {
    socket?.emit('start_game', {
      roomName,
    })
  }

  const initializeGame = (data: { players: Player[]; stage: number[][] }): void => {
    navigate('/online-game', { state: { players: data.players, stage: data.stage, id: playerId } })
  }

  return (
    <div>
      <h1>Multi Player Game</h1>
      <div>
        {players.map((player) => (
          <p key={player.name}>{player.name}</p>
        ))}
      </div>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  )
}

export default Room
