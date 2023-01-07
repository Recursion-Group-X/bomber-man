import { Config } from "../bombermanConfig"
import greenEnemyImg from '../assets/green_enemy.png'

export class Enemies {
    x: number = 0;
    y: number = 0;
    width: number
    height: number
    direction: string

    isFirst: boolean =true;

    enemiesList: Object[]

    maxBolcks: number
    canvasSize: number = 510
    numOfBox: number = 17
    boxSize: number = this.canvasSize / this.numOfBox


    constructor(config: Config, currentStage: number[][]) {
        this.maxBolcks = config.x;
        if(this.isFirst){
            console.log(this.isFirst)
            this.inititalDefinePosition(currentStage);
        }else{
            this.definePosition(currentStage);
        }
        
        this.width = 32;
        this.height = 32;
        this.direction = '';

        this.enemiesList = [];
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }


    changeRandomDirection(): void {
    }



    inititalDefinePosition(currentStage: number[][]): void{
        const max: number = this.maxBolcks;

        let randomNumY: number = Math.floor(Math.random() * (max - 5)) + 5;
        let randomNumX: number = Math.floor(Math.random() * (max - 5)) + 5;

        while (currentStage[randomNumY][randomNumX] !== 0) {
            randomNumX = Math.floor(Math.random() * (max - 5)) + 5;
            randomNumY = Math.floor(Math.random() * (max - 5)) + 5;
        }
        this.x = this.boxSize * randomNumX
        this.y = this.boxSize * randomNumY
        this.isFirst = false;
        console.log(randomNumX)
        console.log(randomNumY)
    }

    definePosition(currentStage: number[][]): void {
        const max: number = this.maxBolcks;

        let randomNumY: number = Math.floor(Math.random() * (max - 1)) + 1;
        let randomNumX: number = Math.floor(Math.random() * (max - 1)) + 1;

        while (currentStage[randomNumY][randomNumX] !== 0) {
            randomNumX = Math.floor(Math.random() * (max - 1)) + 1;
            randomNumY = Math.floor(Math.random() * (max - 1)) + 1;
        }
        this.x = this.boxSize * randomNumX
        this.y = this.boxSize * randomNumY
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

