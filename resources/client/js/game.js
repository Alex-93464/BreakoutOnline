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

        checkBricks:function () {
            if (ball.x+ball.dx>=100
                && ball.x+ball.dx<=494
                && ball.y+ball.dy<=140
                && ball.y+ball.dy>=10
            ){
                let row=Math.floor((ball.y+ball.dy-10)/33);
                let col=Math.floor((ball.x+ball.dx-100)/66);
                console.log(col,row);
                let onEdgeX=false;
                let onEdgeY=false;
                if (col!==5 && (ball.x+ball.dx-100)%66>=43){
                    onEdgeX=true;
                }
                if (row!==3 && (ball.y+ball.dy-10)%33>=10){
                    onEdgeY=true;
                }
                ball.hitBrick(row,col);
                if (onEdgeX){
                    ball.hitBrick(row,col+1);
                }
                if (onEdgeY){
                    ball.hitBrick(row+1,col);
                }
                if (onEdgeX && onEdgeY){
                    ball.hitBrick(row+1,col+1);
                }
            }
        },

        hitBrick:function (row, col) {
            let brick=operator.bricks[row][col];
            ctx.drawImage(spriteSheet,1,40,64,31,brick.x,brick.y,64,31);
            if (brick.alive
                && ball.x+ball.dx>=brick.x-23
                && ball.x+ball.dx<=brick.x+64
                && ball.y+ball.dy>=brick.y-23
                && ball.y+ball.dy<=brick.y+31
            ){
                if ((ball.dx>0 && ball.x+ball.dx<brick.x) || ball.x+ball.dx>brick.x+41){
                    ball.dx*=-1;
                }
                if ((ball.dy>0 && ball.y+ball.dy<brick.y) || ball.y+ball.dy>brick.y+8){
                    ball.dy*=-1;
                }
                brick.destroy();
            }
        },

        redraw:function () {
            ctx.clearRect(ball.x,ball.y,23,23);
            //Check for collisions
            ball.hitEdge();
            ball.hitPaddle();
            ball.checkBricks();
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
            ball.y=270;
            ball.dx=1;
            ball.dy=-1;

            for (let row=0;row<4;row++){
                operator.bricks[row]=[];
                for (let col=0;col<6;col++){
                    operator.bricks[row][col]=new Brick(123+col*66,33+row*33);
                    operator.bricks[row][col].draw();
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

