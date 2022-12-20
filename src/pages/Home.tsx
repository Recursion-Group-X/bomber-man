import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const chooseStage = (): void => {
    navigate('/stage-list')
  }
  const startGame = (): void => {
    navigate('/game')
  }


  return (
    <div className='h-screen text-xl'>
      <div className='h-20 bg-slate-600 flex items-center justify-center'>
        <p className='text-center text-2xl text-white'>Bomb Game</p>
        <button className='text-white right-10 absolute p-3'>Login</button>
      </div>
      <div className='w-2/3 mx-auto'>

        <div className='text-center mt-10 flex justify-center'>
          <span className='mr-10'>Username: </span><span>GUESTUSER</span>
        </div>

        <div className='flex justify-center mt-10'>
            <fieldset className='flex'>
              <div className='mr-10'>CPU Level:</div>
              <div>
                <input type="radio" id="easy" name="level" value="easy" checked />
                <label className='mr-4' htmlFor="easy">EASY</label>
              </div>

              <div>
                <input type="radio" id="hard" name="level" value="hard" />
                <label htmlFor="hard">HARD</label>
              </div>
            </fieldset>
          </div>

          <div className='flex justify-center mt-10 items-center'>
            <span className='mr-10'>Stage: </span>
            <button className='border border-2 border-slate-400 p-2' onClick={chooseStage}>StageName</button>
          </div>
          <div className='flex mt-10 justify-center'>
            <div className='flex justify-center flex-col mx-10'>
              <div className='mx-auto h-40 w-40 border'></div>
              <p className='text-center'>Avatar</p>
            </div>
            <div className='flex justify-center items-center mx-10'>
              <button className='p-3 text-2xl border w-32 h-20 bg-green-600 border-4 rounded' onClick={startGame}>Play</button>
            </div>
          </div>


      </div>
    </div>
  )
}

export default Home