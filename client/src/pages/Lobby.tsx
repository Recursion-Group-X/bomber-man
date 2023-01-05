import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { roomNameAtom, socketAtom } from '../atom/Atom'

const Lobby: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()
  const [roomName, setRoomName] = useAtom(roomNameAtom)

  const joinRoom = (roomName: string): void => {
    socket?.emit('join_room', {
      roomName,
      playerName: 'pimon',
    })

    navigate('/room')
  }

  return (
    <div className="h-screen">
      <div className="h-20 bg-slate-600 flex items-center justify-center text-white text-4xl">Lobby</div>

      <div className="my-10">
        <label htmlFor="room_name" className="block mb-2 text-sm font-medium">
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
        <p id="create_room_number">{roomName}</p>
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
