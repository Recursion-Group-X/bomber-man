import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { socketAtom } from '../atom/Atom'

const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  // これをHomeで出来るようHomeの見た目変更などお願いします！

  useEffect(() => {
    socket?.on('receive_message', (data: string) => {
      console.log(data)
    })
  }, [])

  return (
    <div>
      <h1>Multi Player Game</h1>
    </div>
  )
}

export default Room
