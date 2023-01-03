import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
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

const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const [players, setPlayers] = useState<Player[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  // これをHomeで出来るようHomeの見た目変更などお願いします！

  useEffect(() => {
    socket?.on('send_players', (data: Player[]) => {
      setPlayers(data)
    })
    socket?.on('send_stage', (data: any) => {
      console.log(data)
    })
  }, [socket])

  const startGame = (): void => {
    console.log('game start')
    socket?.emit('start_game', {
      roomName: roomName,
    })
  }

  return (
    <div>
      <h1>Multi Player Game</h1>
      <div>
        {players.map((player) => (
          <p key={player.name}>{player.name}</p>
        ))}
      </div>
      <button onClick={startGame}>Start Game</button>
    </div>
  )
}

export default Room
