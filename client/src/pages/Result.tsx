import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'

const Result: React.FC = () => {
  const navigate = useNavigate()
  const { id, name, score }: { id: string; name: string; score: number } = useLocation().state
  const [recordList, setrecordList] = useState<GameRecord[]>()
  const gameRecordGateway = new GameRecordGateWay()
  const [rank, setRank] = useState<number>(0)
  const [bestScore, setBestScore] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      setrecordList(await gameRecordGateway.getLatestGameTopFiftyRecord())
    })().catch(() => alert('ERORR'))
  }, [])

  useEffect(() => {
    setBestRnak(getCurrRnak())
  }, [recordList])

  const navigateHome = (): void => {
    navigate('/')
  }

  const restartGame = (): void => {
    navigate('/game')
  }

  const getCurrRnak = (): number => {
    let rank = 0
    recordList?.forEach((value, index) => {
      if (value.id === id) {
        rank = index + 1
      }
    })
    return rank
  }

  const setBestRnak = (rank: number): void => {
    const localData = localStorage.getItem('bestScore')
    if (localData === null && rank <= 50 && rank > 0) {
      const data = JSON.stringify({ bestId: id, bestRank: rank, bestScore: score })
      localStorage.setItem('bestScore', data)
    } else if (localData !== null) {
      if (JSON.parse(localData).score < score && rank <= 50 && rank > 0) {
        const data = JSON.stringify({ bestId: id, bestRank: rank, bestScore: score })
        localStorage.setItem('bestScore', data)
      }
    }
    getBestPosition()
  }

  const getBestPosition = (): string => {
    let position = 'OUT OF RANKING'
    recordList?.forEach((value, index) => {
      const localData = localStorage.getItem('bestScore')
      if (localData !== null) {
        if (JSON.parse(localData).bestId === value.id) {
          position = convertToOdinalNumber(index + 1)
          setRank(index + 1)
          setBestScore(value.score)
        }
      }
    })
    return position
  }

  const createRankingList = (currRank: number): any => {
    if (recordList !== undefined && recordList?.length < 5) {
      const displayList = recordList
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {convertToOdinalNumber(index + 1)} {record.name}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">{convertTimeToScore(record.score)}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (currRank > 0 && currRank < 3) {
      const displayList = recordList?.slice(0, 5)
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {convertToOdinalNumber(index + 1)} {record.name}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">{convertTimeToScore(record.score)}</p>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (recordList !== undefined && (recordList.length - currRank < 3 || currRank === 0)) {
      const displayList = recordList?.slice(-5)
      return (
        <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
          <div className="w-1/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">
                  {convertToOdinalNumber(recordList.length - 4 + index)} {record.name}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">{convertTimeToScore(record.score)}</p>
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
                      ? convertToOdinalNumber(currRank + index - 2)
                      : convertToOdinalNumber(currRank + Math.floor(index / 2))
                    : convertToOdinalNumber(currRank)}{' '}
                  {record.name}{' '}
                </p>
              </div>
            ))}
          </div>
          <div className="w-2/3">
            {displayList?.map((record: GameRecord, index) => (
              <div key={record.id}>
                <p className="text-start my-4 text-2xl">{convertTimeToScore(record.score)}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  const convertTimeToScore = (time: number): any => {
    const min: string =
      Math.floor((time % 3600) / 60) <= 9
        ? `0${Math.floor((time % 3600) / 60)}`
        : Math.floor((time % 3600) / 60).toString()
    const sec = time % 60 <= 10 ? `0${(time % 60).toFixed()}` : (time % 60).toFixed()
    const msec = (time % 60).toFixed(2).split('.')[1]
    return (
      <div>
        <p>
          {min}:{sec}.<span className="text-lg">{msec}</span>
        </p>
      </div>
    )
  }

  const convertToOdinalNumber = (rank: number): string => {
    if (rank === 0) {
      return 'OUT OF RANKING'
    }
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
    <div className="h-screen text-xl bg-black">
      <div className="h-20 flex items-center justify-center">
        <p className="pt-10 text-center text-4xl text-white">RESULT</p>
      </div>
      {createRankingList(getCurrRnak())}

      <div className="text-center text-2xl">
        <p>{name} Result</p>
        <p>Your Ranking is: {convertToOdinalNumber(getCurrRnak())}</p>
        <p>{convertTimeToScore(score)}</p>
        {localStorage.bestRank !== undefined && (
          <div>
            <p>Your Best Ranking is {convertToOdinalNumber(rank)}</p>
            <p>{convertTimeToScore(bestScore)}</p>
          </div>
        )}
      </div>
      <div className="flex justify-end w-2/3 mx-auto">
        <button className="m-4 border border-2 p-2 text-white" onClick={restartGame}>
          Restart
        </button>
        <button className="m-4 border border-2 p-2 text-white" onClick={navigateHome}>
          Home
        </button>
      </div>
      <div className="text-center">
        <a
          href={`https://twitter.com/intent/tweet?text=I played solo Bomb Game? My score was ${score} https://bomb-game.netlify.app/`}
        >
          Tweet
        </a>
      </div>
    </div>
  )
}

export default Result
