
;(function() {
	const ChimeePlayer = window.ChimeePlayer;

	/*var aggdPlugin = ChimeePlayer.popupFactory({
		name: 'time-ad',
		className: 'time-ad',
		title: false,
		// body: '<em>广告示例</em><a href="https://jia.360.cn" target="_blank"><img src="https://p.ssl.qhimg.com/t018fe4570caeb23e44.png"></a>',
		offset: '0px 10px auto auto',
		operable: false,
		plugin: [{
			name: chimeePluginControlbar,
			children: {
				play: {
					icon: {
						play: './icon/play.svg',
						pause: './icon/pause.svg'
					},
					width: '29px',
					height: '29px'
				},
				progressTime: true,
				progressBar: {
					layout: 'one-line'
				},
				volume: false,
				clarity: {
		
				},
				screen: {
					icon: {
						small: './img/icon-unfull.png',
						full: './img/icon-full.png'
					}
				}
			}
		}],
	});
*/
/*	const Chimee = window.Chimee;
	const plugin = {
		// 插件名为 controller
		name: chimeePluginControlbar,
		// 插件实体为按钮
		el: '<button>play</button>',
		data: {
			text: 'play',
		},
	};
	Chimee.install(plugin);*/


	ChimeePlayer.install(chimeePluginControlbar);

	var player = new ChimeePlayer({
		wrapper: '.chimee-container',
		src: 'http://cdn.toxicjohann.com/lostStar.mp4',
		isLive: false,
		box: 'native',
		autoplay: false,
		controls: true,
		// plugin: [aggdPlugin.name],
		plugin: [{
			name: chimeePluginControlbar.name,
			children: {
				play: {
					icon: {
						play: './icon/play.svg',
						pause: './icon/pause.svg'
					},
					width: '29px',
					height: '29px'
				},
				progressTime: true,
				progressBar: {
					layout: 'one-line'
				},
				volume: false,
				clarity: {
		
				},
				screen: {
					icon: {
						small: './img/icon-unfull.png',
						full: './img/icon-full.png'
					}
				}
			}
		}],
		// plugin: [aggdPlugin.name]
	});
})();