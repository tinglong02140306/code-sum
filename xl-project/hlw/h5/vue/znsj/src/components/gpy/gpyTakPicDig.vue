/*
 * @Author: tinglong
 * @Date: 2019-01-10
 * @Description: 高拍仪拍照功能弹框
 */
<template>
    <!-- 高拍仪弹框 -->
    <div class="gpy-wrap" :class="takePicActive ? '': 'hide'">
        <div class="gpy-wrapper" :style="{'margin-left': takeMrl}"> 
            <div class="header">
                <span class="title">高拍仪</span>
                <span class="icon-close" @click="takePicSelCancel">×</span>
            </div>
            <div class="content">
                <div class="preview-pic-wrap">
                    <div id="view" class="view-area"></div>
                    <div class="oper-step">
                        <!-- 汉王 0是前置 1是后置 -->
                        <a class="switch" href="javascript:;" title="切换摄像头" @click="switchDirEvt">切换摄像头</a>
                        <a class="zoomout" href="javascript:;" title="放大" @click="zoomOutEvt" v-show="gpyConfigInfo != 'hanwangE1190PRO'">放大</a>
                        <a class="zoomin" href="javascript:;" title="缩小" @click="zoomInEvt" v-show="gpyConfigInfo != 'hanwangE1190PRO'">缩小</a>
                        <a id="paizhao" class="take" href="javascript:;" title="拍照" @click="startTakePicEvt">拍照</a>
                    </div>
                </div>
                <div class="pic-control">
                    <a href="javascript:;" id="start-preview" class="photo-btn" @click="startPreEvt"> <i class="start"></i>开始预览</a>
                    <a href="javascript:;" id="stop-preview" class="photo-btn"  @click="stopPreEvt"> <i class="stop"></i>停止预览</a>
                    <a href="javascript:;" id="dev-property" class="photo-btn"  @click="viewEquipEvt">设备属性</a>
                    <div class="down-wrap"  v-show="gpyConfigInfo != 'hanwangE1190PRO'">
                        <label class="font-min">扫描尺寸</label>
                        <div class="down-content">
                            <el-select v-model="selScanSizeVal" size="mini" @change="selScanSizeChange">
                                <el-option v-for="item in selScanSizeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="adv-wrap" v-show="advanSelState">
                        <div class="down-wrap" v-show="gpyConfigInfo != 'hanwangE1190PRO'">
                            <label class="font-min">旋转角度</label>
                            <div class="down-content">
                                <el-select v-model="selRotateVal" size="mini" @change="selRotateChange">
                                    <el-option v-for="item in selRotateData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="down-wrap">
                            <label class="font-min">分辨率</label>
                            <div class="down-content">
                                <el-select v-model="selResVal" size="mini"  @change="selReshange">
                                    <el-option v-for="item in selResData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="down-wrap">
                            <label class="font-min">颜色设置</label>
                            <div class="down-content">
                                <el-select v-model="selColorVal" size="mini" @change="selColorChange">
                                    <el-option v-for="item in selColorData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="inline-block" v-show="gpyConfigInfo != 'hanwangE1190PRO'"><el-checkbox label="纠偏裁边" v-model="clipCkecked" @change="clipChange"></el-checkbox></div>
                        <div class="inline-block" v-show="gpyConfigInfo != 'hanwangE1190PRO'"><el-checkbox label="去底色" v-model="delCoCkecked" @change="delCoChange"></el-checkbox></div>
                    </div>
                    <div id="advanced" class="photo-advanced"  @click="advanSelState = !advanSelState">
                        高级功能
                        <i></i>
                    </div>
                </div>
                <div class="show-pic" >
                    <div class="pic-list" v-if="gpyPicList.length > 0" >
                        <img v-for="(item, index) in gpyPicList" :key="index" :class="item.selected == '1' ? 'selected' : ''" :src="item.path" alt="" :data-path="item.path" :data-name="item.name" :data-base64="item.base64" @click="selPicEvent(index)">
                    </div>
                </div>
            </div>
            <div class="footer">
                <el-button size="mini" type="primary" @click="takePicSelOk">确 定</el-button>
                <el-button size="mini" @click="takePicSelCancel">取 消</el-button> 
            </div>
        </div>
    </div>
</template>
<script>
import unit from "@/api";
import hspDevice from '@/utils/hspDevice.js';
export default {
    data() {
        return {
            takeMrl: (screen.availWidth/2 - 380) + 'px',
            advanSelState: false,
        }
    },
    computed: {
        gpyConfigInfo: {
            get() {
                return this.$store.state.gpyConfigInfo;
            },
            set: function () {
            }
        },
        // 高拍仪 拍照弹框标志位
        takePicActive: {
            get() {
                return this.$store.state.takePicActive;
            },
            set: function () {
            }
        },
        // 纠偏裁边
        clipCkecked: {
            get() {
                return this.$store.state.clipCkecked;
            },
            set: function () {
            }
        },
        // 去底色
        delCoCkecked: {
            get() {
                return this.$store.state.delCoCkecked;
            },
            set: function () {
            }
        },
        // 高拍仪 拍照图片
        gpyPicList: {
            get() {
                return this.$store.state.gpyPicList;
            },
            set: function () {
            }
        },
        // 扫描尺寸
        selScanSizeVal: {
            get() {
                return this.$store.state.selScanSizeVal;
            },
            set: function () {
            }
        },
        // 旋转角度
        selRotateVal: {
            get() {
                return this.$store.state.selRotateVal;
            },
            set: function () {
            }
        },
        // 分辨率
        selResVal: {
            get() {
                return this.$store.state.selResVal;
            },
            set: function () {
            }
        },
        // 颜色设置
        selColorVal: {
            get() {
                return this.$store.state.selColorVal;
            },
            set: function () {
            }
        },
        selScanSizeData: {
            get() {
                return this.$store.state.selScanSizeData;
            },
            set: function () {
            }
        },
        selRotateData: {
            get() {
                return this.$store.state.selRotateData;
            },
            set: function () {
            }
        },
        selResData: {
            get() {
                return this.$store.state.selResData;
            },
            set: function () {
            }
        },
        selColorData: {
            get() {
                return this.$store.state.selColorData;
            },
            set: function () {
            }
        },
        // 汉王 0是前置 1是后置
        switchState: {
            get() {
                return this.$store.state.switchState;
            },
            set: function () {
            }
        }
    },
    methods: {
        /*
        * 初始化驱动
        */
        initTakePicDriver() {
            let that = this,
                stateObj = that.$store.state,
                key = stateObj.gpyConfigInfo;
                // /bog-receive-web
                hspDevice('/bog-receive-web/static/gpyUtil/'+ key + '.js', function () {
                // 获取驱动模块
                let devDrive = hspDeviceList[key],
                    // 驱动实例化
                    dev = devDrive({
                        viewfinder: {
                            mount: 'view', // 父容器 ID
                            id: 'iVideo2', // Element ID
                            width: 555,
                            height: 355
                        }
                    });
                // 在初始化之前可以检测驱动能力，可以借机定制UI
                // 驱动初始化
                dev.init(); 
                setTimeout(() => {
                    // that.$store.commit('setState', {
                    //     takePicActive: true
                    // });
                    // // 默认开启摄像头
                    that.startPreEvt();
                    that.$store.commit('setState', {
                        startPreEvt: that.startPreEvt
                    });
                    if(that.gpyConfigInfo != 'hanwangE1190PRO') {
                        let inter = setInterval(function() {
                            if(dev.startPreview()) {
                                clearInterval(inter);
                                // 初始化扫描尺寸数据
                                that.getSelScanSizeData(dev);
                                // 初始化 旋转角度数据
                                that.getSelRotateData(dev);
                                // 初始化分辨率数据
                                that.getSelResData(dev);
                                // 初始化 颜色
                                that.getSelColorData(dev);
                            }
                        }, 200);
                    }
                },200);
                that.$store.commit('setState', {
                    dev: dev
                }); 
                // localStorage.dev = dev;            
            });
        },

        /**
         * 获取扫描尺寸数据
         */
        getSelScanSizeData(dev) {
            let that = this,
                data = [];
            for (let i = 0, count = dev.scanSizeCount(); i < count; i++) {
                let s = dev.scanSizeName(i);
                data.push({
                    label: s,
                    value: i
                });
            }
            data.push({
                label: '自定义',
                value: data.length
            });
            that.$store.commit('setState', {
                selScanSizeData: data
            });
            that.$store.commit('setState', {
                selScanSizeVal: data.length > 0 ? data[0].value : ''
            });
        },
        /**
         * 扫描尺寸change
         */
        selScanSizeChange(val) {
            let that = this;
            that.$store.commit('setState', {
                selScanSizeVal: val
            });
            // localStorage.selScanSizeVal = val;
            that.$store.state.dev.scanSize(val);
        },
        /**
         * 获取旋转角度
         */
        getSelRotateData(dev) {
            let that = this,
                data = dev.getSelRotateData();
            that.$store.commit('setState', {
                selRotateData: data
            });
            that.$store.commit('setState', {
                selRotateVal: data.length > 0 ? data[0].value : ''
            });
        },
        /**
         * 旋转角度 change
         */
        selRotateChange(val) {
            let that = this;
            that.$store.commit('setState', {
                selRotateVal: val
            });
            // localStorage.selRotateVal = val;
            that.$store.state.dev.videoRotate(val);
        },
        /**
         * 获取分辨率
         */
        getSelResData(dev) {
            let that = this,
                data = dev.getSelResData(that.switchState);
            that.$store.commit('setState', {
                selResData: data
            });
            that.$store.commit('setState', {
                selResVal: data.length > 0 ? data[0].value : ''
            });
        },
        /**
         * 分辨率 change
         */
        selReshange(val) {
            let that = this,
                dev = that.$store.state.dev;
            that.$store.commit('setState', {
                selResVal: val
            });
            // localStorage.selResVal = val;
            dev.resolution(val, that.switchState);  // resolution
        },
        /**
         * 获取颜色设置值
         */
        getSelColorData(dev) {
            var that = this,
                dev = that.$store.state.dev,
                data = [];
            data = [{
                label: '彩色',
                value: '0'
            }, {
                label: '灰度',
                value: '1'
            }]
            if(that.gpyConfigInfo != 'hanwangE1190PRO') {
                data.push({
                    label: '黑白',
                    value: '2'
                });
            }
            that.$store.commit('setState', {
                selColorData: data
            });
            that.$store.commit('setState', {
                selColorVal: data.length > 0 ? data[0].value : ''
            });
        },
        /**
         * 颜色设置 change
         */
        selColorChange(val) {
            let that = this,
                dev = that.$store.state.dev;
            that.$store.commit('setState', {
                selColorVal: val
            });
            // localStorage.selColorVal = val;
            dev.videoColor(val,that.switchState);
        },
        /*
        * 高拍仪 拍照取消事件
        */
        takePicSelCancel() {
            let that = this,
            stateObj = that.$store.state;
            that.$store.commit('setState', {
                takePicActive: false
            });
            // 清除定时
            if(stateObj.gpyInter) {
                clearInterval(stateObj.gpyInter);
            }
            that.resetGpyData();
        },
        /*
        * 高拍仪 选择图片
        */
        selPicEvent(index) {
            let that = this,
                stateObj = that.$store.state,
                data = that.gpyPicList,
                state = data[index].selected;

            data[index].selected = state == '0' ? '1' : '0';
            that.$store.commit('setState', {
                gpyPicList: data
            });
        },
        /*
        * 高拍仪 拍照确定事件
        */
        takePicSelOk() {
            let that = this,
                stateObj = that.$store.state,
                selectedData = [],
                data = [];
            if(stateObj.gpyPicList.length > 0) {
                data = stateObj.gpyPicList;
                for(let i = 0; i < data.length; i++) {
                    if(data[i].selected == '1') {
                        selectedData.push({
                            data: data[i].base64.replace(/[\r\n]/g,""),
                            fileName: data[i].name,
                            isPreView: '1'  // 可预览
                        });
                    }
                }
                that.$store.commit('setState', {
                    gpySelPicList: selectedData
                });
                that.$store.commit('setState', {
                    gpyPicList: data
                });
            }
            if(that.$store.state.gpySelPicList.length > 0) {
                that.$store.commit('setState', {
                    gpyUploadFlag: true
                });
                that.$store.commit('setState', {
                    takePicActive: false
                });
            }else {
                that.$Message.warning('请选择要上传的照片！');
            }
        },
        /*
        * 切换摄像头
        */
        switchDirEvt() {
            let that = this,
                stateObj = that.$store.state,
                state;
            if(stateObj.gpyConfigInfo == 'hanwangE1190PRO') {
                state = stateObj.switchState == 0 ? 1 : 0;
                that.$store.commit('setState', {
                    switchState: state
                });
                that.$store.state.dev.toggleDev(that.switchState);
            }else {
                that.$store.state.dev.toggleDev();
            }
        },
        /*
        * 放大
        */
        zoomOutEvt() {
            let that = this;
            that.$store.state.dev.zoomIn(); 
        },
        /*
        * 放大
        */
        zoomInEvt() {
            let that = this;
            that.$store.state.dev.zoomOut();
        },
        /*
        * 拍照
        */
        startTakePicEvt() {
            let that = this,
                stateObj = that.$store.state,
                result = stateObj.dev.takePicBase64(stateObj.switchState),
                data = [];
            if(result) {
                data = stateObj.gpyPicList;
                data.push({
                    name: result.fileName,
                    path: 'data:image/jpg;base64,' + result.base64,
                    base64: result.base64,
                    selected: '0'
                });
                that.$store.commit('setState', {
                    gpyPicList: data
                });
            }
        },
        /*
        * 开始预览
        */
        startPreEvt() {
            let that = this,
                stateObj = that.$store.state,
                dev = stateObj.dev;
            if(stateObj.gpyConfigInfo != 'hanwangE1190PRO') {
                dev.startPreview();
            }else {
                dev.startPreview(function() {
                    // 初始化扫描尺寸数据
                    // that.getSelScanSizeData(dev)
                    // 初始化分辨率数据
                    that.getSelResData(dev);
                    // 初始化 颜色
                    that.getSelColorData(dev);
                },stateObj.switchState);
            }
        },
        /*
        * 停止预览
        */
        stopPreEvt() {
            let that = this;
            that.$store.state.dev.stopPreview(that.switchState);
        },
        /*
        * 设备属性
        */
        viewEquipEvt() {
            let that = this;
            that.$store.state.dev.showDevInfoByDialog(that.switchState); 
        },
        /*
        * 纠偏裁边
        */
        clipChange(val) {
            let that = this,
                stateObj = that.$store.state;
            that.$store.commit('setState', {
                clipCkecked: val
            });
            // localStorage.clipCkecked = val;
            stateObj.dev.autoCrop(val);
        },
        /*
        * 去底色
        */
        delCoChange(val) {
            let that = this,
                stateObj = that.$store.state;
            that.$store.commit('setState', {
                delCoCkecked: val
            });
            // localStorage.delCoCkecked = val;
            stateObj.dev.DelBackColor(val);
        },
        /**
         * 重置 高拍仪参数数据
         */
        resetGpyData() {
            let that = this,
                stateObj = that.$store.state;
            // 初始化
            if(stateObj.gpyConfigInfo != 'hanwangE1190PRO') {
                // 纠偏裁边
                that.$store.commit('setState', {
                    clipCkecked: false
                });
                stateObj.dev.autoCrop(stateObj.clipCkecked);
                // localStorage.clipCkecked = false;

                // 去底色
                that.$store.commit('setState', {
                    delCoCkecked: false
                });
                 stateObj.dev.DelBackColor(stateObj.delCoCkecked);
                // localStorage.delCoCkecked = false;

                // 扫描尺寸
                that.$store.commit('setState', {
                    selScanSizeVal: stateObj.selScanSizeData.length > 0 ? stateObj.selScanSizeData[0].value : '0'
                });
                stateObj.dev.scanSize(stateObj.selScanSizeData.length > 0 ? stateObj.selScanSizeData[0].value : '0');
                // 设置旋转角度
                that.$store.commit('setState', {
                    selRotateVal: stateObj.selRotateData.length > 0 ? stateObj.selRotateData[0].value : ''
                });
                stateObj.dev.videoRotate(stateObj.selRotateData.length > 0 ? stateObj.selRotateData[0].value : '0');
            }
            
            // 分辨率
            that.$store.commit('setState', {
                selResVal: stateObj.selResData.length > 0 ? stateObj.selResData[0].value : '0'
            });
            stateObj.dev.resolution(stateObj.selResData.length > 0 ? stateObj.selResData[0].value : '0',that.switchState);
            // 颜色
            that.$store.commit('setState', {
                selColorVal: stateObj.selColorData.length > 0 ? stateObj.selColorData[0].value : '0'
            });
            stateObj.dev.videoColor(stateObj.selColorData.length > 0 ? stateObj.selColorData[0].value : '0', that.switchState);

            // 清除高拍仪图片资源缓存
            that.$store.commit('setState', {
                gpySelPicList: []
            });
            that.$store.commit('setState', {
                gpyPicList: []
            });
        }
    }
}
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
// 高拍仪弹框样式
.gpy-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: rgba(0,0,0,.4);
    z-index: 999;
    .gpy-wrapper {
        margin: 15px auto  265px;
        width: 770px;
        height: 660px;
        background: #fff;
        border-radius: 5px;
        .header {
            padding-left: 20px;
            width: 100%;
            height: 58px;
            font-size: 0;
            background: #fff;
            border-bottom: 1px solid #ddd;
            border-radius: 5px 5px 0 0;
            line-height: 58px;
            span {
                display: inline-block;
                height: 100%;
                font-size: 18px;
                color: #303133;
            }
            .title {
                width: 94%;
                text-align: left;
            }
            .icon-close {
                width: 6%;
                color: #909399;
                font-size: 25px;
                text-align: center;
                vertical-align: top;  
            }
        }
        .content {
            margin: 10px;
            .preview-pic-wrap {
                display: inline-block;
                width: 555px;
                height: 385px;
                // border: 1px solid #000;
                .view-area {
                    width: 100%;
                    height: 355px;
                    background: #f5f5f5;
                    border: none;
                }
                .oper-step {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    a {
                        display: inline-block;
                        margin: 0 3px;
                        height: 24px;
                        width: 65px;
                        color: #333;
                        background-color: #fff;
                        background: url(../../assets/images/common/photo-take.png) no-repeat;
                        background-repeat: no-repeat;
                        border: #A9A6A6 1px solid;
                        line-height: 24px;
                        text-indent: 30px;
                    }
                    a.switch {
                        background-position: 0px 0px;
                        width: 110px;
                    }
                    a.zoomout {
                        background-position: 0 -22px;
                    }
                    a.zoomin {
                        background-position: 0 -44px;                        
                    }
                    a.take {
                        background-image: none;
                        text-indent: 0;
                        text-align: center;
                    }
                }
            }
            .pic-control {
                display: inline-block;
                margin-left: 25px;
                width: 151px;
                height: 395px;
                vertical-align: top;
                .photo-btn {
                    display: block;
                    margin: 0 0 10px 0;
                    height: 38px;
                    border: 1px solid #ccc;
                    line-height: 38px;
                    text-align: center;
                    i {
                        display: inline-block;
                        margin-right: 5px;
                        width: 16px;
                        height: 38px;
                        vertical-align: top;
                    }
                    .start {
                        background: url(../../assets/images/common/photo-start.png) no-repeat;
                        background-position: center center;
                    }
                    .stop {
                        background: url(../../assets/images/common/photo-stop.png) no-repeat;
                        background-position: center center;
                    }
                }
                .el-checkbox+.el-checkbox {
                    padding-left: 0;
                }
                .hide {
                    display: none;
                }
                .photo-advanced {
                    margin-top: 5px;
                    text-align: center;
                    border: 1px solid #ddd;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                    i {
                        display: inline-block;
                        width: 16px;
                        height: 24px;
                        background: url(../../assets/images/common/photo-setting.png) no-repeat;
                        background-position: 0 4px;
                        vertical-align: top;
                    }
                    .close i {
                        background-position: 0 -12px;
                    }
                }
                .down-wrap {
                    margin-bottom: 10px;
                    label {
                        display: inline-block;
                        width: 58px;
                        text-align: right;
                    }
                    .down-content {
                        display:inline-block;
                        width: 87px;
                    }
                }  
            }
            .show-pic {
                width: 100%;
                height: 132px;
                border: 1px solid #000;
                // overflow-x: hidden;
                // overflow-y: auto;
                .pic-list {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    img {
                        display: inline-block;
                        margin: 0 4px 4px 0;
                        width: 100px;
                        height: 80px;
                        border: 2px solid #fff;
                    }
                    img.selected {
                        border-color:#2d8cf0;
                    }
                }
                
            }
        }
        .footer {
            padding-right: 30px;
            width: 100%;
            height: 50px;
            background: #fff;
            border-top: 1px solid #ddd;
            text-align: right;
            line-height: 50px;
            .el-button {
                width: 64px;
                height: 34px;
            }
        }
    }
} 
</style>