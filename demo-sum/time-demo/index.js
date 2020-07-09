var totaltime = 12,
    eventHandle = {
        // 倒计时
        countDown: function() {
            var minutes,
                seconds,
                minute,
                second;
            if (totaltime > 0) {
                minutes = Math.floor(totaltime / 60);
                seconds = Math.floor(totaltime % 60);
                minute = (minutes < 10) ? '0' + minutes : minutes;
                second = (seconds < 10) ? '0' + seconds : seconds;
                msg = minute + ":" + second;
                totaltime--;
            }else if(totaltime == 0) {

            }
            $('.content').text(totaltime);
        },
        // 时间计时 1s一次
        timerStart: function() {
            setInterval(function() {
                eventHandle.countDown();
            }, 1000);
        }
    };
(function() {
    $('.content').text(12);
    eventHandle.timerStart()
})();