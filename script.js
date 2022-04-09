const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
function drawRect(color,x,y,w,h){ctx.fillStyle = color;ctx.fillRect(x,y,w,h)}
const sqaureSize = 19
const marbleSpeed = 15
let Chance = 0.75
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
        if (x-width/2<=this.x+this.width && x+width*1.5>=this.x && y-height/2<=this.y+this.height && y+height*1.5>=this.y){
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
    constructor(x,y,size,marbleColor,squareColor,angle){
        this.x = x
        this.y = y
        let a = angle*20*Math.PI
        if (a<0){a+=360}
        if (a<90 && a>0){
            this.y_speed = a/90*marbleSpeed
            this.x_speed = (marbleSpeed-this.y_speed)/Math.sqrt(Math.sqrt(size))
            this.y_speed /= Math.sqrt(Math.sqrt(size))
        }
        if (a<360 && a>270){
            this.x_speed = (a-270)/90*marbleSpeed
            this.y_speed = (this.x_speed-marbleSpeed)/Math.sqrt(Math.sqrt(size))
            this.x_speed /= Math.sqrt(Math.sqrt(size))
        }
        if (a<180 && a>90){
            this.x_speed = -(a-90)/90*marbleSpeed
            this.y_speed = (marbleSpeed+this.x_speed)/Math.sqrt(Math.sqrt(size))
            this.x_speed /= Math.sqrt(Math.sqrt(size))
        }
        if (a>180 && a<270){
            this.y_speed = -(a-180)/90*marbleSpeed
            this.x_speed = (-(marbleSpeed-(this.y_speed*-1)))/Math.sqrt(Math.sqrt(size))
            this.y_speed /= Math.sqrt(Math.sqrt(size))
        }
        this.size = size
        this.marbleColor = marbleColor
        this.squareColor = squareColor
        this.x += this.x_speed*(72.5/marbleSpeed)
        this.y += this.y_speed*(72.5/marbleSpeed)
    }
    draw(){
        let width = (5+Math.pow(this.size,0.4))
        let height = width
        let sqs = squares.filter(square => square.x<=this.x+width/2+sqaureSize*2+marbleSpeed && square.x>=this.x-width/2-sqaureSize*2-marbleSpeed && square.y<=this.y+height/2+sqaureSize*2+marbleSpeed && square.y>=this.y-height/2-sqaureSize*2-marbleSpeed)
        for (let i=0; i<sqs.length; i++){
            if (this.size>0){
                let hit = sqs[i].collide(this.x-width/2,this.y-height/2,width,height,this.squareColor)
                if (hit == true){this.size -= 1}
            }
        }
        ctx.beginPath()
        ctx.arc(this.x,this.y,5+Math.pow(this.size,0.4),0,Math.PI*2,false)
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
    constructor(x,y,marbleColor,squareColor,startAngle,endAngle){
        this.x = x
        this.y = y
        this.size = 1
        this.marbles = []
        this.marbleColor = marbleColor
        this.angle = startAngle
        this.clockwise = true
        this.startAngle = startAngle
        this.endAngle = endAngle
        setInterval(() => {
            let chance = Math.random()
            if (chance>Chance && this.size<5000){this.size *= 2}
            else{
                this.marbles.push(new Marble(x,y,this.size,this.marbleColor,this.squareColor,this.angle))
                this.size = 1
            }
        },1000)
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,10+Math.pow(this.size,0.4),0,Math.PI*2,false)
        ctx.fillStyle = this.marbleColor
        ctx.fill()
        ctx.save()
        ctx.translate(this.x,this.y)
        ctx.rotate(this.angle)
        ctx.moveTo(0,0)
        ctx.lineTo(62.5,0)
        ctx.strokeStyle = this.marbleColor
        ctx.lineWidth = 10
        ctx.stroke()
        ctx.restore()
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
        if (this.clockwise == true){this.angle += Math.PI/200}
        else{this.angle -= Math.PI/200}
        if (this.angle>this.endAngle){this.clockwise = false}
        if (this.angle<this.startAngle){this.clockwise = true}
    }
}
const greenTower = new Tower(275,75,'#007d00','#00ff00',-Math.PI/5,Math.PI/1.5)
const blueTower = new Tower(1125,75,'#00007d','#0000ff',-Math.PI*1.66,-Math.PI/1.25)
const redTower = new Tower(275,925,'#7d0000','#ff0000',-Math.PI/1.5,Math.PI/5)
const yellowTower = new Tower(1125,925,'#7d7d00','#ffff00',Math.PI/1.25,Math.PI*1.66)
let time = 0
function mainLoop(){
    drawRect('#000000',175,0,1250,1000)
    for (let i=0; i<squares.length; i++){squares[i].draw()}
    greenTower.draw()
    redTower.draw()
    yellowTower.draw()
    blueTower.draw()
    time += 1
    greenTower.squareColor = squares[0].color
    blueTower.squareColor = squares[2401].color
    yellowTower.squareColor = squares[squares.length-1].color
    redTower.squareColor = squares[98].color
    if (greenTower.squareColor == '#ff0000'){greenTower.marbleColor = '#7d0000'}
    if (greenTower.squareColor == '#0000ff'){greenTower.marbleColor = '#00007d'}
    if (greenTower.squareColor == '#ffff00'){greenTower.marbleColor = '#7d7d00'}
    if (greenTower.squareColor == '#00ff00'){greenTower.marbleColor = '#007d00'}
    if (redTower.squareColor == '#00ff00'){redTower.marbleColor = '#007d00'}
    if (redTower.squareColor == '#0000ff'){redTower.marbleColor = '#00007d'}
    if (redTower.squareColor == '#ffff00'){redTower.marbleColor = '#7d7d00'}
    if (redTower.squareColor == '#ff0000'){redTower.marbleColor = '#7d0000'}
    if (blueTower.squareColor == '#ff0000'){blueTower.marbleColor = '#7d0000'}
    if (blueTower.squareColor == '#00ff00'){blueTower.marbleColor = '#007d00'}
    if (blueTower.squareColor == '#ffff00'){blueTower.marbleColor = '#7d7d00'}
    if (blueTower.squareColor == '#0000ff'){blueTower.marbleColor = '#00007d'}
    if (yellowTower.squareColor == '#ff0000'){yellowTower.marbleColor = '#7d0000'}
    if (yellowTower.squareColor == '#0000ff'){yellowTower.marbleColor = '#00007d'}
    if (yellowTower.squareColor == '#00ff00'){yellowTower.marbleColor = '#007d00'}
    if (yellowTower.squareColor == '#ffff00'){yellowTower.marbleColor = '#7d7d00'}
    requestAnimationFrame(mainLoop)
}
mainLoop()
setInterval(() => {
    drawRect('#000000',0,0,200,1000)
    ctx.fillStyle = '#ffffff'
    ctx.font = '36px Arial'
    ctx.fillText(time+'    '+Chance.toFixed(2),5,75)
    time = 0
    if (Chance>0.25){Chance -= 0.001}
},1000)
window.addEventListener('keydown', function(e){if (e.key == 'r'){location.reload()}})
