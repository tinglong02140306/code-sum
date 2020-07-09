$(function() {
	$('.circle').each(function(index, el) {
		var num = $(this).find('span').text() * 3.6;
		if (num <= 180) {
			$(this).find('.right').css('transform', "rotate(" + num + "deg)");
		} else {
			$(this).addClass("circle-red");
			$(this).find('.right').css('transform', "rotate(180deg)");
			$(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
		};
	});


	function dragGraphic() {
		var ctx = document.createElement("canvas").getContext("2d");
		ctx.canvas.width = 200;
		ctx.canvas.height = 4200;
		ctx.fillStyle = "#ffffff";
		ctx.strokeStyle = "#e2e5e9";
		ctx.fillRect(0, 0, 200, 4200);

		for (var i = 0; i < 2; i++) {
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.lineCap = "round";
			ctx.arc(100, 200 * i + 100, 90, -1.25 * Math.PI, 0.25 * Math.PI, false);
			ctx.stroke()
		}

		ctx.globalCompositeOperation = "destination-out";

		for (var i = 0; i < 2; i++) {
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.arc(100, 200 * i + 100, 90, -1.25 * Math.PI, (-1.25 + 1.5 * (i * 0.05)) * Math.PI, false);
			ctx.stroke()
		}
		return ctx.canvas.toDataURL("image/png")
	}
	document.body.innerHTML = '<img src="' + dragGraphic() + '">';
})