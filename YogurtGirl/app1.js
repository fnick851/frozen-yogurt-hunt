/**
 * Created by Annie on 2015/9/10.
 */
var num = 20;
var wid = 800;
var hei = 500;
var flag = true;
var speed = [];
var cnt1 = 0;
var cnt2 = 0;
var a = [];
var acceler = 0;
var stage = new createjs.Stage("gameView");

var mousePic = new createjs.Bitmap("girl.png");
mousePic.rotation = 45;
stage.addChild(mousePic);
mousePic.addEventListener("tick", function(){
    mousePic.x = stage.mouseX - 22;
    mousePic.y = stage.mouseY - 26;
});
createjs.Ticker.setFPS(100);

for (var i = 0; i < num; i++) {
    var x = Math.ceil(Math.random() * wid);
    var y = Math.ceil(Math.random() * hei / 3);
    var scale = Math.random() * 0.4 + 0.5;
    var spe = Math.random() / 5 + 1;
    var temp = new createjs.Bitmap("flower.png");
    temp.scaleX = scale;
    temp.scaleY = scale;
    temp.x = x;
    temp.y = y;
    stage.addChild(temp);
    a.push(temp);
    speed.push(spe);


}


createjs.Ticker.addEventListener("tick", function(){
        cnt1++;
        cnt2++;
        for (var i = 0; i < a.length; i++) {
            var temp1 = a[i];
            var temp2 = speed[i];
            temp1.x -= temp2 + acceler;
            temp1.y += temp2 + acceler;
            if ((temp1.y > stage.canvas.height + 20) || (temp1.x < -20)) {
                a.splice(i, 1);
                speed.splice(i, 1);
                i--;
                stage.removeChild(temp1);
                stage.update();
                var temp = new createjs.Bitmap("flower.png");
                var scale = Math.random() * 0.4 + 0.5;
                var spe = Math.random() / 5 + 1;
                temp.scaleX = scale;
                temp.scaleY = scale;
                if(flag == true) {
                    temp.x = Math.ceil(Math.random() * wid);
                    temp.y = 0;
                    flag = false;
                }
                else{
                    temp.x = wid;
                    temp.y = Math.ceil(Math.random() * hei);
                    flag = true;
                }
                stage.addChild(temp);
                stage.update();
                a.push(temp);
                speed.push(spe);
            }
            stage.update();
        }
        if(cnt1 > 1500) {
            acceler += 0.3;
            cnt1 = 0;
            if(num < 50) num = num + 5;
        }
        if(cnt2 > 800){
            var temp = new createjs.Bitmap("yogurt.png");
            var spe = Math.random() / 5 + 1;
            if(flag == true) {
                temp.x = Math.ceil(Math.random() * (wid - 150) + 150);
                temp.y = 0;
                flag = false;
            }
            else{
                temp.x = wid;
                temp.y = Math.ceil(Math.random() * (hei - 50));
                flag = true;
            }
            temp.rotation = 0;
            temp.regX = 18;
            temp.regY = 21;
            stage.addChild(temp);
            temp.addEventListener("tick", function(){
                temp.rotation += 0.03;
            });
            a.push(temp);
            speed.push(spe);
            cnt2 = 0;
        }

    }
);
