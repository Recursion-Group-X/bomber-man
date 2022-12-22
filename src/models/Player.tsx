import playerImg from '../assets/player.png'
export class Player {
    name
    x
    y
    width
    height
    direction
    isMoving
    constructor(
        name: string,
        x: number,
        y: number,
        width: number,
        height: number,
    )
    {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height
        this.direction = ''
        this.isMoving = false
    }
    
    

    getName(): string {
        return this.name
    }

    draw(canvas: CanvasRenderingContext2D | null | undefined): void {
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
    }

    clear(canvas: CanvasRenderingContext2D | null | undefined): void{
        canvas?.clearRect(0, 0, 500, 500);
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

    move(canvas: CanvasRenderingContext2D | null | undefined): void{
        if(this.direction === 'up') this.y -= 5
        else if(this.direction === 'down') this.y += 5
        else if(this.direction === 'right') this.x += 5
        else if(this.direction === 'left') this.x -= 5
        this.draw(canvas)
    }
}