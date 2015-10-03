// Created by Annie on 2015/9/10.
 
var num = 20;
var wid = 800;
var hei = 500;
var flag;
var cnt1 = 0;
var cnt2 = 0;
var a = [];
var acceler = 0;
var creamWidth = 36;
var creamHeight = 42;
var girlWidth = 50;
var girlHeight = 50;
var gameState;
var stage;
var oDiv = document.getElementById("start");
var oA = oDiv.getElementsByTagName("a")[0];
var oFrame = document.getElementById("frame");

var STATE = {
    START: 0,
    PLAY: 1,
    END: 2
};

var FLAG = {
    FIRST: 0,
    ODD: 1,
    EVEN: 2
};
window.onload = function() {
    stage = new createjs.Stage("gameView");
    startGame();
};
function startGame(){
    a.length = 0;
    stage.removeAllChildren();
    oA.style.display = "block";
    gameState = STATE.START;
    initializeGame();
    initialObjects();
    oA.onclick = function(){
        this.style.display = "none";
        enterGame();
    }
}

function enterGame(){
    gameState = STATE.PLAY;
    oFrame.style.cursor = "none";
    a.length = 0;
    stage.removeAllChildren();
    cnt1 = 0;
    cnt2 = 0;
    num = 30;
    acceler = 0;
    initializeGame();
    initialObjects();
    mouseMove();
}

function gameOver(){
    gameState = STATE.END;
    oFrame.style.cursor = "auto";
    startGame();
    createjs.Sound.play('background');
}

function resetGame(){
    //
    enterGame();
}

createjs.Ticker.setFPS(100);

function initializeMusic(){
    createjs.Sound.registerSound(
        {
            src:"sound/eat.mp3",
            id:"eat"
        }
    );
    createjs.Sound.registerSound(
        {
            src:"sound/bgm.mp3",
            id:"background"
        }
    );
    createjs.Sound.registerSound(
        {
            src:"sound/fail.mp3",
            id:"fail"
        }
    );
    createjs.Sound.addEventListener("fileload", function(){   //注意弄成循环的
        createjs.Sound.play('background');
   });
}

function initializeBackgroundPic(){
    var bg = new createjs.Bitmap("image/bg.jpg");
    stage.addChild(bg);
    stage.update();
}

function initializeGame(){
    initializeMusic();
    initializeBackgroundPic();
}

function initialObjects(){
    flag = FLAG.FIRST;
    for (var i = 0; i < num; i++) {
        var temp = createObstacle(0);
        stage.addChild(temp);
        a.push(temp);
    }
    stage.update();
    flag = FLAG.ODD;
}

function createObstacle(type){
    var x, y,scale;
    if(flag == FLAG.FIRST) {
        x = Math.ceil(Math.random() * wid);
        y = Math.ceil(Math.random() * hei / 3);
    }
    else if(flag == FLAG.ODD){
        x = Math.ceil(Math.random() * wid);
        y = 0;
        flag = FLAG.EVEN;
    }
    else{
         x = wid;
         y = Math.ceil(Math.random() * hei);
        flag = FLAG.ODD;
    }
    if(type == 0){
        scale = Math.random() * 0.4 + 0.5;
    }
    else{
        scale = 1;
    }
    var spe = Math.random() / 5 + 1;
    return new Obstacle(type, x, y, scale, spe);
}

function Obstacle(type, x, y, scale, spe){
    this.setType(type);
    this.x = x;
    this.y = y;
    this.scaleX = scale;
    this.scaleY = scale;
    this.speed = spe;

}

Obstacle.prototype = new createjs.Bitmap();

Obstacle.prototype.setType = function(type){
    this.type = type;
    switch(type){
        case 0:  // create a flower
            createjs.Bitmap.call(this, "image/flower.png");
            break;
        case 1:  // create a cream
            createjs.Bitmap.call(this, "image/cream.png");
            break;
    }
};



function mouseMove(){
    var mousePic = new createjs.Bitmap("image/girl.png");
    mousePic.rotation = 45;
    mousePic.regX = girlWidth / 2;
    mousePic.regY = girlHeight / 2;
    mousePic.x = stage.mouseX;
    mousePic.y = stage.mouseY;
    stage.addChild(mousePic);
    mousePic.addEventListener("tick", function(){
        mousePic.x = stage.mouseX;
        mousePic.y = stage.mouseY + mousePic.regY;
    });
}

function isColliding(obj) {
    if(Math.abs(obj.x - stage.mouseX) <= 15 && Math.abs(obj.y - stage.mouseY) <= 15 || stage.mouseX <= 0 || stage.mouseY <=0 || stage.mouseX >= wid || stage.mouseY >=hei){
        createjs.Sound.stop("background");
        createjs.Sound.play("fail");
        gameOver();
    }
}

function isEat(temp){
    var x = temp.x;
    var y = temp.y;
    if(Math.abs(x - stage.mouseX) <= 35 && Math.abs(y - stage.mouseY) <= 35){
        stage.removeChild(temp);
        stage.update();
        createjs.Sound.play("eat");
    }
}

function obstacleMove(obj){
    obj.x -= obj.speed + acceler;
    obj.y += obj.speed + acceler;
}

function isOverBoundary(x, y){
    if((y > stage.canvas.height + 20) || (x < -20)){
        return true;
    }
    return false;
}

function removeObstacle(arr, i){
    var obj = arr.splice(i, 1)[0];
    stage.removeChild(obj);
    stage.update();
}

function updateParam(){
    acceler += 0.3;
    if(num < 50) num = num + 5;
}

createjs.Ticker.addEventListener("tick", function(){
        cnt1++;
        cnt2++;
        for (var i = 0; i < a.length;) {
            var obj = a[i];
            obstacleMove(obj);
            if(gameState == STATE.PLAY)
                isColliding(obj);
            if(isOverBoundary(obj.x, obj.y) == true){
                removeObstacle(a, i);
                var temp = createObstacle(0);
                stage.addChild(temp);
                stage.update();
                a.push(temp);
            }
            stage.update();
            i++;
        }
        if(cnt1 > 1500) {
            updateParam();
            cnt1 = 0;

        }
        if(gameState == STATE.PLAY && cnt2 > 800){
            var temp = createObstacle(1);
            temp.rotation = 0;
            temp.regX = creamWidth / 2;
            temp.regY = creamHeight / 2;
            stage.addChild(temp);
            temp.addEventListener("tick", function(){
                temp.x -= 0.05;
                temp.y += 0.05;
                isEat(temp);
                temp.rotation += 0.03;
                if (isOverBoundary(temp.x, temp.y)) {
                    stage.removeChild(temp);
                }
            });
            cnt2 = 0;
        }

    }
);