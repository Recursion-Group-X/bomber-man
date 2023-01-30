import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Room } from '../bombermanConfig'
import { playerNameAtom, roomNameAtom, socketAtom } from '../atom/Atom'

const Lobby: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [playerName] = useAtom(playerNameAtom)

  const joinRoom = (roomName: string): void => {
    setRoomName(roomName)
    socket?.emit('join_room', {
      roomName,
      playerName,
    })
    socket.emit('send_message', {
      message: { sender: playerName, content: `${playerName} entered ${roomName}` },
      roomName,
    })
    navigate('/room')
  }

  useEffect(() => {
    socket?.emit('enter_lobby')
    socket?.on('send_rooms', (data: Room[]) => {
      setRooms(data)
    })
  }, [socket])

  return (
    <div className="h-screen bg-black">
      <div className="h-20 flex items-center justify-center text-white text-4xl">Lobby</div>
      <button
        className="px-3 py-2 ml-20 mt-8 nes-btn is-success text-lg text-white font-semibold hover:bg-gray-500"
        onClick={() => navigate('/')}
      >
        Home
      </button>

      <div className="my-10 flex flex-wrap justify-center">
        {rooms.map((room) =>
          room.players.length !== 0 ? (
            <div className="w-1/5 h-60 bg-white nes-container is-rounded" key={room.roomName}>
              <div>
                <p className="text-base text-left text-black">
                  {room.roomName}
                  <span className="text-base">({room.players.length}/4)</span>
                </p>
              </div>
              <div className="pt-6 flex w-full h-auto">
                {room.players.map((player) => (
                  <p className="text-base pb-2" key={player.playerId}>
                    {' '}
                    {player.name}
                  </p>
                ))}
              </div>
              <div className="mt-5 mb-3 absolute bottom-0 right-0">
                {room.players.length >= 5 || room.gameStartTime !== undefined ? (
                  <button className="nes-btn is-disabled text-xs text-white">Join</button>
                ) : (
                  <button
                    className="nes-btn is-primary hover:bg-sky-600 text-xs text-white"
                    onClick={() => joinRoom(room.roomName)}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-1/5 h-60 bg-white nes-container is-rounded" key={room.roomName}>
              <div>
                <p className="text-base text-left text-black">
                  {room.roomName}
                  <span className="text-base">({room.players.length}/4)</span>
                </p>
              </div>
              <div className="pt-6 flex w-full h-auto">
                <div>
                  <p className="text-base nes-text is-error">No Player</p>
                </div>
              </div>
              <div className="mt-5 mb-3 absolute bottom-0 right-0">
                {room.players.length >= 5 || room.gameStartTime !== undefined ? (
                  <button className="nes-btn is-disabled text-xs text-white">Join</button>
                ) : (
                  <button
                    className="nes-btn is-primary hover:bg-sky-600 text-xs text-white"
                    onClick={() => joinRoom(room.roomName)}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* <label htmlFor="room_name" className="block mb-2 text-sm font-medium">
          ROOM NAME
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value)
          }}
          id="room_name"
          required
        ></input>
        <button
          className="px-2 py-1  bg-blue-400 text-lg text-white font-semibold rounded-full hover:bg-blue-500"
          onClick={() => joinRoom(roomName)}
        >
          Join ROOM
        </button>
        <p id="create_room_number">{roomName}</p> */}
      </div>
      {/* <div className="">
        <label htmlFor="room_number" className="block mb-2 text-sm font-medium">
          ROOM NUMBER
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          id="room_number"
          required
        ></input>
        <button
          className="px-2 py-1  bg-green-400 text-lg text-white font-semibold rounded-full hover:bg-green-500"
          onClick={() => joinRoom(inputValue)}
        >
          JOIN ROOM
        </button>
      </div> */}
    </div>
  )
}

export default Lobby
