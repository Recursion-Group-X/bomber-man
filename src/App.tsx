import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Game from './pages/Game';
import Home from './pages/Home';
import Result from './pages/Result';
import StageList from './pages/StageList';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='stage-list/' element={<StageList />} />
          <Route path='game/' element={<Game />} />
          <Route path='result/' element={<Result />} />
        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App;
