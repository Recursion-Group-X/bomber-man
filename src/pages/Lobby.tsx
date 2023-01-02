import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { socketAtom } from '../atom/Atom'

const Lobby: React.FC = () => {

  const [socket] = useAtom(socketAtom)
  const [roomName, setRoomName] = useState("")
  const [inputValue, setInputValue] = useState("")

  const createRoom = (): void => {
    socket.emit('create_room', roomName)
    console.log("create")
  }

  const joinRoom = (): void => {
    socket?.emit('join_room', inputValue)
    console.log('joined')
  }

  return (
    <div className='h-screen'>
      <div className="h-20 bg-slate-600 flex items-center justify-center text-white text-4xl">Lobby</div>

      <div className="my-10">
        <label htmlFor="room_name" className="block mb-2 text-sm font-medium">ROOM NAME</label>
        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" defaultValue={roomName} onChange={(e)=>{setRoomName(e.target.value)}} id="room_naem" required></input>
        <button className="px-2 py-1  bg-blue-400 text-lg text-white font-semibold rounded-full hover:bg-blue-500"  onClick={createRoom}>New ROOM</button>
        <p id="create_room_number">{roomName}</p>
      </div>
      <div className="">
        <label htmlFor="room_number" className="block mb-2 text-sm font-medium">ROOM NUMBER</label>
        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white" defaultValue={inputValue} onChange={(e)=>{setInputValue(e.target.value)}} id="room_number" required></input>
        <button className="px-2 py-1  bg-green-400 text-lg text-white font-semibold rounded-full hover:bg-green-500" onClick={joinRoom}>JOIN ROOM</button>
      </div>
    </div>
  )
}

export default Lobby