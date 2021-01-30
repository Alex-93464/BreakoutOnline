/*
This file is for code related to the breakout game itself
 */


window.onload=function () {
    const gameCanvas=document.getElementById("gameCanvas");
    const ctx=gameCanvas.getContext('2d');
    const spriteSheet=document.getElementById("spriteSheet");

    gameCanvas.width=640;
    gameCanvas.height=320;

    //Object representing the paddle
    var paddle={
        //dx stores change in x-coordinate per frame
        x:0,
        dx:0,

        redraw:function () {
            ctx.clearRect(paddle.x,275,95,25);
            paddle.dx=operator.mouseX-paddle.x;
            paddle.x=operator.mouseX;
            ctx.drawImage(spriteSheet,185,111,95,25,paddle.x,275,95,25);
        }
    };

    //Object representing the ball, dealing with collisions
    var ball={
        //dx and dy store change in coordinates per frame
        x:0,
        dx:1,
        y:0,
        dy:1,
        maxSpeed:5,

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
                && ball.x+ball.dx<=518
                && ball.y+ball.dy>=10
                && ball.y+ball.dy<=164
            ){
                let row=Math.floor((ball.y+ball.dy-33)/33);
                let col=Math.floor((ball.x+ball.dx-123)/66);
                let onEdgeX=false;
                let onEdgeY=false;
                if (col==-1 || (col!==5 && (ball.x+ball.dx-123)%66>=43)){
                    onEdgeX=true;
                }
                if (row==-1 || (row!==3 && (ball.y+ball.dy-33)%33>=10)){
                    onEdgeY=true;
                }

                if (row!==-1 && col!==-1){
                    ball.hitBrick(row,col);
                }
                if (row!==-1 && onEdgeX){
                    ball.hitBrick(row,col+1);
                }
                if (onEdgeY && col!==-1){
                    ball.hitBrick(row+1,col);
                }
                if (onEdgeY && onEdgeX){
                    ball.hitBrick(row+1,col+1);
                }
            }
        },

        hitBrick:function (row, col) {
            let brick=operator.bricks[row][col];
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
//            ctx.drawImage(spriteSheet,1,80,64,31,brick.x,brick.y,64,31);
        },

        redraw:function () {
            ctx.clearRect(ball.x,ball.y,23,23);
            //Check for collisions
            ball.hitEdge();
            ball.hitPaddle();
            ball.checkBricks();

            if (ball.dx>ball.maxSpeed){
                ball.dx=ball.maxSpeed;
            } else if (ball.dx<-1*ball.maxSpeed){
                ball.dx=-1*ball.maxSpeed;
            }

            ball.x+=ball.dx;
            ball.y+=ball.dy;
/*
            let newX = operator.mouseX;
            let newY = operator.mouseY;

            ball.dx=newX-ball.x;
            ball.dy=newY-ball.y;
            ball.x+=ball.dx;
            ball.y+=ball.dy;
*/

            ctx.drawImage(spriteSheet,1,80,23,23,ball.x,ball.y,23,23);
        }

    };

    //Object representing the game itself
    var operator={
        //remBricks stores count of remaining bricks
        score:0,
        level:0,
        bricks:[],
        remBricks:0,
        mouseX:0,
        mouseY:0,
        canvas:gameCanvas,

        setMouseX:function (e) {
            operator.mouseX=Math.min(Math.max(e.clientX-operator.canvas.getBoundingClientRect().left,0),545);
            operator.mouseY=Math.min(Math.max(e.clientY-operator.canvas.getBoundingClientRect().top,0),320);
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

    /* Class for constructing brick objects
    * Brick objects are stored as a 2d array property of operator
    * The array is indexed by row and column
    * Bricks are simple objects that can create or destroy themselves */
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

