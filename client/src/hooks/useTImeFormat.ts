const useTimeFormat = (): [(time: number) => string] => {
  const getOnlineGameTime = (time: number): string => {
    let str: string = ''
    let sec: number = Math.floor(time)
    const min: number = Math.floor(sec / 60)
    sec -= min * 60
    str += min < 10 ? '0' + min.toString() : min.toString()
    str += ':'
    str += sec < 10 ? '0' + sec.toString() : sec.toString()
    if (str.length > 6) return ''
    return str
  }
  return [getOnlineGameTime]
}

export default useTimeFormat
