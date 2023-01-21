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
    <div className="h-screen bg-black">
      <div className='mb-10 pt-10'>
        <p className='text-center text-white text-4xl'>Multi Player Game</p>
      </div>
      <div className='flex justify-center'>
        <div className='w-1/3 h-60 nes-container with-title is-centered is-dark '>
          <p className='title text-base'> Room </p>
          <p className='pt-5'>
            {players.map((player) => (
              <p className='pt-2' key={player.playerId}>{player.name}</p>
            ))}
          </p>
        </div>
      </div>
      <div className='flex justify-center pt-5'>
        <button className="nes-btn is-error" onClick={backLobby}>
          Leave Room
        </button>
        <button className='nes-btn is-success ml-6' disabled={players.length <= 1} onClick={handleStartGame}>
          Start Game
        </button>
      </div>
      
    </div>
  )
}

export default Room
