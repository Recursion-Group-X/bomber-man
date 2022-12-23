export interface Config {
    x: number,
    y: number,
    breakableBlocks: number,
    notPutArea: number[][]
}
  
export const config1: Config = {
    x: 15,
    y: 15,
    breakableBlocks: 80,
    notPutArea: [
      [0,0],
      [0,1],
      [1,0],
    ]
}
