import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomNameAtom, socketAtom } from '../atom/Atom'
import { OnlinePlayer } from '../bombermanConfig'

let playerId: number = 0
const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const [players, setPlayers] = useState<OnlinePlayer[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [stage, setStage] = useState<number[][]>([[]])
  const navigate = useNavigate()

  useEffect(() => {
    socket?.on('send_player_id', (id: number) => {
      playerId = id
      console.log('your id is ', id)
    })
    socket?.on('send_game_status', (data: { players: OnlinePlayer[]; stage: number[][] }) => {
      setPlayers(data.players)
      setStage(data.stage)
    })
    socket?.on('initialize_game', (data: { players: OnlinePlayer[]; stage: number[][] }) => {
      initializeGame(data)
    })
    if (socket != null) console.log(playerId)
  }, [socket])

  const handleStartGame = (): void => {
    socket?.emit('start_game', {
      roomName,
    })
  }

  const initializeGame = (data: { players: OnlinePlayer[]; stage: number[][] }): void => {
    navigate('/online-game', { state: { players: data.players, stage: data.stage, id: playerId } })
  }

  const backLobby = (): void => {
    socket.emit('leave_room', roomName)
    navigate('/lobby')
  }

  return (
    <div>
      <h1>Multi Player Game</h1>
      <div>
        {players.map((player) => (
          <p key={player.playerId}>{player.name}</p>
        ))}
      </div>
      <button disabled={players.length <= 1} onClick={handleStartGame}>
        Start Game
      </button>
      <button className="m-5" onClick={backLobby}>
        Lobby
      </button>
    </div>
  )
}

export default Room
