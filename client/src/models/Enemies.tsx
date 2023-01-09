import { Config } from "../bombermanConfig"
import enemyFrontImg from '../assets/enemy-front.png'
import enemyFrontWalk1Img from '../assets/enemy-front-walk1.png'
import enemyFrontWalk2Img from '../assets/enemy-front-walk2.png'
import enemyBackImg from '../assets/enemy-back.png'
import enemyBackWalk1Img from '../assets/enemy-back-walk1.png'
import enemyBackWalk2Img from '../assets/enemy-back-walk2.png'
import enemyLeftImg from '../assets/enemy-left.png'
import enemyLeftWalkImg from '../assets/enemy-left-walk.png'
import enemyRightImg from '../assets/enemy-right.png'
import enemyRightWalkImg from '../assets/enemy-right-walk.png'

export class Enemies {
    x: number = 0;
    y: number = 0;
    width: number
    height: number
    direction: string
    pastDirection: string
    enemyImg: string
    isFirst: boolean =true;

    maxBolcks: number
    canvasSize: number = 510
    numOfBox: number = 17
    boxSize: number = this.canvasSize / this.numOfBox


    constructor(config: Config, currentStage: number[][]) {
        this.maxBolcks = config.x;
        if(this.isFirst){
            this.inititalDefinePosition(currentStage);
        }else{
            this.definePosition(currentStage);
        }
        
        this.width = 32;
        this.height = 32;
        this.direction = '';
        this.pastDirection = 'down';
        this.enemyImg = enemyFrontImg;

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
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
        img.src = this.changeEnemyImg()
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

    getIndex(position: number): number{
        return Math.floor(position / this.boxSize)
    }

    changeRandomDirection(): void {
        const Directon: string[] = ['up','down','left','right']
        const randomNum: number = Math.floor(Math.random() * (3 - 0)) + 0;


        this.pastDirection = this.direction
        this.direction = Directon[randomNum]
    }

    changeEnemyImg(): string{
        let src: string = enemyFrontImg
        if(this.direction === ''){
            if(this.pastDirection === 'up') src = enemyBackImg
            if(this.pastDirection === 'down') src = enemyFrontImg
            else if(this.pastDirection === 'left') src = enemyLeftImg
            else if(this.pastDirection === 'right') src = enemyRightImg
        } else{
            if(this.direction === 'down'){
                src = this.enemyImg === enemyFrontWalk1Img ? enemyFrontWalk2Img : enemyFrontWalk1Img
            }
            else if(this.direction === 'up'){
                src = this.enemyImg === enemyBackWalk1Img ? enemyBackWalk2Img : enemyBackWalk1Img
            }
            else if(this.direction === 'left'){
                src = this.enemyImg === enemyLeftImg ? enemyLeftWalkImg : enemyLeftImg
            }
            else if(this.direction === 'right'){
                src = this.enemyImg === enemyRightImg ? enemyRightWalkImg : enemyRightImg
            }
        }
        this.enemyImg = src
        return src
    }

}

