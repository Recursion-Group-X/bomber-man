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
    navigate('/room')
  }

  useEffect(() => {
    socket?.emit('enter_lobby')
    socket?.on('send_rooms', (data: Room[]) => {
      setRooms(data)
    })
  }, [socket])

  return (
    <div className="h-screen">
      <div className="h-20 bg-slate-600 flex items-center justify-center text-white text-4xl">Lobby</div>
      <button
        className="px-3 py-2 bg-gray-400 text-lg text-white ml-20 mt-8 font-semibold rounded-full hover:bg-gray-500"
        onClick={() => navigate('/')}
      >
        Home
      </button>

      <div className="my-10 flex flex-wrap justify-center items-center">
        {rooms.map((room) => (
          <div className="w-1/5 my-10 mx-5 h-40 p-3 border border-black rounded" key={room.roomName}>
            <p className="text-xl">
              {room.roomName}
              <span className="text-md ml-2">({room.players.length}/4)</span>
            </p>
            <div className="flex w-full h-full">
              <div className="w-1/2 flex flex-col justify-end items-center mb-10">
                <button
                  className="py-2 w-2/3 bg-sky-500 hover:bg-sky-600 text-xl text-white rounded disabled:bg-sky-300"
                  disabled={room.players.length >= 4 || room.gameStartTime !== undefined}
                  onClick={() => joinRoom(room.roomName)}
                >
                  Join
                </button>
              </div>
              <div className="w-1/2 text-right mr-5 text-xl">
                {room.players.map((player) => (
                  <p key={player.playerId}>{player.name}</p>
                ))}
              </div>
            </div>
          </div>
        ))}

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
