const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Marble{
    constructor(x,y,color,maxmotionX,maxmotionY,color2,delay){
        this.x = x
        this.y = y
        this.color = color
        this.color2 = color2
        this.delay = delay
        this.time = 0
        var num = Math.random()*10
        this.motionX = num*maxmotionX
        this.motionY = (10-num)*maxmotionY
    }

    draw(){
        if (this.time>=this.delay){
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x,this.y,7.5,0,Math.PI*2,false)
            ctx.fill()
            this.x += this.motionX
            this.y += this.motionY
            if (this.x>=800 || this.x<=0){
                this.motionX *= -1
            }
            if (this.y>=800 || this.y<=0){
                this.motionY *= -1
            }
        }
        else{
            this.time += 1
        }
    }

    detectCollision(){
        var x = Math.round(this.x/20)*20
        var y = Math.round(this.y/20)*20
        for (let i=0; i<allSquares.length; i++){
            for (let k=0; k<allSquares[i].length; k++){
                if (allSquares[i][k].x == x && allSquares[i][k].y == y){
                    if (allSquares[i][k].color == this.color2){
                        return false
                    }
                    else{
                        return true
                    }
                }
            }
        }
    }
}
class Turret{
    constructor(x,y,color,color2,x2,y2,maxmotionX,maxmotionY,color3){
        this.x = x
        this.y = y
        this.color = color
        this.marbles = []
        this.time = 0
        this.color2 = color2
        this.x2 = x2
        this.y2 = y2
        this.maxmotionX = maxmotionX
        this.maxmotionY = maxmotionY
        this.color3 = color3
        this.count = 1
        this.hold = 1
        this.time2 = 0
        this.shooting = false
        this.time3 = 0
        this.chance = 0.5
    }

    draw(){
        var a = 0
        if (this.time>=60 && this.shooting == false){
            var chance = Math.random()
            if (this.chance<(2/3)){this.chance += 0.00025}
            if (chance>this.chance){
                this.hold += this.count
                this.shooting = true
                while (this.count>a){
                    this.marbles.push(new Marble(this.x2,this.y2,this.color2,this.maxmotionX,this.maxmotionY,this.color3,a*2))
                    a+=1
                    this.time2 += 2
                }
                this.count = 1
            }
            else{
                this.count *= 2
            }
            this.time = 0
        }
        else if(this.shooting == false){
            this.time += 1
        }
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x,this.y,15,0,Math.PI*2,false)
        ctx.fill()
        for (let i=0; i<this.marbles.length; i++){
            this.marbles[i].draw()
            //var hit = this.marbles[i].detectCollision()
        }
        const hit = this.marbles.find((m) => m.detectCollision())
        if (hit != undefined){
            var x = Math.round(hit.x/20)*20
            var y = Math.round(hit.y/20)*20
            for (let i=0; i<allSquares.length; i++){
                for (let k=0; k<allSquares[i].length; k++){
                    if (allSquares[i][k].x == x && allSquares[i][k].y == y){
                        let ocolor = allSquares[i][k].color
                        allSquares[i][k].color = this.color3
                        for (let g=0; g<greenSquares.length; g++){
                            if (greenSquares[g].x == x && greenSquares[g].y == y && greenSquares[g].color == ocolor){
                                greenSquares.splice(g,1)
                            }
                        }
                        for (let g=0; g<blueSquares.length; g++){
                            if (blueSquares[g].x == x && blueSquares[g].y == y && blueSquares[g].color == ocolor){
                                blueSquares.splice(g,1)
                            }
                        }
                        for (let g=0; g<redSquares.length; g++){
                            if (redSquares[g].x == x && redSquares[g].y == y && redSquares[g].color == ocolor){
                                redSquares.splice(g,1)
                            }
                        }
                        for (let g=0; g<yellowSquares.length; g++){
                            if (yellowSquares[g].x == x && yellowSquares[g].y == y && yellowSquares[g].color == ocolor){
                                yellowSquares.splice(g,1)
                            }
                        }
                        if(i==0){greenSquares.push(new Square(x,y,this.color3))}
                        if(i==1){blueSquares.push(new Square(x,y,this.color3))}
                        if(i==2){yellowSquares.push(new Square(x,y,this.color3))}
                        if(i==3){redSquares.push(new Square(x,y,this.color3))}
                    }
                }
            }
            const index = this.marbles.indexOf(hit)
            this.marbles.splice(index, 1)
        }
        ctx.fillStyle = '#000000'
        ctx.font = '48px Arial'
        if (this.shooting == false){ctx.fillText(this.count, this.x-20, this.y+20)}
        else{
            this.time2 -= 1
            if (this.time3==1){
                this.time3 = 0
                this.hold -= 1
            }
            else{
                this.time3 += 1
            }
            if (this.time2 == 1){
                this.shooting = false
            }
            ctx.fillText(this.hold-1, this.x-20, this.y+20)
        }
    }
}
class Square{
    constructor(x,y,color){
        this.color = color
        this.x = x
        this.y = y
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x+1,this.y+1,18,18)
    }
}
const greenSquares = []
const blueSquares = []
const yellowSquares = []
const redSquares = []
for (let i=0; i<20; i++){
    for (let k=0; k<20; k++){
        greenSquares.push(new Square(i*20,k*20,'#00ff00'))
    }
}
for (let i=0; i<20; i++){
    for (let k=0; k<20; k++){
        blueSquares.push(new Square(780-i*20,k*20,'#0000ff'))
    }
}
for (let i=0; i<20; i++){
    for (let k=0; k<20; k++){
        redSquares.push(new Square(780-i*20,400+k*20,'#ff0000'))
    }
}
for (let i=0; i<20; i++){
    for (let k=0; k<20; k++){
        yellowSquares.push(new Square(i*20,400+k*20,'#ffff00'))
    }
}
const greenTurret = new Turret(20,20,'#007d00','#00bd00',40,40,1,1,'#00ff00')
const blueTurret = new Turret(780,20,'#00007d','#0000bd',760,40,-1,1,'#0000ff')
const redTurret = new Turret(780,780,'#7d0000','#bd0000',760,760,-1,-1,'#ff0000')
const yellowTurret = new Turret(20,780,'#7d7d00','#bdbd00',40,780,1,-1,'#ffff00')
const allSquares = [greenSquares,blueSquares,yellowSquares,redSquares]

function update(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,1000,800)
    ctx.fillStyle = '#000000'
    for (let i=0; i<=40; i++){
        ctx.beginPath()
        ctx.moveTo(0,i*20)
        ctx.lineTo(800,i*20)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(i*20, 0)
        ctx.lineTo(i*20,800)
        ctx.stroke()
    }
    for (let i=0; i<greenSquares.length; i++){
        greenSquares[i].draw()
    }
    for (let i=0; i<blueSquares.length; i++){
        blueSquares[i].draw()
    }
    for (let i=0; i<redSquares.length; i++){
        redSquares[i].draw()
    }
    for (let i=0; i<yellowSquares.length; i++){
        yellowSquares[i].draw()
    }
    greenTurret.draw()
    blueTurret.draw()
    redTurret.draw()
    yellowTurret.draw()
    ctx.fillStyle = '#000000'
    ctx.font = '24px Arial'
    ctx.fillText(greenTurret.chance.toFixed(3), 850, 200)
    ctx.fillText(blueTurret.chance.toFixed(3), 850, 230)
    ctx.fillText(redTurret.chance.toFixed(3), 850, 260)
    ctx.fillText(yellowTurret.chance.toFixed(3), 850, 290)
    requestAnimationFrame(update)
}
update()