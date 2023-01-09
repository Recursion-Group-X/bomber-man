import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { playerNameAtom, roomNameAtom, socketAtom } from '../atom/Atom'
import { DeadPlayer } from '../bombermanConfig'

const MultiResult: React.FC = () => {
  const [deadPlayers, setDeadPlayers] = useState<DeadPlayer[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [playerName, setPlayerName] = useAtom(playerNameAtom)
  const [socket] = useAtom(socketAtom)
  const location = useLocation()
  const navigate = useNavigate()

  const handleBackRoom = (): void => {
    socket?.emit('join_room', { roomName, playerName })
    navigate('/room')
  }

  const handleBackHome = (): void => {
    socket?.emit('leave_room', roomName)
    setRoomName('')
    navigate('/')
  }

  const sortByDeathTime = (a: DeadPlayer, b: DeadPlayer): number => {
    if (a.deathTime > b.deathTime) {
      return -1
    } else {
      return 1
    }
  }

  useEffect(() => {
    console.log(location.state.data)
    setDeadPlayers(location.state.data.sort(sortByDeathTime))
  }, [])

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-1/2 my-auto mx-auto border border-black rounded">
        <p className="text-center text-2xl my-5">GAME RESULT</p>
        <div className="flex text-2xl">
          <div className="w-1/2 text-right">
            {deadPlayers.map((p, index) => (
              <p key={p.playerId} className="my-3">
                {index === 0 && <span>Winner: </span>}
                {index === 1 && <span>2nd: </span>}
                {index === 2 && <span>3rd: </span>}
                {index === 3 && <span>4th: </span>}
              </p>
            ))}
          </div>
          <div className="w-1/2 text-left ml-10">
            {deadPlayers.map((p, index) => (
              <p key={p.playerId} className="my-3">
                <span className="font-bold">{p.name}</span>{' '}
                {index !== 0 && <span className="text-lg"> ({p.deathTime} sec)</span>}
              </p>
            ))}
          </div>
        </div>
        <div className="w-1/2 mx-auto flex justify-around my-10">
          <button
            onClick={handleBackRoom}
            className="p-2  bg-green-400 text-white text-xl font-semibold rounded-full hover:bg-green-500"
          >
            Back to Room
          </button>
          <button
            onClick={handleBackHome}
            className="p-2  bg-blue-400 text-white text-xl font-semibold rounded-full hover:bg-blue-500"
          >
            Go Home
          </button>
        </div>
      </div>
      {/* {deadPlayers.map((p) => (
        <p key={p.playerId}>
          {p.name}: {p.deathTime}
        </p>
      ))}
      <button onClick={handleBackRoom}>Back to Room {roomName}</button>
      <button onClick={handleBackHome}>Home</button> */}
    </div>
  )
}

export default MultiResult
