export interface Config {
    x: number,
    y: number,
    breakableBlocks: number,
    notPutArea: number[][]
}
  
export const config1: Config = {
    x: 17,
    y: 17,
    breakableBlocks: 80,
    notPutArea: [
      [2,2],
      [1,2],
      [2,1],
    ]
}
