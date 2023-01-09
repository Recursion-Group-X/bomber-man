import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import { socketAtom } from './atom/Atom'
import Game from './pages/Game'
import Home from './pages/Home'
import Result from './pages/Result'
import Room from './pages/Room'
import Lobby from './pages/Lobby'
import MultiGame from './pages/MultiGame'
import MultiResult from './pages/MultiResult'

const CONNECTION_PORT = 'localhost:3001'

const App: React.FC = () => {
  const [socket, setSocket] = useAtom(socketAtom)
  useEffect(() => {
    setSocket(io(CONNECTION_PORT))
  }, [CONNECTION_PORT])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
