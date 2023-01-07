import { Config } from "../bombermanConfig"
import greenEnemyImg from '../assets/green_enemy.png'

export class Enemies {
    x: number
    y: number
    width: number
    height: number
    direction: string

    enemiesList: Object[]

    maxBolcks: number
    canvasSize: number = 510
    numOfBox: number = 17
    boxSize: number = this.canvasSize / this.numOfBox


    constructor(config: Config, currentStage: number[][]) {
        // this.x = this.boxSize * this.definePosition(currentStage)[1]
        // this.y = this.boxSize * this.definePosition(currentStage)[0]
        this.x = this.boxSize * (Math.floor(Math.random() * (config.x - 2)) + 1)
        this.y = this.boxSize * (Math.floor(Math.random() * (config.x - 2)) + 1)
        this.width = 32;
        this.height = 32;
        this.direction = '';
        this.maxBolcks = config.x;
        this.enemiesList = [];

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }


    changeRandomDirection(): void {
    }



    definePosition(currentStage: number[][]): number[] {
        const max: number = this.maxBolcks;

        let randomNumY: number = Math.floor(Math.random() * (max - 2)) + 1;
        let randomNumX: number = Math.floor(Math.random() * (max - 2)) + 1;

        console.log(currentStage[randomNumY][randomNumX])
        while (currentStage[randomNumY][randomNumX] !== 0) {
            randomNumX = Math.floor(Math.random() * (max - 2)) + 1;
            randomNumY = Math.floor(Math.random() * (max - 2)) + 1;
        }
        const position: number[] = [randomNumY, randomNumX]
        return position

    }

    drawEnemy(canvas: CanvasRenderingContext2D | null | undefined): void {
        const img = document.createElement('img')
        img.src = greenEnemyImg
        canvas?.drawImage(
            img,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    moveEnemy(canvas: CanvasRenderingContext2D | null | undefined): void {
        this.drawEnemy(canvas)
    }
}

