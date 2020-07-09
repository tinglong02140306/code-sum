$(function() {
	var marqueeInterval,
	    flag = true;
	function initMarquee() {
		var marqueeWrap = document.querySelector('div.marquee-wrap'),
			fragment = document.createDocumentFragment('div'),
			marqueeContentWrap = document.createElement('div'),
			marqueeContent = document.createElement('div'),
			marqueeContentCopy = document.createElement('div'),
			marqueeDetailContent = document.querySelector('div.wrap'),
			
			speed = 20,
			marqueeHandler;
			// marqueeInterval;
			innerhtml = '<img src="voice2.png" alt="">';

		marqueeContentWrap.className = 'marquee-content-wrap';
		marqueeContent.className = 'marquee-content';
		marqueeContentCopy.className = 'marquee-content-copy';
		marqueeContent.innerHTML = innerhtml;
		marqueeContentCopy.innerHTML = innerhtml;		

		marqueeContentWrap.appendChild(marqueeContent);
		marqueeContentWrap.appendChild(marqueeContentCopy);

		fragment.appendChild(marqueeContentWrap);

		marqueeWrap.innerHTML = '';
		marqueeWrap.appendChild(fragment);

		marqueeHandler = function() {

			if (marqueeContentCopy.offsetWidth - marqueeWrap.scrollLeft <= 0) {
				marqueeWrap.scrollLeft -= marqueeContentCopy.offsetWidth;
			} else {
				marqueeWrap.scrollLeft++;
			}
		};
		marqueeInterval = setInterval(marqueeHandler, speed);

		$('button').on('click', function() {
			if(marqueeInterval) {
				clearInterval(marqueeInterval);
			}/*else if(!flag) {
				marqueeInterval = setInterval(marqueeHandler, speed);
			}*/
		});
	};
	
	initMarquee();
});