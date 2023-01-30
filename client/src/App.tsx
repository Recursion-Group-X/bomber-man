import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import { playerNameAtom, socketAtom } from './atom/Atom'
import Game from './pages/Game'
import Home from './pages/Home'
import Result from './pages/Result'
import Room from './pages/Room'
import Lobby from './pages/Lobby'
import MultiGame from './pages/MultiGame'
import MultiResult from './pages/MultiResult'
import Ranking from './pages/Ranking'

// const CONNECTION_PORT = 'localhost:3001'
const CONNECTION_PORT = 'https://bomberman-server-2023.an.r.appspot.com'

const App: React.FC = () => {
  const [socket, setSocket] = useAtom(socketAtom)
  const [playerName, setPlayerName] = useAtom(playerNameAtom)
  useEffect(() => {
    setSocket(io(CONNECTION_PORT))
    const name: string | null = localStorage.getItem('username')
    if (name != null) setPlayerName(name)
  }, [CONNECTION_PORT])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="ranking/" element={<Ranking />} />
          <Route path="lobby/" element={<Lobby />} />
          <Route path="game/" element={<Game />} />
          <Route path="result/" element={<Result />} />
          <Route path="room/" element={<Room />} />
          <Route path="online-game/" element={<MultiGame />} />
          <Route path="online-result/" element={<MultiResult />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
