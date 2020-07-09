'use strict'Canvas').getContext('2d'),  
    width = ctx.canvas.width,  
var ctx = document.getElementById('my
    height = ctx.canvas.height;
  
function drawArc(s, e) {  
    var x = width / 2, // center x  
        y = height / 2, // center y  
        radius = 100,  
        counterClockwise = false;  // 顺时针旋转 true逆时针旋转
  
    ctx.fillStyle = "#ffffff";   // 填充区域颜色
    ctx.strokeStyle = "#e2e5e9";  // 边框颜色
    ctx.lineWidth = 4;
    ctx.lineCap = "round";  
  
    ctx.beginPath();  
    ctx.moveTo(x, y);  
    ctx.arc(x, y, radius, s, e, counterClockwise);  
    ctx.fill();  
  
  
}  
  
var step = 1,  
    startAngle = 0,  
    endAngle = 0;  
  
var animation_interval = 1000,  
    n = 10, // count of arc  
    varName;
  
/*var animation = function () {  
    if (step <= n) {  
        endAngle = step * 2 * Math.PI / n;  
        drawArc(startAngle, endAngle);  
        step++;  
    } else {  
        clearInterval(varName);  
    } 
    
};*/

function dragGraphic() {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = 200;
        ctx.canvas.height = 200;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#e2e5e9";
        ctx.fillRect(0, 0, 200, 200);

        for (var i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.arc(100, 100, 90, -0.25 * Math.PI, 0.25 * Math.PI, false);
            ctx.stroke()
        }

        ctx.globalCompositeOperation = "destination-out";

        for (var i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.arc(100, 100, 90, -1.25 * Math.PI, (-1.25 + 1.5 * (i * 0.05)) * Math.PI, false);
            ctx.stroke()
        }
        return ctx.canvas.toDataURL("image/png")
    }

    document.body.innerHTML = '<img src="' + dragGraphic() + '">';

$(function() {
   /* varName = setInterval(function(){
        if (step <= n) {  
            endAngle = step * 2 * Math.PI / n;  
            drawArc(startAngle, endAngle);  
            step++;  
        } else {  
            clearInterval(varName);  
        }  

    }, 1000);*/
});