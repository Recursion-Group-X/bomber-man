import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomNameAtom, socketAtom } from '../atom/Atom'
import { Message, OnlinePlayer } from '../bombermanConfig'

let playerId: number = 0
const Room: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const [players, setPlayers] = useState<OnlinePlayer[]>([])
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [stage, setStage] = useState<number[][]>([[]])
  const [messageList, setMessageList] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket?.on('send_player_id', (id: number) => {
      playerId = id
      console.log('your id is ', id)
    })
    socket?.on('send_message_list', (data: Message[]) => {
      setMessageList(data)
      if (chatRef.current != null) chatRef.current.scrollTop = chatRef.current?.scrollHeight
      console.log(chatRef.current?.scrollTop)
      // chatRef.current?.scrollIntoView()
    })
    socket?.on('send_game_status', (data: { players: OnlinePlayer[]; stage: number[][] }) => {
      setPlayers(data.players)
      setStage(data.stage)
    })
    socket?.on('initialize_game', (data: { players: OnlinePlayer[]; stage: number[][] }) => {
      initializeGame(data)
    })
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

  const sendMessage = (): void => {
    const player: OnlinePlayer[] = players.filter((player: OnlinePlayer) => player.socketId === socket.id)
    if (player.length === 0) return
    if (message.length > 0) {
      // console.log(player[0].name, ': ', message)
      const m: Message = { sender: player[0].name, content: message }
      socket.emit('send_message', { message: m, roomName })
    }
    setMessage('')
  }

  return (
    <div className="h-screen bg-black">
      <div className="mb-10 pt-10">
        <p className="text-center text-white text-4xl">Multi Player Game</p>
      </div>
      <div className="flex justify-center">
        <div className="w-1/3 h-60 nes-container with-title is-centered is-dark ">
          <p className="title text-base"> Room </p>
          <p className="pt-5">
            {players.map((player) => (
              <p className="pt-2" key={player.playerId}>
                {player.name}
              </p>
            ))}
          </p>
        </div>
      </div>
      <div className="flex justify-center pt-5">
        <button className="nes-btn is-error" onClick={backLobby}>
          Leave Room
        </button>
        <button className="nes-btn is-success ml-6" disabled={players.length <= 1} onClick={handleStartGame}>
          Start Game
        </button>
      </div>
      <div className="mt-6 flex justify-center flex-col items-center">
        <div className="w-1/3 h-60 nes-container with-title is-centered is-dark overflow-y-scroll" ref={chatRef}>
          <p className="pt-2 w-full text-left ml-4">
            {messageList.map((message: Message, index: number) => (
              <p className="my-2" key={index}>
                <span className="mr-2">{message.sender}:</span>
                {message.content}
              </p>
            ))}
          </p>
        </div>
        <div className="w-full flex justify-center">
          <input
            className="w-1/4 h-8"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
          />
          <button className="bg-sky-600 text-white p-1 ml-1" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Room
