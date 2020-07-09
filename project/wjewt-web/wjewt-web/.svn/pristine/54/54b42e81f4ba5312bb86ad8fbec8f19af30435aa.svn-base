$(function(){
	fly.template.config('escape', true);
    // 页面初始化时创建页面
    var main = {},
        RADIUS, //初时圆的半径
        PHONEURL, //用户的图像
        FLAG = true, //判断是否说话
        ADDRADIUS = 5, //每次圆增加的半径的大小
        TIME = 400, //圆变大的频率
        canvas = document.getElementById('myCanvas'), // canvas对象
        line = document.getElementsByClassName('line')[0], // 声线dom对象
        distinguishVoice = document.getElementsByClassName('distinguish-voice')[0],
        voice = document.getElementsByClassName('voice')[0], // 开始说话声音dom对象
        tip = document.getElementsByClassName('tip')[0], // 提示信息dom对象
        footer = document.getElementsByTagName('footer')[0], // 底部dom对象
        ctx = canvas.getContext("2d"), // 绘画对象
        OS = util.phoneOs(), // 终端类型
        curves = [],
        flag = true,
        vm = window.vm = fly({
            // 关于我们信息数据源
            listData: fly.dataSource({
                data: []
            }),

            circle: { //圆
                x: 0,
                y: 0,
                r: 0
            },
            /**
             * 返回按钮点击事件
             */
            back: function() {
                FLAG = false;
                if(util.checkMobilePlatform()) {
                	croods.pageClose({});
                } else {
                	window.history.back(-1);
                }

            },
            /**
             * 开始说话按钮点击事件
             */
            startVoice: function(e) {
                e.currentTarget.classList.add('hide');
                canvas.classList.remove('hide');
                if(util.checkMobilePlatform()) {
            		croods.customPlugin({
                        action: 'IntelligentSpeechPlugin.getVoice',
                        //必填,PluginName为插件名、ActionName为插件内方法
                        params: {},
                        //可选,插件需请求参数
                        success: function() {} //请求成功回调
                    });
                    FLAG = true;
            	}
                if(flag) {
                	main.requestMessage.initWane();
                	flag = false; 
                }
            },
            /**
             * 问题点击事件
             */
            questionClick: function(e) {
                var parms = {
                    id: e.currentTarget.dataset.questionsid,
                    question: e.currentTarget.dataset.questionstd
                };

                voiceGet(parms);
            },
            /**
             * 底部声音图标点击事件
             * @param e
             */
            voiceClick: function(e) {
            	e.stopPropagation();
            	var $this = $('.voice-btn');
            	if($this.hasClass('select')) {
            		$('#container-ios9').addClass('hide');
            		$this.removeClass('select');
            	} else {
            		$this.addClass('select');
            		$('#container-ios9').removeClass('hide');
            	}
            	vm.scrollEvent();
            },
            /**
             * 发送按钮点击事件
             */
            sendEvent: function(e) {
            	e.stopPropagation();
            	var key = $('.footer-input').val();
            	if(key) {
            		/*if(OS == 'IOS') {
            			$('.footer-input').blur();
            		} else {
            			$('.footer-input').focus();
            		}*/
            		$('.footer-input').focus();
            		$('.footer-input').val('');
					$('.send-btn').removeClass('hover');
            		$('#container-ios9').addClass('hide');
            		$('section').css('bottom', '2.5rem');
            		$('.voice-btn').removeClass('select');
            		FLAG = false;
            		tip.classList.add('hide');
            		voice.classList.remove('hide');
            		var questionData = [{
                        'status': 0,
                        'cont': key,
                        'icon': PHONEURL || CONTEXTPATH + '/resource/h5/images/common/icon-person.png',
                        'question': {
                        	question: key,
                            id: ""
                        }
                    }];
                    main.requestMessage.requestData('addData', questionData);
            	}
            },
            /**
             * 滚动自适应事件
             */
            scrollEvent: function() {
            	$('section').css({
            		bottom: $('#container-ios9').hasClass('hide') ? '2.5rem' : '9.72rem'
            	});
            	$('.question:last')[0] && $('.question:last')[0].scrollIntoView();
            }
        });
    //获取回掉的语音
    window.voiceGet = function(res) {
        canvas.classList.add('hide');
        distinguishVoice.classList.add('hide');
        tip.classList.add('hide');
        voice.classList.remove('hide');
        main.requestMessage.draw();
        FLAG = false;
        if (!res.question) {
            res = {
                question: res,
                id: ""
            }
        }
        var questionData = [{
            'status': 0,
            'cont': res.question,
            'icon': PHONEURL || CONTEXTPATH + '/resource/h5/images/common/icon-person.png',
            'question': res
        }];
        main.requestMessage.requestData('addData', questionData);
    };

    //错误的语音
    window.voiceError = function(res) {
        distinguishVoice.classList.add('hide');
        tip.classList.add('hide');
        voice.classList.remove('hide');
        main.requestMessage.draw();
    };
    //结束说话
    window.stopVoice = function() {
        canvas.classList.add('hide');
        main.requestMessage.draw();
    };
    //识别语音
    window.distinguishVoice = function() {
        canvas.classList.add('hide');
        main.requestMessage.draw();
        line.classList.add('hide');
        distinguishVoice.classList.remove('hide');
    };
    //改变音频大小
    window.changeVoice = function(amplitude) {
        console.log(amplitude);
        main.requestMessage.draw(amplitude);
    };

    main.requestMessage = {
        /**
         * 获取用户的问题
         */
        requestData: function(status, data) {
            if (status === 'addData') {
                if (data && data.length) {
                    vm.listData.add(data[0]);
                    if (data[0].status === 0) { //问句
                        main.requestMessage.requestAnswerData(data[0].question);
                    }
                }
            } else {
                data = [{
                    'status': 1,
                    'content': '您好，我是智能客服，请问需要什么帮助吗？'
                }];
                vm.listData.data(data);
            }
            vm.scrollEvent();
        },
        /**
         * 获取用户的头像
         */
        requestUser: function() {
        	if(util.checkMobilePlatform()) {
        		croods.customPlugin({
                    action: 'UserPlugin.getUser',
                    params: {},
                    success: function(res) {
                        PHONEURL = res.photoUrl ? res.photoUrl : '';
                    }
                });
        	}
        },
        /**
         * 获取问题答案的数据
         */
        requestAnswerData: function(parms) {
        	fly.$.ajax({
				url: CONTEXTPATH + '/home/intelligentAssistant',
				data: {
                    id: parms.id,
                    question: parms.question,
                    type: 'APP'
                },
				dataType: 'json',
				type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
				cache: false,
				success: function(res) {
					var answerData = [],
	                    type, //0文本 ,1app, 2 h5zip,3html
	                    symbol, //符号
	                    REQUEST,
	                    jumpType;
					if (res && (res.status === 'TIMEOUT')) {
                        util.toast(res.message);
                    }
					if (res && res.data) {
                        res.data.status = 1;
                        if (res.data.moreResult && res.data.moreResult.length) {
                            res.data.content = '您是不是要问下面的问题呀？';
                            answerData.push(res.data);
                        } else {
                            if (res.data.content.length) {
                                type = res.data.content.substring(0, 1);
                                symbol = res.data.content.substring(1, 2);

                                if (type !== '0' && (symbol === ':' || symbol === '：')) {
                                    res.data.content = res.data.content.substring(2, res.data.content.length);
                                    res.data.content = res.data.content.replace(/＂/g, '"');
                                    res.data.content = res.data.content.replace(/“/g, '"');
                                    res.data.content = res.data.content.replace(/”/g, '"');
                                    res.data.content = res.data.content.replace(/，/g, ',');
                                    REQUEST = util.packData({}, "", 1, false, res.data.content);
                                    croods.customPlugin({
                                        action: 'CIPRoutePlugin.action',
                                        params: REQUEST,
                                        success: function(res) {}
                                    });
                                } else {
                                    answerData.push(res.data);
                                }
                            } else {
                                res.data.content = '抱歉，暂未提供该信息';
                                answerData.push(res.data);
                            }
                        }

                    } else {
                        answerData = [{
                            'status': 1,
                            'content': '抱歉，暂未提供该信息'
                        }];
                    }
                    main.requestMessage.requestData('addData', answerData);
				},
				error: function(res) {
					util.toast('数据请求失败！');
				}
			});
        },
        /**
    	 * 初始化canvas
    	 */
        initWane: function() {
            var circleNum = 0,
                style = $('style:last').text(),
                end = style.indexOf('!'),
                fontSize = parseInt(style.substring(15,end - 2));
            canvas.width = footer.offsetWidth;
            canvas.height = footer.offsetHeight;
            circleNum = footer.offsetWidth * 0.8 /(0.6 * fontSize);
            for (var i = 0; i < circleNum; i++) {
                var circle = {};
                circle.r = 0.15 * fontSize;
                circle.x = 0.3 * fontSize;
                circle.y = footer.clientHeight / 2;
                curves.push(circle);
                circle.x = circle.x + 0.6 * fontSize * i;
            };
            main.requestMessage.draw();
        },
        /**
         * 绘制声纹
         */
        draw: function(voiceHeight) {
            var img = new Image();
                img.src = CONTEXTPATH + "/resource/h5/images/common/icon-line.png";
            ctx.lineWidth = 1;
            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(0, 0, footer.offsetWidth, footer.offsetHeight);
            for (var i = 0; i < curves.length ; i++) {
                var y = 0; 
                if(voiceHeight) {
                    
                    y = Math.random() * 10 + (voiceHeight / 4);
                  

                    if (i === parseInt(curves.length / 2)) {
                        y = voiceHeight;
                    };

                    if (i === parseInt(curves.length / 4)) {
                        y = voiceHeight - 10;
                    };

                    if (i === parseInt(curves.length / 4 * 3)) {
                        y = voiceHeight - 10;
                    };

                }
                var grd = ctx.createLinearGradient(curves[i].x + footer.offsetWidth * 0.1, curves[i].y - y / 2, curves[i].x + footer.offsetWidth * 0.1 + 2 * curves[i].r, curves[i].y + y / 2 );
                    grd.addColorStop("0", "#6868f6");
                    grd.addColorStop("0.5", "#7575f9");
                    grd.addColorStop("1", "#85a1fd");
                voiceHeight ? ctx.fillStyle = grd : ctx.fillStyle = "#2581cf";
               
                ctx.beginPath();
                 voiceHeight ? ctx.drawImage(img,curves[i].x + footer.offsetWidth * 0.1,curves[i].y - y / 2, curves[i].r * 2,y):
                ctx.arc(curves[i].x + footer.offsetWidth * 0.1,curves[i].y,curves[i].r,0,2*Math.PI);
                ctx.fill();
                ctx.closePath();
            };
        }
    };
    /**
     * 事件绑定
     */
    main.bindEvent = function() {
    	$("input").focus(function(){//在这里‘input.inputframe’是我的底部输入栏的输入框，当它获取焦点时触发事件
        	if(!$('#container-ios9').hasClass('hide')) {
        		$('#container-ios9').addClass('hide');
        		$('section').css('bottom', '2.5rem');
        		$('.voice-btn').removeClass('select');
        	}
        	/*if(OS == 'IOS') {
    			setTimeout(function() {
    				$('.footer-content')[0].scrollIntoView();
    			}, 500);
    		}*/
        }).blur(function(){//设定输入框失去焦点时的事件
        	
        }).on('input', function() {
        	var key = $(this).val();
        	if(key) {
        		$('.send-btn').addClass('hover');
        	} else {
        		$('.send-btn').removeClass('hover');
        	}
        	
        });
        $('body').on('touchstart', function() {
        	$('.footer-input').blur();
        	if(!$('#container-ios9').hasClass('hide')) {
        		$('#container-ios9').addClass('hide');
        		$('.voice-btn').removeClass('select');
        		vm.scrollEvent();
        	}
        });
        $('.footer-content').on('touchstart', function(event) {
        	event.stopPropagation();
        });
        $('body').on('click', '.assistant a.link', function() {
        	var that = $(this),
        		content = that.find('i').text();
        	content = content.replace(/＂/g, '"');
            content = content.replace(/“/g, '"');
            content = content.replace(/”/g, '"');
            content = content.replace(/，/g, ',');
            REQUEST = util.packData({}, "", 1, false, content);
            window.content = content;
            croods.customPlugin({
                action: 'CIPRoutePlugin.action',
                params: REQUEST,
                success: function(res) {}
            });
        });
    };
    fly.bind(document.body, vm);
    $(function() {
    	main.requestMessage.requestData('init');
        main.requestMessage.requestUser();
        main.bindEvent();
    });
});