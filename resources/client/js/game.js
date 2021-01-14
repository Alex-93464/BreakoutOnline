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
            ctx.clearRect(paddle.x,275,95,25);
            paddle.dx=operator.mouseX-paddle.x;
            paddle.x=operator.mouseX;
            ctx.drawImage(spriteSheet,185,111,95,25,paddle.x,275,95,25);
        }
    };

    var ball={
        x:0,
        dx:1,
        y:0,
        dy:1,

        hitEdge:function () {
            if ((ball.dx>0 && ball.x+ball.dx>617) || ball.x+ball.dx<0){
                ball.dx*=-1;
            }
            if (ball.y+ball.dy<0){
                ball.dy*=-1;
            }
        },

        hitPaddle:function () {
            if (ball.y+ball.dy>252 && ball.x+ball.dx+23>paddle.x && ball.x+ball.dx<paddle.x+95){ //Inside Paddle
                if (ball.y+ball.dy<275){ //Top
                    ball.dy*=-1;
                    ball.dx+=paddle.dx;
                }
                if (ball.x+ball.dx<paddle.x){ //Left
                    if (ball.dx>0){
                        ball.dx*=-1;
                    } else {
                        ball.dx+=paddle.dx;
                    }
                } else if (ball.x+ball.dx+23>paddle.x+95){ //Right
                    if (ball.dx<0){
                        ball.dx*=-1;
                    } else {
                        ball.dx+=paddle.dx;
                    }
                }
            }
        },

        hitBrick:function () {

        },

        redraw:function () {
            ctx.clearRect(ball.x,ball.y,23,23);
            //Check for collisions
            ball.hitEdge();
            ball.hitPaddle();
            ball.x+=ball.dx;
            ball.y+=ball.dy;
            ctx.drawImage(spriteSheet,1,80,23,23,ball.x,ball.y,23,23);
        }

    };

    var operator={
        score:0,
        level:0,
        bricks:[],
        remBricks:0,
        mouseX:0,
        canvas:gameCanvas,

        setMouseX:function (e) {
            operator.mouseX=Math.min(Math.max(e.clientX-operator.canvas.getBoundingClientRect().left,0),545);
        },

        frame:function () {
            paddle.redraw();
            ball.redraw();
        },

        startLevel:function () {
            ctx.clearRect(0,0,640,320);
            ball.x=320;
            ball.y=275;
            ball.dx=1;
            ball.dy=-1;

            for (let row=0;row<6;row++){
                operator.bricks[row]=[];
                for (let col=0;col<4;col++){
                    operator.bricks[row][col]=new Brick(123+row*66,33+col*33);
                    operator.bricks[row][col].draw();
                    console.log("Drew brick at",row,col);
                }
            }
            operator.remBricks=24;
        },
    };

    class Brick{
        constructor(x,y) {
            this.x=x;
            this.y=y;
            this.alive=true;
        }
        draw(){
            ctx.drawImage(spriteSheet,1,1,64,31,this.x,this.y,64,31);
        }
        destroy(){
            ctx.clearRect(this.x,this.y,64,31);
            operator.score++;
            operator.remBricks--;
            this.alive=false;
            if (operator.remBricks==0){
                operator.startLevel();
            }
        }
    }

    operator.startLevel();

    document.onmousemove=operator.setMouseX;
    window.setInterval(operator.frame, 10);
}

