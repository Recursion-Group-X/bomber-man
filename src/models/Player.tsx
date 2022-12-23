import playerImg from '../assets/player.png'
import bombImg from '../assets/bomb.png'

export class Player {
    name: string
    x: number
    y: number
    width: number
    height: number
    direction: string
    step: number
    items: Object[] = []
    bombs: number[][] = []

    canvasSize: number = 500
    numOfBox: number = 15
    boxSize: number = this.canvasSize / this.numOfBox
    constructor(
        name: string,
    )
    {
        this.name = name;
        this.x = 0
        this.y = 0
        this.width = 32
        this.height = 32
        this.direction = ''
        this.step = 5
    }

    getName(): string {
        return this.name
    }

    draw(canvas: CanvasRenderingContext2D | null | undefined): void {
        canvas?.save()
        this.clear(canvas)
        const img = document.createElement('img')
        img.src = playerImg
        canvas?.drawImage(
            img,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvas?.restore()
    }

    drawBombs(canvas: CanvasRenderingContext2D | null | undefined): void{
        for(let i = 0; i < this.bombs.length; i++){
            const bomb : number[] = this.bombs[i]
            canvas?.save()
            const img = document.createElement('img')
            img.src = bombImg
            canvas?.drawImage(
                img,
                bomb[1] * this.boxSize,
                bomb[0] * this.boxSize,
                this.width,
                this.height
            );
            canvas?.restore()
        }
        
    }

    clear(canvas: CanvasRenderingContext2D | null | undefined): void{
        canvas?.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }

    stopPlayer(e: any): void{
        const key: string = e.key
        if(
            (this.direction === 'right' && key === 'ArrowRight') || (this.direction === 'left' && key === 'ArrowLeft') ||
            (this.direction === 'up' && key === 'ArrowUp') || (this.direction === 'down' && key === 'ArrowDown')
        ) {
            this.direction = ''
        }
    }

    changeDirection(e: any): void{
        if(e.key === 'ArrowRight'){
            this.direction = 'right'
        } else if (e.key === 'ArrowUp'){
            this.direction = 'up'
        } else if (e.key === 'ArrowLeft'){
            this.direction = 'left'
        } else if (e.key === 'ArrowDown'){
            this.direction = 'down'
        }
    }

    move(canvas: CanvasRenderingContext2D | null | undefined, currentStage: number[][]): void{
        const centerX = this.x + this.width / 2
        const centerY = this.y + this.height / 2
        const i: number = this.getIndex(centerY)
        const j: number = this.getIndex(centerX)

        if(this.direction === 'up'){
            this.verticalMove(j, centerY, -1, currentStage)
        }
        else if(this.direction === 'down'){
            this.verticalMove(j, centerY, 1, currentStage)
        }
        else if(this.direction === 'left'){
            this.horizontalMove(i, centerX, -1, currentStage)
        }
        else if(this.direction === 'right'){
            this.horizontalMove(i, centerX, 1, currentStage)
        }
        this.draw(canvas)
    }

    getIndex(position: number): number{
        return Math.floor(position / this.boxSize)
    }

    horizontalMove(i: number, centerX: number, direction: number, currentStage: number[][]): void{
        if(currentStage[i][this.getIndex(centerX)] === 3 && currentStage[i][this.getIndex(centerX) + 1 * direction] === 0){
            this.y = i * this.boxSize
            this.x += this.step * direction
            return
        }
        const nextX = centerX + this.step * direction
        const nextIndexJ = this.getIndex(nextX)
        let bound = this.x + this.step * direction
        if(direction >= 0) bound += this.width
        if(this.getIndex(bound) < 0 || this.getIndex(bound) > this.numOfBox - 1) return
        if(currentStage[i][nextIndexJ] !== 0 || currentStage[i][this.getIndex(bound)] !== 0) return
        this.y = i * this.boxSize
        this.x += this.step * direction
    }

    verticalMove(j: number, centerY: number, direction: number, currentStage: number[][]): void {
        if(currentStage[this.getIndex(centerY)][j] === 3 && currentStage[this.getIndex(centerY) + 1 * direction][j] === 0){
            this.x = j * this.boxSize
            this.y += this.step * direction
            return
        }
        const nextY = centerY + this.step * direction
        const nextIndexI = this.getIndex(nextY)
        let bound = this.y + this.step * direction
        if(direction >= 0) bound += this.height
        if(this.getIndex(bound) < 0 || this.getIndex(bound) > this.numOfBox - 1) return
        if(currentStage[nextIndexI][j] !== 0 || currentStage[this.getIndex(bound)][j] !== 0) return
        this.x = j * this.boxSize
        this.y += this.step * direction
    }


    putBomb(e: any, currentStage: number[][]): void {
        if(e.key === ' '){
            const i: number = this.getIndex(this.y + this.height / 2)
            const j: number = this.getIndex(this.x + this.width / 2)
            this.bombs.push([i, j])
            setTimeout(() => {
                this.bombs.splice(0, 1)
                currentStage[i][j] = 0
            }, 3000);
            currentStage[i][j] = 3
        }
    }
    
}