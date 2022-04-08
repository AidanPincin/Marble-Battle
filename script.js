const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
function drawRect(color,x,y,w,h){ctx.fillStyle = color;ctx.fillRect(x,y,w,h)}
const sqaureSize = 24
class Square{
    constructor(x,y,color){
        this.x = x
        this.y = y
        this.color = color
        this.width = sqaureSize
        this.height = sqaureSize
    }
    draw(){drawRect(this.color,this.x,this.y,this.width,this.height)}
    collide(x,y,width,height,color){
        if (x<=this.x+this.width && x+width>=this.x && y<=this.y+this.height && y+height>=this.y){
            if (this.color != color){this.color = color; this.draw(); return true}
            else{this.draw(); return false}
        }
    }
}
const squares = []
for (let i=0; i<500/(sqaureSize+1); i++){
    for (let g=0; g<500/(sqaureSize+1);g++){
        squares.push(new Square(200+i*(sqaureSize+1),g*(sqaureSize+1),'#00ff00'))
        squares.push(new Square(700+i*(sqaureSize+1),g*(sqaureSize+1),'#0000ff'))
        squares.push(new Square(200+i*(sqaureSize+1),500+g*(sqaureSize+1),'#ff0000'))
        squares.push(new Square(700+i*(sqaureSize+1),500+g*(sqaureSize+1),'#ffff00'))
    }
}
class Marble{
    constructor(x,y,size,marbleColor,squareColor,integer1,integer2){
        this.x = x
        this.y = y
        this.size = size
        this.marbleColor = marbleColor
        this.squareColor = squareColor
        this.x_speed = Math.random()*15*integer1
        this.y_speed = (15-Math.sqrt(Math.pow(this.x_speed,2)))*integer2
    }
    draw(){
        let width = (5+Math.sqrt(Math.sqrt(this.size)))
        let height = width
        for (let i=0; i<squares.length; i++){
            if (this.size>0){
                let hit = squares[i].collide(this.x-width/2,this.y-height/2,width,height,this.squareColor)
                if (hit == true){this.size -= 1}
            }
        }
        ctx.beginPath()
        ctx.arc(this.x,this.y,5+Math.sqrt(Math.sqrt(this.size)),0,Math.PI*2,false)
        ctx.fillStyle = this.marbleColor
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '18px Arial'
        width = ctx.measureText(this.size).width
        ctx.fillText(this.size,this.x-width/2,this.y+5)
        this.x += this.x_speed
        this.y += this.y_speed
        if (this.x>=1200-height || this.x<=200+height){this.x_speed *= -1}
        if (this.y>=1000-height || this.y<=height){this.y_speed *= -1}
    }
}
class Tower{
    constructor(x,y,marbleColor,squareColor,integer1,integer2){
        this.x = x
        this.y = y
        this.size = 1
        this.marbles = []
        this.marbleColor = marbleColor
        setInterval(() => {
            const chance = Math.random()
            if (chance<0.5 && this.size<10000){
                this.marbles.push(new Marble(x,y,this.size,marbleColor,squareColor,integer1,integer2))
                this.size = 1
            }
            else{this.size *= 2}
            console.log(this.marbles)
        },1000)
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,10+Math.sqrt(Math.sqrt(this.size)),0,Math.PI*2,false)
        ctx.fillStyle = this.marbleColor
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '18px Arial'
        let width = ctx.measureText(this.size).width
        ctx.fillText(this.size,this.x-width/2,this.y+5)
        for (let i=0; i<this.marbles.length; i++){
            this.marbles[i].draw()
            if (this.marbles[i].size<=0){
                this.marbles.splice(i,1)
            }
        }
    }
}
const greenTower = new Tower(275,75,'#007d00','#00ff00',1,1)
const blueTower = new Tower(1125,75,'#00007d','#0000ff',-1,1)
const redTower = new Tower(275,925,'#7d0000','#ff0000',1,-1)
const yellowTower = new Tower(1125,925,'#7d7d00','#ffff00',-1,-1)
function mainLoop(){
    drawRect('#000000',0,0,1400,1000)
    for (let i=0; i<squares.length; i++){squares[i].draw()}
    greenTower.draw()
    redTower.draw()
    yellowTower.draw()
    blueTower.draw()
    requestAnimationFrame(mainLoop)
}
mainLoop()
