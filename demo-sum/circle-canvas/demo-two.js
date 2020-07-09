var maxtime = 100,
    realtime = 0,
    percent = 0,  // 实时比例
    angle = 2*Math.PI/maxtime;
    total = 0,
    subValue = 0;

function dragGraphicstart(ctx) {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth =10;
    ctx.lineCap = "round";
    ctx.arc(200, 200, 90, -0.5 * Math.PI, 1.5 * Math.PI, false);
    ctx.stroke();
}

function dragGraphic() {
        var ctx = document.getElementById('myCanvas').getContext('2d');
        ctx.canvas.width = 400;
        ctx.canvas.height = 400;
        ctx.fillStyle = "#transparent";
        dragGraphicstart(ctx);
        
        if(realtime == maxtime) {
            realtime = 0;
            total = 0;
        }else {
            realtime ++;
            percent = realtime/maxtime;
            total += angle;
        }

        subValue = total - (Math.PI/2);
        // 小圆点
        var x = 200 + Math.cos(subValue) * 90,  // 100
            y = 200 + Math.sin(subValue) * 90;   // 0

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.arc(x, y, 8, -0.5 * Math.PI, Math.PI * 1.5, false);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, .4)";
        ctx.arc(x, y, 10, -0.5 * Math.PI, Math.PI * 1.5, false);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, .2)";
        ctx.arc(x, y, 12, -0.5 * Math.PI, Math.PI * 1.5, false);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255,1)";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.arc(200, 200, 90, -0.5 * Math.PI, ((-0.5+ 2 * percent) * Math.PI), false);
        ctx.stroke();
}

$(function(){
    setInterval(function(){
        dragGraphic();
    },1000)
});