import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'

const Result: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [recordList, setrecordList] = useState<GameRecord[]>()
  const gameRecordGateway = new GameRecordGateWay()

  useEffect(() => {
    ;(async () => {
      setrecordList(await gameRecordGateway.getLatestGameTopFiftyRecord())
    })().catch(() => alert('ERORR'))
  }, [])

  const navigateHome = (): void => {
    navigate('/')
  }

  const restartGame = (): void => {
    navigate('/game')
  }

  const getCurrRnak = (): number => {
    let rank = 0
    recordList?.forEach((value, index) => {
      if (value.id === state.id) {
        rank = index + 1
      }
    })
    return rank
  }

  const createRankingList = (currRank: number): any => {
    if (currRank < 3) {
      const displayList = recordList?.slice(5)
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {convertTimeToScore(index + 1)} {record.name}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  <span className="text-lg">{convertTimeToScore(record.score)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (recordList !== undefined && recordList.length - currRank < 3) {
      const displayList = recordList?.slice(-5)
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {converToOdinalNumber(recordList.length - 4 + index)} {record.name}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  <span className="text-lg">
                    {converToOdinalNumber(recordList.length + index - 1)} {convertTimeToScore(record.score)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      const displayList = recordList?.slice(currRank - 3, currRank + 2)
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {index !== 2
                    ? index < 2
                      ? converToOdinalNumber(currRank + index - 2)
                      : converToOdinalNumber(currRank + Math.floor(index / 2))
                    : converToOdinalNumber(currRank)}{' '}
                  {record.name}{' '}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  <span className="text-lg">{convertTimeToScore(record.score)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  const convertTimeToScore = (time: number): string => {
    const min: string =
      Math.floor((time % 3600) / 60) <= 9
        ? `0${Math.floor((time % 3600) / 60)}`
        : Math.floor((time % 3600) / 60).toString()
    const sec = time % 60 <= 9 ? `0${(time % 60).toFixed()}` : (time % 60).toFixed()
    const msec = (time % 60).toFixed(2).split('.')[1]
    return `${min}:${sec}:${msec}`
  }

  const converToOdinalNumber = (rank: number): string => {
    if (rank !== 11 && rank !== 12 && rank !== 13 && rank % 10 === 1) {
      return `${rank}st`
    } else if (rank !== 11 && rank !== 12 && rank !== 13 && rank % 10 === 2) {
      return `${rank}nd`
    } else if (rank !== 11 && rank !== 12 && rank !== 13 && rank % 10 === 3) {
      return `${rank}rd`
    } else {
      return `${rank}th`
    }
  }

  return (
    <div className="h-screen text-xl">
      <div className="h-20 bg-slate-600 flex items-center justify-center">
        <p className="text-center text-2xl text-white">RESULT</p>
      </div>
      {createRankingList(getCurrRnak())}

      <div className="text-center">
        <p>{state.name} Result</p>
        <p>Your Ranking is: {converToOdinalNumber(getCurrRnak())}</p>
        <p>{convertTimeToScore(state.score)}</p>
      </div>
      <div className="flex justify-end w-2/3 mx-auto">
        <button className="m-4 border border-2 p-2" onClick={restartGame}>
          Restart
        </button>
        <button className="m-4 border border-2 p-2" onClick={navigateHome}>
          Home
        </button>
      </div>
    </div>
  )
}

export default Result
