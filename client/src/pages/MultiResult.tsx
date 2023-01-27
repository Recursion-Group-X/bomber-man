import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { playerNameAtom, roomNameAtom, socketAtom } from '../atom/Atom'
import { DeadPlayer } from '../bombermanConfig'
import crownImg from '../assets/crown.png'
import useTwitterMessage from '../hooks/useTwitterMessage'

const MultiResult: React.FC = () => {
  const [deadPlayers, setDeadPlayers] = useState<DeadPlayer[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [playerName, setPlayerName] = useAtom(playerNameAtom)
  const [socket] = useAtom(socketAtom)
  const location = useLocation()
  const navigate = useNavigate()
  const [deadPlayerInfo] = useTwitterMessage()

  const handleBackRoom = (): void => {
    socket?.emit('join_room', { roomName, playerName })
    socket.emit('send_message', {
      message: { sender: playerName, content: `${playerName} entered ${roomName}` },
      roomName,
    })
    navigate('/room')
  }

  const handleBackHome = (): void => {
    socket?.emit('leave_room', roomName)
    setRoomName('')
    navigate('/')
  }

  const sortDeadPlayers = (a: DeadPlayer, b: DeadPlayer): number => {
    if (a.deathTime > b.deathTime) {
      return -1
    } else {
      return 1
    }
  }

  useEffect(() => {
    setDeadPlayers(location.state.data.sort(sortDeadPlayers))
  })

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black">
      <div className="w-1/2 my-auto mx-auto nes-container is-rounded is-dark">
        <p className="text-center text-2xl my-5">GAME RESULT</p>
        <div className="flex text-2xl">
          <div className="w-full justify-center mx-auto">
            {deadPlayers.map((p, index) => (
              <div key={p.playerId} className="w-full flex items-center justify-between">
                <div className="w-1/3 text-right">
                  <p className="my-3">
                    {index === 0 && <span>Winner: </span>}
                    {index === 1 && <span>2nd: </span>}
                    {index === 2 && <span>3rd: </span>}
                    {index === 3 && <span>4th: </span>}
                  </p>
                </div>
                <div className="w-2/3 text-center">
                  <div className="flex items-center justify-center" key={p.playerId}>
                    {index === 0 && <img src={crownImg} className="mr-2 mt-3" alt="crown" />}
                    <div className="">
                      <p className="mt-3 font-bold">{p.name}</p>
                      {index !== 0 && (
                        <p className="text-sm ml-40">
                          killed by {p.killedBy} ({p.deathTime} sec)
                        </p>
                      )}
                    </div>
                    {index === 0 && <img src={crownImg} className="ml-2 mt-3" alt="crown" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {deadPlayers.length > 0 && (
          <div className="text-center">
            <a href={`https://twitter.com/intent/tweet?text=${deadPlayerInfo(deadPlayers)}`}>Tweet</a>
          </div>
        )}
        <div className="w-1/2 mx-auto flex justify-around my-10">
          <button
            onClick={handleBackRoom}
            className="nes-btn is-success w-9/12 text-white text-base font-semibold hover:bg-green-500"
          >
            Back to Room
          </button>
          <button
            onClick={handleBackHome}
            className="nes-btn is-primary ml-6 w-9/12 text-white text-base font-semibold hover:bg-blue-500"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiResult
