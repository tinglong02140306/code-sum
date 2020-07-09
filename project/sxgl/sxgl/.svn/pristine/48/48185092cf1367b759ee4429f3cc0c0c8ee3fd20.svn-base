/*
 * @Author: meishen
 * @Date: 2018-08-23
 * @Description: 搜索框
 */
<template>
    <div class="search-wrap ma">
        <div class="search-box overhide">
            <input class="search-input fl h1 bgcf" type="text" placeholder="请搜索您想找的服务..." maxlength="40" v-model="tempInput">
            <i class="speak fl h1 cursor-p" @click="speakShow"></i>
            <a class="search-btn fl h1 tc cf" href="javascript:void(0)" @click="search">搜索</a>
            <a class="ask-enter fr h1 tc" href="javascript:void(0)" @click="openbox"></a>
        </div>

        <!-- 热词 -->
        <ul id="isHaveHot" class="hot-search overhide cf" :class="{hide: isHaveHot}">
            <li class="fl">热搜：</li>
            <li class="fl cursor-p" @click="hotSearch" v-for="search in searchList">{{ search }}</li>
        </ul>

        <!-- 弹出框 -->
        <el-dialog title="语音搜索" :visible.sync="dialogVisible" width="100%" :close-on-click-modal="false" :before-close="handleClose">
            <p class="speak-tip tc ma">{{ speakTip }}<span class="c0095ea" @click="pageJump">{{ speakTipCont1 }}</span><span class="c0095ea">{{ speakTipCont2 }}</span></p>
            <div class="speaking-content overhide">
                <canvas id="canvas1" class="fl canvas1" width="112" height="60"></canvas>
                <a id="speakBtn" class="speak-btn fl" href="javascript:void(0)" :class="{speaking: speaking}" @click="speak"></a>
                <canvas id="canvas2" class="fl canvas2" width="140" height="60"></canvas>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
    import lats from "@/utils/lat.js";
    export default {
        name: "Search",
        props: ['isHaveHot'],
        data: function() {
            return {
                tempInput: '',
                searchList: ['我要生二宝', '生小孩', '生育登记', '我要开酒店'],

                // 语音
                dialogVisible: false,
                speaking: false,
                mic_pressed: false,
                session: {},
                speakTip: '请说出关键字进行搜索，如：',
                speakTipCont: '生小孩、开酒店',
                speakTipCont1: '生小孩、',
                speakTipCont2: '开酒店',
                ctx1: {},
                ctx2: {}
            }
        },

        methods: {
            // 智能问答
            openbox: function(){
               this.$emit('parentOpen');
            },
            pageJump: function() {
                this.$router.push({path:'/intelligentSearch/searchIndex',query:{name: '生小孩'}})
            },
            // 点击搜索
            search: function() {
                var that = this,
                    keyWords = "生小孩,生二孩,生二宝,我要生小孩,我要生二宝,我要生二孩";

                if (!that.tempInput) {
                    return;
                };
                if (keyWords.indexOf(that.tempInput) > -1) {
                    that.$router.push({path:'/intelligentSearch/searchIndex',query:{name: that.tempInput}})
                }
                if (that.tempInput === '开酒店') {
                    that.$router.push('/intelligentAccept/accept')
                }
            },

            // 点击热词
            hotSearch: function(e) {
                this.tempInput = $(e.target).text();
            },

            // 语音弹框
            speakShow: function() {
                var that = this;
                that.dialogVisible = true;
                var tmpl = setInterval(function() {
                    var speakBtn = $('#speakBtn');
                    if (speakBtn[0]) {
                        clearInterval(tmpl);
                        that.init();
                        that.speak();
                    }
                }, 1);
            },

            // 语音弹框关闭
            handleClose: function() {
                var that = this;
                if (that.speaking) {
                    that.mic_pressed = false;
                    that.speaking = false;
                    that.ctx1.clearRect(0, 0, 110, 60);
                    that.ctx2.clearRect(0, 0, 110, 60);
                }
                that.session.kill();
                that.dialogVisible = false;
                that.speakTip = '请说出关键字进行搜索，如：';
                that.speakTipCont = '生小孩、开酒店';
                that.search();
            },

            // 语音
            speak: function(e) {
                var that = this;
                if (that.speaking) {
                    that.mic_pressed = false;
                    that.speaking = false;
                    that.session.stop();
                    that.ctx1.clearRect(0, 0, 110, 60);
                    that.ctx2.clearRect(0, 0, 110, 60);
                    return;
                }
                if (!that.mic_pressed) {
                    var ssb_param = {
                        "grammar_list": null,
                        "params": "appid=58d0c38c,appidkey=f01289d27d17254b, lang=sms, acous=anhui, aue=speex-wb;-1, usr=mkchen, ssm=1, sub=iat, net_type=wifi, rse=utf8, ent=sms16k, rst=plain, auf=audio/L16; rate=16000, vad_enable=1, vad_timeout=5000, vad_speech_tail=500, compress=igzip"
                    };

                    /* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
                    that.session.start(ssb_param);
                    that.mic_pressed = true;
                } else {
                    //停止麦克风录音，仍会返回已传录音的识别结果.
                    that.session.stop();
                }
            },

            // 语音init
            init: function() {
                var that = this,
                    canvas1 = $('#canvas1')[0],
                    canvas2 = $('#canvas2')[0],
                    ctx1 = (canvas1 && canvas1.getContext) ? canvas1.getContext('2d') : null,
                    ctx2 = (canvas2 && canvas2.getContext) ? canvas2.getContext('2d') : null;
                that.ctx1 = ctx1;
                that.ctx2 = ctx2;
                that.session = new lat({
                    "callback": {
                        "onResult": function(err, result) {
                            ctx1.clearRect(0, 0, 110, 60);
                            ctx2.clearRect(0, 0, 110, 60);
                            if (err == null || err == undefined || err == 0) {
                                if (result == '' || result == null) {
                                    that.speakTip = '抱歉，我没有听明白，请点击按钮重试';
                                    that.speakTipCont = '';
                                } else {
                                    if (result.lastIndexOf('。') == (result.length - 1)) {
                                        result = result.substr(0, result.length - 1);
                                    }
                                    that.tempInput = result;
                                    that.handleClose();
                                }
                            } else {
                                console.log('error code : ' + err + ", error description : " + result);
                            }
                            that.mic_pressed = false;
                            that.speaking = false;
                        },
                        "onVolume": function(volume) {
                            that.speaking = true;
                            that.speakTip = '请说出关键字进行搜索，如：';
                            that.speakTipCont = '生小孩、开酒店';
                            //清理画布
                            ctx1.clearRect(0, 0, 110, 60);
                            ctx2.clearRect(0, 0, 110, 60);
                            //定义一个渐变样式用于画图
                            var gradient1 = ctx1.createLinearGradient(0, 0, 0, 100);
                            gradient1.addColorStop(1, '#a9d9ff');
                            gradient1.addColorStop(0.5, '#a9d9ff');
                            gradient1.addColorStop(0, '#a9d9ff');
                            ctx1.fillStyle = gradient1;
                            var gradient2 = ctx2.createLinearGradient(0, 0, 0, 100);
                            gradient2.addColorStop(1, '#a9d9ff');
                            gradient2.addColorStop(0.5, '#a9d9ff');
                            gradient2.addColorStop(0, '#a9d9ff');
                            ctx2.fillStyle = gradient2;
                            //对信源数组进行抽样遍历，画出每个频谱条
                            for (var i = 0; i < 9; i++) {
                                var y = 0,
                                    h = 0;
                                if (i == 0) {
                                    y = 30;
                                    h = 5;
                                }
                                if (i == 1) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 2) {
                                    y = 26;
                                    h = 13;
                                }
                                if (i == 3) {
                                    y = 22;
                                    h = 21;
                                }
                                if (i == 4) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 5) {
                                    y = 18;
                                    h = 29;
                                }
                                if (i == 6) {
                                    y = 13;
                                    h = 39;
                                }
                                if (i == 7) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 8) {
                                    y = 19;
                                    h = 27;
                                }
                                y = (y - volume > 0) ? (y - volume) : 0;
                                h = (h + 2 * volume > 60) ? 60 : (h + 2 * volume);
                                ctx1.fillRect((i * 12) /*频谱条的宽度+条间距*/ , y,
                                    6, h);
                            }
                            for (var i = 0; i < 9; i++) {
                                var y = 0,
                                    h = 0;
                                if (i == 8) {
                                    y = 30;
                                    h = 5;
                                }
                                if (i == 7) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 6) {
                                    y = 26;
                                    h = 13;
                                }
                                if (i == 5) {
                                    y = 22;
                                    h = 21;
                                }
                                if (i == 4) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 3) {
                                    y = 18;
                                    h = 29;
                                }
                                if (i == 2) {
                                    y = 13;
                                    h = 39;
                                }
                                if (i == 1) {
                                    y = 28;
                                    h = 9;
                                }
                                if (i == 0) {
                                    y = 19;
                                    h = 27;
                                }
                                y = (y - volume > 0) ? (y - volume) : 0;
                                h = (h + 2 * volume > 60) ? 60 : (h + 2 * volume);
                                ctx2.fillRect((i * 12) /*频谱条的宽度+条间距*/ , y,
                                    6, h);
                            }

                        },
                        "onError": function() {
                            that.mic_pressed = false;
                            that.speaking = false;
                        },
                        "onProcess": function(status) {}
                    }
                });

                //页面不可见，断开麦克风调用
                document.addEventListener && document.addEventListener("visibilitychange", function() {
                    if (document.hidden == true) {
                        that.session.kill();
                    }
                });

                if (!that.session.isSupport()) {
                    $('.lat-content').addClass('hide');
                    return;
                }
            }
        }
    }
</script>
<style>
    @import "../../styles/home/search.css"
</style>