/*var maxtime = 100,
    realtime = 0,
    percent = 0,  // 实时比例
    angle = 2*Math.PI/maxtime;
    total = 0,
    subValue = 0;*/

function dragGraphicstart(ctx) {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
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

        var grd = context.createRadialGradient(x1, y1, radius1, x2, y2, radius2);
        grd.addColorStop(0, 'red');
        grd.addColorStop(1, 'blue');
        context.fillStyle = grd;
        context.fill();  
            
        
        
        ctx.beginPath();
        grad.addColorStop(0,'#000');    // 黄  
      /*  grad.addColorStop(0.5,'#00f');  // 蓝  */
        grad.addColorStop(1,'#fff');    //青  
        /*ctx.strokeStyle = "rgba(255, 255, 255,1)";*/
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.arc(200, 200, 90, -0.5 * Math.PI, ((-0.5+ 2 * 0.8) * Math.PI), false);
        ctx.stroke();
}

$(function(){
    setInterval(function(){
        dragGraphic();
    },1000)
});