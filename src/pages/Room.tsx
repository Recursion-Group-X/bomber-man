import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { socketAtom } from '../atom/Atom'

const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  // これをHomeで出来るようHomeの見た目変更などお願いします！
  const joinRoom = (): void => {
    socket?.emit('join_room', 'room1')
    console.log('joined')
  }

  useEffect(() => {
    socket?.emit('send_message', 'hello')
    socket?.on('receive_message', (data: string) => {
      console.log(data)
    })
  }, [socket])

  return (
    <div>
      <h1>Multi Player Game</h1>
      <button onClick={joinRoom}>Join</button>
    </div>
  )
}

export default Room
