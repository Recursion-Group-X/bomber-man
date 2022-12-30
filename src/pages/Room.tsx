import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { socketAtom } from '../atom/Atom'

const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  useEffect(() => {
    socket?.emit('send_message', 'hello')
    socket?.on('receive_message', (data: string) => {
      console.log(data)
    })
  }, [socket])
  return <div>Multi Player Game</div>
}

export default Room
