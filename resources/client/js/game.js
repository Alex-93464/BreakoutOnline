/*
This file is for code related to the breakout game itself
 */


window.onload=function () {
    const gameCanvas=document.getElementById("gameCanvas");
    const ctx=gameCanvas.getContext('2d');
    const spriteSheet=document.getElementById("spriteSheet");

    gameCanvas.width=640;
    gameCanvas.height=320;

    var paddle={
        x:0,
        dx:0,
        redraw:function () {

        }
    };

    var ball={
        x:0,
        dx:0,
        y:0,
        dy:0,

    };

    var operator={
        score:0,
        level:0,
        mouseX:0,
        canvas:gameCanvas,
        setMouseX:function (e) {
            this.mouseX=Math.min(Math.max(e.clientX-this.canvas.getBoundingClientRect().left,0),640);
            console.log(this.mouseX);
        }
    };

    class Brick{
        constructor(x,y) {
            this.x=x;
            this.y=y;
        }
        draw(){
            //Draw brick
        }
        destroy(){
            //Clear brick and increment score
        }
    }

    var x=0;
    var y=0;
    var dx=1;
    var dy=1;
    function frame(){
        ctx.clearRect(x, y,10,10);
        if ((dx>0 && x+dx>630) || x+dx<0){
            dx=-dx;
        }
        if ((dy>0 && y+dy>310) || y+dy<0){
            dy=-dy;
        }
        x+=dx;
        y+=dy;
        ctx.drawImage(spriteSheet, 0, 0, 10, 10, x, y, 10, 10);
    }

    document.onmousemove=operator.setMouseX;
    window.setInterval(frame, 20);
}

