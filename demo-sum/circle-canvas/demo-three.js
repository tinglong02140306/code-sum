var WIDTH = 200;
var HEIGHT = 200;
var RADIUS = Math.PI * 2;

var NB_POINT = 900;
var ANGLE_STEP = 360 / NB_POINT;

/*var CENTER_X = 100;
var CENTER_Y = 100;*/

var r = 20; 
var y = 0;
var x = 0;
var angle = ANGLE_STEP;

var canvas = document.getElementById('workspace');
var ctx = canvas.getContext('2d');

canvas.height = 160;
canvas.width = 160;



function update() {
    render(10, 80, "rgba(241, 196, 15,1.0)");

    angle += ANGLE_STEP;
    if (angle > RADIUS) {
        angle = 0;
    }
    ctx.fillStyle = "rgba(44, 62, 80,0.1)";

    ctx.fillRect(0, 0, 200, 200);

    /*requestAnimationFrame(update);*/
}

function render(r, _r, color) {
    console.log(angle);
    x = r + _r * Math.cos(angle) + 80;
    y = r + _r * Math.sin(angle) + 80;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, RADIUS);
    ctx.fill();
    ctx.closePath();
}
setInterval(function(){
    update();
},1000)