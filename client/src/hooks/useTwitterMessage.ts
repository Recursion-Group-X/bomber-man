import { DeadPlayer } from '../bombermanConfig'

const useTwitterMessage = (): [(deadPlayes: DeadPlayer[]) => string] => {
  const deadPlayerInfo = (deadPlayers: DeadPlayer[]): string => {
    let res = 'I played Bomb Game with '
    for (let i = 0; i < deadPlayers.length; i++) {
      let rank: string = ''
      if (i === 0) rank = '1st'
      else if (i === 1) rank = '2nd'
      else if (i === 2) rank = '3rd'
      else if (i === 3) rank = '4th'
      res += deadPlayers[i].name + '(' + rank + '), '
    }
    res = res.substring(0, res.length - 2)
    res += ' ' + 'https://bomb-game.netlify.app/'
    return res
  }

  return [deadPlayerInfo]
}

export default useTwitterMessage
