import React from 'react'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'


const currentStage: number[][] = [
    [0,0,1,0,0,1,1,0,1,0,0,0,0,0,0],
    [0,2,1,2,0,2,0,2,0,2,0,2,0,2,0],
    [0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
    [0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    [1,2,0,2,0,2,0,2,0,2,1,2,1,2,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,0,2,0,2,0,2,0,2,0,2,1,2,0],
    [0,1,1,0,1,0,1,0,0,0,0,0,1,0,0],
    [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,2,0,2,0,2,1,2,0,2,0,2,0,2,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ]

const Game: React.FC = () => {
  
  return (
    <div className='h-screen bg-black text-xl'>
      <div className='h-20 bg-slate-600 flex items-center'>
        <div className='w-1/3'>
          <p className='ml-10 text-xl text-white'>00:00</p>
        </div>
        <div className='w-1/3 mx-auto flex justify-around'>
          <div>
            Item1: 
          </div>
          <div>
            Item2:
          </div>
          <div>
            Item3:
          </div>
        </div>
      </div>

      <div className=' mx-auto bg-white mt-6' style={{height: '450px', width: '450px'}}>
        <table className='h-full w-full'>
          {currentStage.map(row => 
            <tr className={`h-1/${currentStage.length} w-full`} key={row[0]}>
              {row.map(box => 
                <>
                {box === 0 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${grassImg})`}}></td>:
                 box === 1 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${stoneImg})`}}></td>:
                             <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${wallImg})`}}></td>
                }
                
                </>
              )}
            </tr>
          )}
        </table>
      </div>
    </div>
  )
}

export default Game