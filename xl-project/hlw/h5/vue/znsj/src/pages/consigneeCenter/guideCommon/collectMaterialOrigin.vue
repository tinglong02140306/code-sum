/*
 * @Author: tinglong 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-10 15:22:32
 * @description 收材料
 */
<template>
	<div id="collectMaterial">
        <div class="collect-material-wrap">
            <!-- 导航面板 -->
            <div class="nav-wrap">
                <slideNav2 :step="step" :status="navStatus" v-if="pageParamObj.type == '3'"></slideNav2>
                <slideNav :step="step" :status="navStatus" v-else></slideNav>
            </div>
            <!-- 主要内容 -->
            <!-- 第一层区分单事项和多事项集合 -->
            <div class="wrap" v-for="(matter,pos) in matterList" :value="matter.value" :key="pos">
                <div class="content-box">
                    <div class="content">
                        <div class="head mt10">
                            <detailHead :titles="matter.matterName"></detailHead>
                            <!-- 复印件、原件复选框 -->
                            <div class="checkb-wrap">
                                <div v-if="matter.originFormNum">
                                    <i class="box-wrap" :class="matter.originSelectAll === '1' ? 'selected' : ''"  @click="CkeckAllEvt(pos, 'origin')"></i>
                                    <span class="num-text">批量收取原件</span>
                                </div>
                                <div v-if="matter.copyFormNum">
                                    <i class="box-wrap" :class="matter.copySelectAll ==='1' ? 'selected' : ''"  @click="CkeckAllEvt(pos, 'copy')"></i>
                                    <span class="num-text">批量收取复印件</span> 
                                </div>   
                            </div>   
                        </div>
                        <!-- 第二层  事项 如：事项A和事项B-->
                        <div class="item-List" v-for="(item,loc) in matter.matterList" :value="item.value" :key="loc">
                            <div class="item" :class="loc == matter.matterList && matter.matterList.length - 1 ? 'backg-none': ''" v-if="item.form">
                                <span class="state-head icon-no-need" v-if="item.isNeed == '0'">非必要</span>
                                <span class="state-head icon-need" v-if="item.isNeed == '1'">必要</span>
                                <span class="state-head icon-lack" v-if="item.isNeed == '2'">容缺</span>
                                <div class="item-content">
                                    <p>
                                        <span class="mark ell font-max" :title="item.matterialName" :class="item.originSelected === '1' || item.copySelected === '1' ||(item.elecUrlListLoc && item.elecUrlListLoc.length > 0) ? 'al-upload': ''"> {{item.matterialName}}</span>
                                        <i class="icon-dobut" v-if="item.contentTxt" :title="item.contentTxt"></i>
                                    </p>
                                    <!-- 原件、复印件统计 -->
                                    <p class="copy-ori-detail font-min">
                                        <span v-if="item.startOriginalNum && judgeForm('02', item.form)">原件{{item.startOriginalNum}}份</span>
                                        <span v-if="item.startOriginalNum && item.startCopiesNum && judgeForm('02', item.form) && judgeForm('03', item.form)">,</span>
                                        <span v-if="item.startCopiesNum && judgeForm('03', item.form)">复印件{{item.startCopiesNum}}份</span>
                                    </p>
                                    <!-- 操作项 -->
                                    <div class="oper-wrap font-min">
                                        <a href="javascript:;" class="btn origin-file" :class="{'origin-filed':item.originSelected === '1'}" v-if="judgeForm('02', item.form)" @click="fileCkeckEvt(pos,loc,'origin',item.originSelected)">收取原件</a>
                                        <a href="javascript:;" class="btn copy-file" :class="{'copy-filed':item.copySelected === '1'}" v-if="judgeForm('03', item.form)"  @click="fileCkeckEvt(pos,loc,'copy',item.copySelected)">收取复印件</a>
                                        <div class="file-oper" v-if="judgeForm('01', item.form)">
                                            <a href="javascript:;" class="icon-upload-flag" :class="{'has-pic-upload': item.elecUrlListLoc && item.elecUrlListLoc.length > 0}">上传电子件</a>
                                            <i class="ver-line"></i>
                                            <a href="javascript:;" class="btn pic-upload" @click="takePicEvt(pos,loc)">拍照上传</a>
                                            <a href="javascript:;" class="btn loc-upload" :class="'upload-btn-con' + pos + loc" @mouseover="uploadFileEvt(pos,loc)">本地上传</a>
                                            <!-- <span></span> -->
                                            <!-- v-if="judgeHasShareCirLib(item)" -->
                                            <a href="javascript:;" class="btn lib-cir-sel" @click="selFCerLibEvt(pos, loc,item.typeText,item.type)" v-if="item.isCirLibShow">从证照文库引用</a>
                                            <!--  -->
                                        </div>
                                        <div class="file-info-notice inline-block ml10 font-min" v-if="judgeForm('01', item.form)">
                                            <span>可上传{{item.fileType}}格式文件，不超过{{item.matterialSize}}M</span>
                                        </div>
                                    </div>
                                    <!-- 原件、复印件、上传照片展示的内容 -->
                                    <div class="upload-detail font-min">
                                        <!-- 原件 -->
                                        <div class="origin-files" v-if="judgeForm('02', item.form)" :class="item.originSelected == '1' ? '' : 'hide'">
                                            <label>原件</label>
                                            <span class="file-num">收取份数：{{item.originalNum}}份</span>
                                            <span class="file-opinion">意见：{{item.originView}}</span>
                                            <i @click="fileCancelEvt(pos,loc,'origin',item.originSelected)"></i>
                                        </div>
                                        <!-- 复印件 -->
                                            <!-- 01：电子 02：原件 03复印件 -->
                                        <div class="copy-files" v-if="judgeForm('03', item.form)" :class="item.copySelected == '1' ? '' : 'hide'">
                                            <label>复印件</label>
                                            <span class="file-num">收取份数：{{item.copiesNum}}份</span>
                                            <span class="file-opinion">意见：{{item.copiesView}}</span>
                                            <i @click="fileCancelEvt(pos,loc,'copy',item.copySelected)"></i>
                                        </div>

                                        <!-- 电子照 -->
                                        <div class="elec-photo elec-photo11" :class="item.elecUrlListLoc && item.elecUrlListLoc.length > 0 ? '' : 'hide'" v-if="judgeForm('01', item.form)">
                                            <label>电子件</label>
                                            <div class="file-list-wrap">
                                                <div class="file-list" v-for="(ele,index) in item.elecUrlListLoc" :value="ele.value" :key="index">
                                                    <a href="javascript:;">
                                                        <span class="file-name" :data-path="ele.path" :title="ele.name" @click="previewFileEvt">{{ele.name.length > 20 ? ele.name.substring(0,20) + '...' : ele.name}}</span>
                                                        <i :data-path="ele.path" @click="delFileEvt(pos,loc,index)"></i>
                                                    </a>
                                                    <p class="time-max">
                                                        <span class="pr10 time">{{ele.time}}</span>
                                                        <span>{{ele.size}}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 上传图片插件 -->
                            <div class="upload-wrap" v-if="judgeForm('01', item.form)">
                                <!-- 1M = 1024000 -->
                                <vue-upload-web ref="upload" :url="uploadObj.cdnUrl" :fileSingleSizeLimit="item.matterialSizeKB" :form-data="uploadObj.cdnParams" :key-generator="keyGenerator" :accept="item.fileTypes"
                                    @progress="uploadProgress" @success="uploadSuccess" @before="beforeUpload"
                                    @error="uploadError" @complete="handleComplete" :upload-button="'.upload-btn-con' + pos + loc" :multiple='true'>
                                </vue-upload-web>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <!-- 按钮部分 -->
            <div class="btn-wrap font-min">
                <i-button class="btn mr10 step" @click="preStepEvt">上一步</i-button>
                <i-button class="btn step4" type="primary" @click="sureAccFileEvt">确认收件</i-button>
            </div>
            <!-- 原件、复印件份数弹框部分 -->
            <el-dialog
                :title="accFileTitle"
                :visible.sync="setAccConActive"
                width="500px"
                >
                <div class="dialog-con-wrap">
                    <div class="row">
                        <label class="font-min">收件份数：</label>
                        <div class="input-wrap">
                            <span class="btn-reduce font-min" @click="reduceEvt">-</span>
                            <input class="num-copy font-min" type="text" v-model="numCopy" @blur="copyOriNumBlur">
                            <span class="btn-plus font-min" @click="plusEvt">+</span>
                        </div>
                    </div>
                    <div class="row">
                        <label class="font-min">意见：</label>
                        <Input v-model="opinion" type="textarea" :rows="4" :maxlength="50"/>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="oriCopyNumOk" size="small">确 定</el-button>
                    <el-button @click="oriCopyNumCancel" size="small">取 消</el-button>    
                </span>
            </el-dialog>
            <!-- 证照库选择弹框 -->
            <el-dialog
                :title="cerLibTitle"
                :visible.sync="photoDiaActive"
                width="760px"
                height="500px"
                custom-class="cir-lib-wrap"
                >
                <div class="dialog-photo-wrap">
                    <div class="item-list" v-if="cerLibList.length > 0">
                        <a href="javascript:;" v-for="(item, index) in cerLibList" :value="item" :key="index">
                            <p class="icon-check">
                                <i :class="item.selected === '1' ? 'selected' : ''" :data-path="item.filePath" @click="cerLibSelEvt(index)"></i>
                            </p>
                            <span class="pic-title font-min">图片</span>
                            <span class="pic-sub-title font-min">证照库</span>
                            <span class="file-name font-min">{{item.contentName}}</span>
                            <span class="date font-min">{{item.createTime}}</span>
                        </a>
                    </div>
                    <div class="empty-wrap"  v-if="cerLibList.length == 0">
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cerLibSelOk" size="small">确 定</el-button>
                    <el-button @click="cerLibSeCancel" size="small">取 消</el-button>
                </span>
            </el-dialog>
        </div>
	</div>   
</template>
<script>
import slideNav from "@/components/common/slideNav";
import slideNav2 from "@/components/common/slideNav2";
// 公共头部
import detailHead from "@/components/common/detailHead";  
// 公共工具方法  
import unit from "@/api";   
import vueUploadWeb from '@/components/upload/upload';
export default {
    components: {
        slideNav:slideNav,
        detailHead:detailHead,
        slideNav2:slideNav2,
        'vue-upload-web':vueUploadWeb,
    },
	data () {
        return {
            uploadObj: { // 文件上传参数
                cdnUrl: '/bog-receive-web/commer/upload',
                cdnParams: {flag: '1', isPreView: '1'},
                accept: {
                    // title: 'Images',  // 只允许图片文件
                    extensions: 'txt',
                    mimeTypes: 'text/provenance-notation'
                },
            },
            fileKeyVal: { // 文件mime和mimetype的对应关系
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                bmp: 'image/bmp',
                txt: 'text/plain',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                doc: 'application/msword',
                pdf: 'application/pdf',
                wps: '.wps'
            },
            curItemId: '',  // 当前被选项id
            
            buttonSize: 'small', // 按钮的尺寸
            step: 4, // 导航面板的状态
            navStatus: '1',
            upPicIndex: 0,  // 当前项的index值

            accFileTitle: '原件收取', // 弹框标题 
            numCopy: 1,
            opinion: '原件已核',
            setAccConActive: false,  // 收件份数 弹框显示标志位
            curfileType: 'origin',  // 判断当前点击的是原件还是复印件
            // 证照库选择弹框
            cerLibTitle: '证照库',  // 证件库名称 动态获取
            photoDiaActive: false,

            // 证件库数据
            cerLibList: [],
            // 总数据
            matterList: [],
            curPos: '',
            curLoc: '',
            curIndex: '',
            copyOriNumVaild: true,  // 复印件 原件 计数输入框内容验证通过标志位
            loading: '',  // 页面加载遮罩
            pageParamObj: {},// 传到下一页面的参数对象
            jointStatus: '',  // 当前事项未/已配置与运行系统 1：已 0：未
            state: '', // 个人:gr  法人：fr
            initDevFirFlag: false,
        }
    },
    methods: {
        /*
         * 高拍仪拍照点击事件
         */
        takePicEvt(pos,loc) {
            let that = this,
                stateObj = that.$store.state;
            if(unit.isIE()) {
                that.curPos = pos;
                that.curLoc = loc;
                tateObj.gpyInter = setInterval(() => {
                    if(stateObj.gpySelPicList.length > 0 && stateObj.gpyUploadFlag) {
                        that.takePicSelOk();
                        that.$store.commit('setState', {
                            gpyUploadFlag: false
                        });
                        clearInterval(tateObj.gpyInter);
                    }
                }, 1000);
                that.$store.commit('setState', {
                    takePicActive: true
                });
                that.handleInitDev();                
            }else {
                that.$Message.warning('您所使用的浏览器不支持拍照!');
                return;
            }
        },
       /*
         * 处理初始化高拍仪
         */
        handleInitDev() {
            let that = this,
                stateObj = that.$store.state;
            // 默认开启摄像头
            setTimeout(() => {
                // stateObj.dev.startPreview();
                stateObj.startPreEvt();
                if(stateObj.gpyConfigInfo == 'hanwangE1190PRO') { 
                    setTimeout(function() {
                        stateObj.startPreEvt();
                    }, 1000);
                }
            },300);
            that.resetGpyData();
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
                    selRotateVal: stateObj.selRotateData.length > 0 ? stateObj.selRotateData[0].value : '0'
                });
                stateObj.dev.videoRotate(stateObj.selRotateData.length > 0 ? stateObj.selRotateData[0].value : '0');
            }
            
            // 分辨率
            that.$store.commit('setState', {
                selResVal: stateObj.selResData.length > 0 ? stateObj.selResData[0].value : '0'
            });
            stateObj.dev.resolution(stateObj.selResData.length > 0 ? stateObj.selResData[0].value : '0');
            // 颜色
            that.$store.commit('setState', {
                selColorVal: stateObj.selColorData.length > 0 ? stateObj.selColorData[0].value : '0'
            });
            stateObj.dev.videoColor(stateObj.selColorData.length > 0 ? stateObj.selColorData[0].value : '0');

            // 清除高拍仪图片资源缓存
            that.$store.commit('setState', {
                gpySelPicList: []
            });
            that.$store.commit('setState', {
                gpyPicList: []
            });
        },
        /*
         * 拍照弹框 确认按钮
         */
        takePicSelOk() {
            let that = this,
                arr,
                pos = that.curPos,
                loc = that.curLoc,
                size,
                stateObj = that.$store.state;
            that.loadingFun();
            if(stateObj.gpySelPicList.length > 0) {
                unit.ajaxObjPost('/znsj-sj-web/commer/uploadbase64', JSON.stringify(stateObj.gpySelPicList), function (res) {
                    that.loading.close();
                    let data = res.data;
                    arr = that.matterList[pos].matterList[loc];
                    for(let i = 0; i < data.length; i++) {
                        // 转成KB
                        size = (data[i].size/1024).toFixed(1);  
                        size = size > 1000 ? (size/1024).toFixed(1) + 'MB': size + 'KB';
                        arr.elecUrlListLoc.push({
                            path: data[i].filePath,
                            name: data[i].fileName,
                            time: data[i].upLoadTime,
                            size: size
                        });
                        arr.elecUrlList.push({
                            path: data[i].filePath,
                            name: data[i].fileName,
                            time: data[i].upLoadTime,
                            size: size
                        });
                    }
                    that.resetGpyData();
                }, function (res) {
                    that.$Message.warning(res.erroMsg || '图片上传失败');
                }, that);
            }
            // 清空高拍仪图片信息
            that.$store.commit('setState', {
                gpySelPicList: []
            });
            that.$store.commit('setState', {
                gpyPicList: []
            });
            that.$store.commit('setState', {
                takePicActive: false
            });
        },
        /*
         * 判断材料的形式 type 1:原件 2：复印件 3：电子件
         */
        judgeForm(type,str) {
            let arr,
                flag = false;
            if(str) {
                    arr = str.split(','),
                    flag = false;
                for(let i in arr) {
                    if(type == arr[i]) {
                        flag = true;
                    }
                }
            }else {
                flag = false;
            }
            return flag;
        },
        /*
         * 原件、复印件复选框点击事件
         */
        fileCkeckEvt(pos,loc,type,state) {
            let that = this,
                selectAllObj =  that.matterList[pos], // 某一事项
                selectData = selectAllObj.matterList[loc], // 某一事项中的所有列表项
                ListArr = selectAllObj.matterList,
                curObj;
            if(state == '0') {
                // 显示弹框
                that.oriCopyModal(pos,loc,type);
            }else if(state == '1') {
                that.fileCancelEvt(pos,loc,type,state);
            }  
        },

        /**
         * 全选复选框联动处理
         */
        dealChecAllEvt(pos,loc,state, type) {
            let that = this,
                selectAllObj =  that.matterList[pos],  // 某材料
                ListArr = that.matterList[pos].matterList,
                curObj;
            if(type === 'origin') { 
                //  单项全部选中时 全选状态显示
                for(let i in ListArr) {
                    curObj = ListArr[i].originSelected;
                    if(!curObj) {
                        return
                    }
                    if(ListArr[i].originSelected === '0') {
                        return;
                    }
                }
                selectAllObj.originSelectAll = '1';
            }else if(type === 'copy') {  
                //  单项全部选中时 全选状态显示
                for(let i in ListArr) {
                    curObj = ListArr[i].copySelected;
                    if(!curObj) {
                        return
                    }
                    if(ListArr[i].copySelected === '0') {
                        return;
                    }
                }
                selectAllObj.copySelectAll = '1';
            }

        },
        /*
         * 原件、复印件删除取消点击事件
         */
        fileCancelEvt(pos,loc,type,state) {
            let that = this,
                selectAllObj =  that.matterList[pos], // 某一事项
                selectData = selectAllObj.matterList[loc], // 某一事项中的所有列表项
                ListArr = selectAllObj.matterList,
                curObj;
            if(state == '0') {
                return;
            }
            that.$confirm('确定删除此记录?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                if(type === 'origin') {
                    selectData.originSelected = '0';
                    selectAllObj.originSelectAll = '0';
                    selectData.originalNum = selectData.startOriginalNum;
                }else if(type === 'copy') {
                    selectData.copySelected = '0';
                    selectAllObj.copySelectAll = '0';
                    selectData.copiesNum = selectData.startCopiesNum;
                }
            }).catch(() => { 
            });
        },
        /*
         * 原件、复印件数量、意见弹框功能
         */
        oriCopyModal(pos,loc,type) {
            let that = this,
                list = that.matterList[pos].matterList[loc];
                that.curPos = pos;
                that.curLoc = loc;
                that.curfileType = type;
            if(type == 'origin') {
                that.accFileTitle = '原件收取';
                that.opinion = list.originView || '原件已核';
                that.numCopy = list.originalNum;

            }else if(type == 'copy'){
                that.accFileTitle = '复印件收取';
                that.opinion = list.copiesView || '原件已核';
                that.numCopy = list.copiesNum;
            }
            that.setAccConActive = true;
        },
        /*
         * 原件、复印件数量、意见设置 确认事件
         */
        oriCopyNumOk() {
            let that = this,
                pos = that.curPos,
                loc = that.curLoc,
                type = that.curfileType,
                list = that.matterList[pos].matterList[loc],
                msgTips,
                pattern,
                ListArr =that.matterList[pos].matterList,
                curObj;
            pattern = type === 'origin' ?  /^(([0-9]|10){1})$/ : /^(([1-9]|10){1})$/;
            that.copyOriNumVaild = pattern.test(that.numCopy) ? true : false;
            if(!that.copyOriNumVaild) {
                msgTips = type === 'origin' ? '请输入0到10之间的数字' : '请输入1到10之间的数字';
                that.$Message.warning(msgTips);
                return    
            }
            if(type === 'origin') {
                list.originView = that.opinion;
                list.originalNum = that.numCopy;
                list.originSelected = '1';
                that.dealChecAllEvt(pos, loc, '1', type);
            }else if(type === 'copy'){
                list.copiesView = that.opinion;
                list.copiesNum = that.numCopy;
                list.copySelected = '1';
                that.dealChecAllEvt(pos, loc, '1', type);
            }
            that.setAccConActive = false;
        },
        /*
         * 原件、复印件数量、意见设置 取消事件
         */
        oriCopyNumCancel() {
            let that = this,
                pos = that.curPos,
                loc = that.curLoc,
                type = that.curfileType,
                list = that.matterList[pos].matterList[loc];
            if(type === 'origin') {
                list.originalNum = list.startOriginalNum;
            }else if(type === 'copy') {
                list.copiesNum = list.startCopiesNum;
            }
            that.setAccConActive = false;
        },
        /*
         * 原件、复印件全选点击事件
         */
        CkeckAllEvt(pos, type) {
            let that = this,
                selectData = that.matterList[pos],
                state,  // 点击之前的状态
                stated;  // 点击之后的状态
            if(type === 'origin') { 
                state = selectData.originSelectAll;
                if(state === '0') {
                    selectData.originSelectAll = '1';
                    stated = '1';
                    that.handleSelectAll(pos, type, stated);
                }else if (state === '1') {
                    that.$confirm('您确认要删除所有的原件收取记录吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'fr ml10',
                        type: 'warning'
                    }).then(() => {
                        // selectData.originalNum = selectData.startOriginalNum;
                        selectData.originSelectAll = '0';
                        stated = '0'; 
                        that.handleSelectAll(pos, type, stated);  
                    }).catch(() => { 
                    });
                }
            }else if(type === 'copy'){
                state = selectData.copySelectAll;
                 if(state === '0') {
                    selectData.copySelectAll = '1';
                    stated = '1';
                    that.handleSelectAll(pos, type, stated);
                }else if (state === '1') {
                    that.$confirm('您确认要删除所有的复印件收取记录吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'fr ml10',
                        type: 'warning'
                    }).then(() => {
                        // selectData.copiesNum = selectData.startCopiesNum;
                        selectData.copySelectAll = '0';
                        stated = '0';
                        that.handleSelectAll(pos, type, stated);
                    }).catch(() => { 
                    });
                }
            }  
        },
        // 全选处理
        handleSelectAll(pos, type, stated) {
            let that = this,
                eleArr = that.matterList[pos].matterList;
            if(type === 'origin') { 
                for(let i in eleArr) {
                    if(that.judgeForm('02', eleArr[i].form)) {
                        eleArr[i].originSelected = stated;
                    }  
                }
            }else if(type === 'copy'){
                for(let i in eleArr) {
                    if(that.judgeForm('03', eleArr[i].form)) {
                        eleArr[i].copySelected = stated;
                    }  
                }
            }  
        },
        /*
         * 图片上传点击事件 
         * pos 区分单事项还是多事项 
         * loc 单事项里面的 位置信息
         */
        uploadFileEvt(pos,loc) {
            let that = this;
            that.curPos =  pos;
            that.curLoc = loc;
        },
        /*
         * 设置key参数
         */
        keyGenerator(file) {
            const currentTime = new Date().getTime();
            let that = this;
            that.uploadObj.cdnParams.key = "test/cdn/ie9/" + currentTime + "." + file.name;
            return that.uploadObj.cdnParams.key;
        },
        /*
         * 上传图片之前
         */
        beforeUpload(file) {
            let that = this;
            if(file.size > 50485760) {
                that.$Message.warning('上传文件大小不能50M!');
                return;
            }
        },
        /*
         * 上传进度
         */
        uploadProgress(file, percentage) {
            let that = this;
            that.loadingFun();
        },
        /*
         * 上传图片成功
         */
        uploadSuccess(file, res) {
            let that = this,
                pos = that.curPos,
                loc = that.curLoc,
                data,
                info,
                arr,
                size;  // 文件大小
            if(res && res.data && res.data.fileInfo && res.data.fileInfo.length > 0) {
                data = res.data;
                info = data.fileInfo[0];
                arr = that.matterList[pos].matterList[loc];
                size = (info.size/1024).toFixed(1);  // 转成KB
                size = size > 1000 ? (size/1024).toFixed(1) + 'MB': size + 'KB';
                arr.elecUrlListLoc.push({
                    path: info.filePath,
                    name: info.fileName,
                    time: info.upLoadTime,
                    size: size
                });
                arr.elecUrlList.push({
                    path: info.filePath,
                    name: info.fileName,
                    time: info.upLoadTime,
                    size: size
                });
            }else {
                return;
            }
            that.loading.close();
        },
        /*
         * 上传图片出错
         */
        uploadError(data) {
            let that = this;
            // 上传出错！请检查后重新上传！错误代码Q_TYPE_DENIED
            if(data == '上传出错！请检查后重新上传！错误代码Q_TYPE_DENIED') {
                that.$Message.warning('上传出错，请检查后重新上传！');
            }else {
                that.$Message.warning(data);
            }
        },
        /*
         * 上传图片结束
         */
        handleComplete() {
            let that = this;
            that.loading.close();
        },
         /*
         * 删除上传的图片
         */
        delFileEvt(pos,loc,index) {
            let that = this;
            that.$confirm('确定删除该文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                let list = that.matterList[pos].matterList[loc],
                    elecUrlList = list.elecUrlList, // 电子证件数组
                    elecUrlListLoc = list.elecUrlListLoc, // 本地电子证件数组
                    path = elecUrlList[index].path,  // 当前文件链接地址
                    fileType = elecUrlList[index].type;  // 如果是证照文库文件 cer 
                if(fileType && fileType == 'cer') {
                    // 删除指定位置数据信息
                    elecUrlList.splice(index, 1);  
                    elecUrlListLoc.splice(index, 1);
                    return;
                }
                unit.ajaxMerPost('/znsj-sj-web/commer/fileDelete', {
                    filePath: path,
                    isPreView: '1'  // 预览
                },function(res) {
                    // res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    that.deleteVis = false;
                    that.$Message.success(data || '删除成功！');
                    // 删除指定位置数据信息
                    elecUrlList.splice(index, 1);  
                    elecUrlListLoc.splice(index, 1);
                },function(error) {
                    that.$Message.error('删除失败！');
                }, that);
            }).catch(() => { 
            });
        },
        /*
         * 确定删除图片
         */
        sureDelEvt() {
            let that = this,
                pos = that.curPos,
                loc = that.curLoc,
                index = that.curIndex,
                list = that.matterList[pos].matterList[loc],
                elecUrlList = list.elecUrlList, // 电子证件数组
                elecUrlListLoc = list.elecUrlListLoc, // 本地电子证件数组
                path = elecUrlList[index].path;  // 当前文件链接地址
            unit.ajaxMerPost('/znsj-sj-web/commer/fileDelete', {
                filePath: path,
                isPreView: '1'  // 预览
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                that.deleteVis = false;
                that.$Message.success(data || '删除成功！');
                // 删除指定位置数据信息
                elecUrlList.splice(index, 1);  
                elecUrlListLoc.splice(index, 1);
            },function(error) {
                that.$Message.error('删除失败！');
            }, that);
        },
        /*
         * 图片预览  暂时路径跳转
         */
        previewFileEvt(e) {
            let self = $(e.currentTarget),
                path = self.data('path');  // 文件路径
            if(!path) {
                return;
            }
            window.open(path,'_blank');
        },
        /*
         * 收件份数减少点击事件 大小限制 0 -10
         * 原件允许为0  复印件不允许为0
         */
        reduceEvt() {
            let that = this,
                type = that.curfileType,
                min;  // 最小值
            min = type === 'origin' ? 0 : 1;
            if(that.numCopy > min) {
                that.numCopy--;
            }else {
                return;
            }
        },
        /*
         * 原件允许为0-10  复印件1-10
         */
        copyOriNumBlur() {
            let that = this,
                type = that.curfileType,
                pattern;
        },
        /*
         * 收件份数增加点击事件 大小限制 0 -10
         */
        plusEvt() {
            let that = this;
            if(that.numCopy < 10) {
                that.numCopy++;
            }  
        },
         /*
         * 唤起证件库弹框点击事件
         * type: 材料类型
         */
        selFCerLibEvt(pos, loc, name, type) {
            let that = this,
                param = {
                    pos: pos,
                    loc: loc,
                    name: name
                };
            that.cerLibList = [];
            that.curPos = pos;
            that.curLoc = loc;
            that.photoDiaActive = true;
            that.cerLibTitle = name || '证照库';
            // 根据材料类型 获取 材料库编码 证照库编码
            unit.ajaxMerPost('/bog-receive-web/referenceMatterial/getConfigCllx', {cllx: type}, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(data) {
                    // 材料库编码
                    param.clkcode = data.clkcode;
                    // 证照库编码
                    param.zzwkcode = data.zzwkcode; 
                    that.getMaterData(param);
                }
            },function(error) {
                that.$Message.error('数据请求失败');
            }, that);
        },
         /*
         * 获取材料数据
         */
        getMaterData(param) {
            let that = this;
            unit.ajaxMerPost('/znsj-web/referenceMatterial/getFromZzwkAndClk', {
                ownId: that.$parent.param.idCard ? that.$parent.param.idCard : '',  // 身份证号/统一企业信用代码  clk:340827198409272318 zzwk:111111111111111
                zzwkClmlCode: param.zzwkcode, // 证照文库材料类型编码
                clkClmlCode: param.clkcode, // 材料库材料类型编码
            }, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                for(let i = 0; i < data.length; i++) {
                    data[i].selected = '0';
                }
                that.$nextTick(()=>{
                    that.cerLibList = data; 
                })
            },function(error) {
                that.$Message.error('数据请求失败');
            }, that);
        },
        
        /*
         * 证照库点击事件
         */
        cerLibSelEvt(index) {
            let that = this,
                list = that.cerLibList[index];
            that.cerLibList[index].selected = list.selected === '0' ? '1' : '0';
        },
        /*
         *  证照库确认按钮点击事件
         */
        cerLibSelOk() {
            let that = this,
                pos = that.curPos,
                loc = that.curLoc,
                matList,
                selectedNum = 0;
            matList = that.matterList[pos].matterList[loc];
            for(let i in that.cerLibList) {
                if(that.cerLibList[i].selected === '1') {
                    selectedNum++;
                    // 判断证照库是否添加
                    let eleList = matList.elecUrlListLoc;
                    for(let j = 0; j < eleList.length; j++) {
                        if(eleList[j].type &&  eleList[j].type == 'cer' && that.cerLibList[i].contentCode == eleList[j].code) {
                            that.$Message.warning(that.cerLibList[i].contentName + '已添加');
                            return;
                        }
                    }
                    matList.elecUrlListLoc.push({
                        name: that.cerLibList[i].contentName,
                        path: that.cerLibList[i].filePath,
                        time: that.cerLibList[i].createTime,
                        type: 'cer',  // 证照库
                        code: that.cerLibList[i].contentCode,
                    });
                    matList.elecUrlList.push({
                        name: that.cerLibList[i].contentName,
                        path: that.cerLibList[i].filePath,
                        time: that.cerLibList[i].createTime,
                        type: 'cer',  // 证照库
                        code: that.cerLibList[i].contentCode,
                    });
                }
            }
            if(selectedNum == 0) {
                that.$message.warning('所选材料为空，请选择！');
                return;
            }
            that.photoDiaActive = false;
        },
        /*
         *  证照库取消按钮点击事件
         */
        cerLibSeCancel() {
            let that = this;
            that.photoDiaActive = false;
            // 复选框状态都置为 未选中状态
            for(let i in that.cerLibList) {
                that.cerLibList[i].selected = '0';
            }
        },
        /*
         *  上一步按钮点击事件
         */
        preStepEvt() {
            // 跳转到信息填写页面
            this.$emit('go', 'infoFill');
        },
        /*
         *  验证收件材料
         */
        checkMaterial() {
             // 检验上传材料是否全部上传
            let that = this,
                eventList = that.matterList,  // 当前事件
                itemList,  // 事项
                form,  // 文件形式 原件、复印件、电子证件
                result = true;
            for(let i in eventList) {
                itemList = eventList[i].matterList;
                for(let j in itemList) {
                    form = itemList[j].form;
                    // 必传
                    if(itemList[j].isNeed === '1') {
                        // 必填时  只需要 原件、复印件、电子件上传一个即可
                        // 功规变更 材料的原件、电子件、复印件为或关系，其中一个核验/收取/上传即可。
                        // 注：如果是原件，可能现场核验一下就可以了，数据为0的话也可以通过。
                        let condition1 = form.indexOf('01') > -1 && itemList[j].elecUrlList.length > 0,
                            condition2 = form.indexOf('02') > -1 && itemList[j].originSelected === '1',
                            condition3 = form.indexOf('03') > -1 && itemList[j].copySelected === '1';
                        if(!(condition1 || condition2 || condition3)) {
                            that.$Message.warning('请收取' + itemList[j].matterialName + '材料！');
                            result = false;
                            return;
                        }
                    }
                }
            }
            return result;
        },
        /*
         *  确认收件
         */
        sureAccFileEvt(type) {
            let that = this,
                param,
                obj = {};
            if(!that.checkMaterial()) {
                return;
            }
            obj.type = that.pageParamObj.type;
            if(that.pageParamObj.type == '3') {
                obj.id = that.$parent.param.eventReceiptNo;    
            }else {
                obj.id = that.$parent.param.receiptNo;
            }
            obj.matterList =  that.matterList;
            that.pageParamObj.jointStatus = that.$parent.param.jointStatus;
            that.pageParamObj.state = that.$parent.param.state;
            // param = JSON.stringify(obj);
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            unit.ajaxObjPost('/znsj-web/consignee/saveReceipt', obj, function(res) {
                loading.close();
                let data = res.data;
                if(that.pageParamObj.type == '3') {
                    that.pageParamObj.eveReceiptNo = data.receiptNo; // 收件号
                }
                that.$Message.success('收件成功！');
                that.$router.push({name:'receiverSuccess', params:that.pageParamObj});
            },function(error) {
                loading.close();
                that.$Message.error('数据请求失败');
            }, that);
        },
        /*
         *  根据事项id获取材料信息
         */
        getMatterial() {
            let that = this,
                obj = {};
            obj.type = that.$parent.param.type;
            if(that.pageParamObj.type == '3') {
                obj.id = that.$parent.param.eventReceiptNo;    
            }else {
                obj.id = that.$parent.param.receiptNo;
            }
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            unit.ajaxMerPost('/znsj-web/consignee/getMatterial', obj ,function(res) {
                loading.close();
                let data = res.data;
                let originFormNum = 0,  // 原件复选框数量 作为批量复选框是否选中的标志位
                    copyFormNum = 0;  // 复印件复选框数量
                for(let i in data.matterList) {  
                    // 添加批量复选框标志位 
                    data.matterList[i].originSelectAll = '0'; 
                    data.matterList[i].copySelectAll = '0';
                    originFormNum = 0;
                    copyFormNum = 0;
                    for(let j in data.matterList[i].matterList) {
                        let form = data.matterList[i].matterList[j].form,
                            curList = data.matterList[i].matterList[j];
                        if(form) {
                            if(that.judgeForm('02', form)) {
                                originFormNum++;
                            }
                            if(that.judgeForm('03', form)) {
                                copyFormNum++;
                            }
                        }
                        // 文件上传大小格式处理
                        data.matterList[i].matterList[j].matterialSizeKB = data.matterList[i].matterList[j].matterialSize * 1024000;
                        // 记录初始份数
                        data.matterList[i].matterList[j].startOriginalNum = data.matterList[i].matterList[j].originalNum;
                        data.matterList[i].matterList[j].startCopiesNum = data.matterList[i].matterList[j].copiesNum;
                        
                        // 文件格式处理
                        let fileName,  // 文件格式名
                            fileNExtendArr = [],  // 文件格式名数组
                            fileMimeArr = [],
                            dataArr = data.matterList[i].matterList[j].fileType;
                            if(dataArr) {
                                dataArr = dataArr.split(',');
                            }
                        // 文件格式一定是存在的不用做容错处理
                        for(let k in dataArr) {
                            fileName = dataArr[k];
                            fileNExtendArr.push(fileName);
                            fileMimeArr.push(that.fileKeyVal[fileName]);
                        }
                        data.matterList[i].matterList[j].fileTypes = {
                            extensions: fileNExtendArr.join(','),
                            mimeTypes: fileMimeArr.join(',')
                        }
                        curList.originSelected = '0';
                        curList.copySelected = '0';
                        curList.elecUrlListLoc = [];
                    }
                    data.matterList[i].originFormNum = originFormNum;
                    data.matterList[i].copyFormNum = copyFormNum;
                    that.$set(that.matterList, i, data.matterList[i]);  
                }
                that.dealCirLibBtnShow();
            },function(error) {
                loading.close();
                that.$Message.error('数据请求失败');
            }, that);
        },
        dealCirLibBtnShow() {
            let that = this,
                i = 0,
                j = 0;
            if(i < that.matterList.length) {
                if(j < that.matterList[i].matterList.length) {
                    if(that.judgeForm('01', that.matterList[i].matterList[j].form)){
                        let row = that.matterList[i].matterList[j];
                        unit.ajaxMerPost('/bog-receive-web/referenceMatterial/checkMatterial', {
                            ownerId: that.$parent.param.idCard ? that.$parent.param.idCard : '',  // 身份证号/统一企业信用代码  clk:340827198409272318 zzwk:111111111111111
                            zzwkcode: row.zzwkcode, // 证照文库材料类型编码
                            clkcode: row.clkcode, // 材料库材料类型编码
                        }, function(res) {
                            let data = res.data;
                            that.$set(that.matterList[i].matterList[j], 'isCirLibShow', data == 'true' ? true : false);
                            if(j == that.matterList[i].matterList.length -1) {
                                i = i+1;
                            }
                            j = j+1;
                        },function(error) {
                            row.isCirLibShow = false;
                            that.$Message.error('数据请求失败');
                        }, that);
                    }else {
                        that.$set(that.matterList[i].matterList[j], 'isCirLibShow', false);
                        if(j == that.matterList[i].matterList.length -1) {
                            i = i+1;
                        }
                        j = j+1;
                    }
                }
            }

        },
        loadingFun() {
            let that = this;
            that.loading = that.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
        },
        /**
         * 初始化
         */
        init() {
            let that = this,
            param = that.$parent.param;
            that.pageParamObj.type = param.type;
            if(param.type == '3') {  // 一件事
                that.pageParamObj.eventReceiptNo = param.eventReceiptNo;  // 事件号
                that.pageParamObj.eventCode = param.eventCode;
                that.pageParamObj.id = param.id;  // 一件事id
                that.step = 5;
            }else { // 单事项或者多事项
                that.pageParamObj.receiptNo = param.receiptNo;
                that.pageParamObj.matterIds = param.matterIds; // 事项id  数组
                that.step = 4;
            }
            that.pageParamObj.title = that.$parent.param.name;
            that.jointStatus = that.$parent.param.jointStatus;
            // 根据事项获取材料
            that.getMatterial();
            unit.solveIviewTable();
        }
    },
    mounted() {
        let that = this;
        that.init();
    }
}
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
.el-button--primary {
    color: #fff!important;
}
#collectMaterial {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    .collect-material-wrap {
        width: 100%;
        height: 100%;
        background: #fff;
        overflow-y: auto;
        overflow-x: hidden;
        .content-box{
            padding-right:100px;
        }
        // 主体内容
        .content {
            width: 100%;
            padding-left: 15px;
            color: #515a6e;
            margin-bottom: 30px; 
            .notice-title {
                padding: 25px 0 15px 0;
                border-bottom: 1px dashed #ddd;
                i.btn {
                    display: inline-block;
                    padding: 0 5px;
                    height: 24px;
                    min-width: 50px;
                    color: #fff;
                    border-radius: 2px;
                    line-height: 24px;
                    text-align: center;
                    vertical-align: top;
                }
                label {
                    line-height: 24px;
                    vertical-align: top;
                }
            }
            .head {
                .checkb-wrap {
                    float: right;
                    margin: 8px 00px 0 0;
                    line-height: 40px;
                    div {
                        display: inline-block;
                        .box-wrap, 
                        .num-text {
                            display: inline-block;
                            height: 24px;
                            vertical-align: top;
                            line-height: 24px;
                        }
                        .num-text {
                            padding: 0 15px 0 4px;
                        }
                        .box-wrap {
                            width: 16px;
                            border-radius: 3px;
                            background: url(../../../assets/images/common/icon-unselect.png) no-repeat;
                            background-position: center center;
                            background-size: 14px;
                            cursor: pointer;
                        }
                        .selected {
                            background: url(../../../assets/images/common/icon-select.png) no-repeat;
                            background-position: center center;
                            background-size: 14px;
                        }
                    }
                    
                }
            }
            label,
            .mark { // 备注信息
                display: inline-block;
                padding-right: 10px;
                height: 18px;
                line-height: 18px;
            }
            .al-upload {
                color: #2d8cf0;
            }
            label {
                padding-right: 40px;
                color: #515a6e;
                vertical-align: top;
            }
            .mark {
                padding: 0;
                margin: 10px 0;
                max-width: 90%;
                font-weight: 550;
                vertical-align: middle;
            }
            // 橘色
            .co-orange {
                background: #ff7a45;
                border-color: #ff7a45;
            }
            // 淡蓝
            .co-blue {
                background: #2d8cf0;
                border-color: #2d8cf0;
            }
            // 淡绿
            .co-green {
                background: #00c0c7;
                border-color: #00c0c7;
            }
            .btn-wh {
                width: 24px;
                height: 20px;
            } 
            .item-List {
                .item {
                    margin: 15px 0;
                    border: 1px solid #e1e6f0;
                    background: #f8f9fc;
                    .state-head {
                        display: inline-block;
                        margin-bottom: 10px;
                        height: 18px;
                        width: 51px;
                        font-size: 12px;
                        color: #fff;
                        line-height: 18px;
                        text-align: center;
                    }
                    // 必要
                    .icon-need {
                        background: url(../../../assets/images/common/bg-title1.png) no-repeat;
                        background-position: top left;
                        background-size: 51px 18px;
                    }
                    // 非必要 
                    .icon-no-need {
                        background: url(../../../assets/images/common/bg-title2.png) no-repeat;
                        background-position: top left;
                        background-size: 51px 18px;
                    }
                    // 容缺
                    .icon-lack {
                        background: url(../../../assets/images/common/bg-title3.png) no-repeat;
                        background-position: top left;
                        background-size: 51px 18px;
                    }
                    .item-content {
                        padding-left: 15px;
                        // 备注信息
                        .icon-dobut {
                            display: inline-block;
                            width: 20px;
                            height: 24px;
                            background: url(../../../assets/images/common/icon-dobut.png) no-repeat;
                            background-position: center center;
                            background-size: 16px;
                            vertical-align: middle;
                        } 
                        // 实际操作项
                        .oper-wrap {
                            margin: 18px 0 18px 0;
                            .origin-file,
                            .copy-file {
                                display: inline-block;
                                padding: 0 10px;
                                margin-right: 15px;
                                height: 36px;
                                color: #515a6e;
                                border: 1px solid #515a6e;
                                border-radius: 5px;
                                background-color: #fff;
                                line-height: 34px;
                                text-indent: 25px;
                            }
                            // 文件收取样式
                            .origin-filed,
                            .copy-filed {
                                color: #2d8cf0;
                                border: 1px solid #2d8cf0;
                            }
                            // 收取原件 - 未收取
                            .origin-file {
                                background:#fff url(../../../assets/images/common/icon-copy.png) no-repeat;
                                background-position: 10px center;
                                background-size: 18px 14px;

                            }
                            // 收取复印件 - 未收取
                            .copy-file {
                                background:#fff url(../../../assets/images/common/icon-print.png) no-repeat;
                                background-position: 10px center;
                                background-size: 17px 16px;
                            }
                            // 收取原件 - 已收取
                            .origin-filed {
                                background:#fff url(../../../assets/images/common/icon-copyed.png) no-repeat;
                                background-position: 10px center;
                                background-size: 18px 14px;

                            }
                            // 收取复印件 - 已收取
                            .copy-filed {
                                background:#fff url(../../../assets/images/common/icon-printed.png) no-repeat;
                                background-position: 10px center;
                                background-size: 17px 16px;
                            }
                            // 本地上传 拍照等按钮样式
                            .file-oper {    
                                display: inline-block;
                                height: 38px;
                                width: auto;
                                background: #fff;
                                border: 1px dashed #515a6e;
                                border-radius: 5px;
                                vertical-align: top;
                                .ver-line {
                                    display: inline-block;
                                    width: 1px;
                                    height: 20px;
                                    margin: 8px 5px 0 0;
                                    background: #bbb;
                                }
                                a {
                                    display: inline-block;
                                    height: 100%;
                                    color: #515a6e;
                                    vertical-align: top;
                                    line-height: 36px;
                                }
                                .icon-upload-flag {
                                    padding: 0 5px;
                                    height: 36px;
                                    background: url(../../../assets/images/common/icon-pic-upload.png) no-repeat;
                                    background-position: 10px center;
                                    background-size: 20px 20px;
                                    cursor: default;
                                    line-height: 36px;
                                    text-indent: 30px;
                                }
                                .has-pic-upload {
                                    color: #2d8cf0;
                                    background: url(../../../assets/images/common/icon-pic-uploaded.png) no-repeat;
                                    background-position: 10px center;
                                    background-size: 20px 20px;
                                }
                                .btn {
                                    padding-right: 10px;
                                    cursor: pointer;
                                }
                                .btn:hover {
                                    color: #2d8cf0;
                                }
                                // // 本地上传
                                .loc-upload {
                                    .webuploader-pick {
                                        position: relative;
                                        top: 1px;
                                        padding: 0;
                                        height: 30px;
                                        color: #515a6e;
                                        background: #fff;
                                        overflow: visible;
                                        clean: both;
                                    }
                                    .webuploader-pick-hover {
                                        background: #fff;
                                        color: #2d8cf0;
                                    }
                                }
                            }
                            .file-info-notice {
                                height: 40px;
                                line-height: 40px;
                            }
                        }
                        // 原件、复印件、上传照片展示的内容
                        .upload-detail {
                            color: #515a6e;
                            label {
                                display: inline-block;
                                padding: 0;
                                width: 50px;
                                // height: 20px;
                                line-height: 20px;
                                text-align: right;
                            }
                            span {
                                display: inline-block;
                                padding-right: 15px;
                                height: 20px;
                                line-height: 20px;
                                vertical-align: top;
                            }
                            .file-opinion {
                                padding-right: 0px;
                            }
                            .file-num {
                                margin-left: 15px;
                                // vertical-align: bottom;
                            }
                            .origin-files,
                            .copy-files {
                                margin-bottom: 10px;
                            }
                            .elec-photo {
                                .file-list-wrap {
                                    display: inline-block;
                                    margin-left: 15px;
                                    max-width: 90%;
                                    vertical-align: top;
                                    .file-list {
                                        display: inline-block;
                                        margin: 0 80px 10px 0;
                                        min-width: 195px;
                                        .time-max {
                                            height: 20px;
                                            span {
                                                display: inline-block;
                                                height: 20px;
                                                line-height: 20px;
                                            }
                                            .time {
                                                padding-right: 10px;
                                            }
                                        }
                                        .file-name {
                                            // max-width: 280px;
                                            color: #2d8cf0;
                                        }
                                    }
                                }
                                a {
                                    display: inline-block;
                                    padding-right: 10px;
                                    height: 25px;
                                }
                                span {
                                    padding: 0;
                                }
                            }
                            a {
                                text-decoration: none;
                            }
                            a:hover {
                                color: #333;
                            }
                            i {
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                background: url(../../../assets/images/common/icon-del.png) no-repeat;
                                background-position: center;
                                background-size: 12px;
                                cursor: pointer;
                            }

                        }
                    } 
                }
            }
        } 
        .btn-wrap {
            text-align: right;
            padding-right:100px;
            .ivu-btn {
                width: 120px;
            }
            .step,.step4{
                padding: 0;
                height: 32px;
                line-height: 1;
            }
        }
    }
    #detailHead {
        max-width: 700px;
        .title {
            max-width: 700px;;
        }
    }
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    // el 弹框样式覆盖
    .el-dialog {
        font-size: @baseSize14;
        border-radius: 5px;
        .el-dialog__body {
            border-bottom: 1px solid #ddd;
        }
        .el-dialog__header {
            font-size: @baseSize16;
            border-radius: 5px 5px 0 0;
            border-bottom: 1px solid #ddd;
            background-color: #fff;
            .el-dialog__title,
            .el-dialog__close {
                color: #515a6e;
            }
        }
        .el-dialog__footer {
            padding-bottom: 10px;
            text-align: right;
        }
    }
   
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
  
}
// 原件、复印件收件数弹框
// 内容框
.dialog-con-wrap {
    width: 100%;
    .row {
        margin-bottom: 20px;
        width: 100%;
        label {
            display: inline-block;
            height: 30px;
            width: 80px;
            font-size: 13px;
            text-align: right;
            line-height: 30px;
        }
        .input-wrap {
            display: inline-block;
            font-size: 0;
            vertical-align: top;
            span,
            input {
                display: inline-block;
                height: 32px;
                width: 25px;
                // font-size: 12px;
                color: #b0b2b6;
                background: #f5f7fa;
                border: 1px solid #e4e6ec;
                line-height: 30px;
                text-align: center;
                vertical-align: top;
            }
            input {
                outline: none;
            }
            .btn-reduce {
                border-radius: 3px 0 0 3px;
            }
            .btn-plus {
                border-radius: 0 3px 3px 0;
            }
            .num-copy {
                width: 60px;
                color: #666;
                background: #fff;
                border-left: none;
                border-right: none;
                border-radius: none; 
            }
        }
        
        .ivu-input-wrapper {
            display: inline-block;
            width: 80%;
            vertical-align: top;
        }
    }
}
// 证照库弹框
.dialog-photo-wrap {
    padding: 15px;
    height: 400px;
    width: 100%;
    overflow-y: auto;
    .item-list {
        a {
            display: inline-block;
            padding: 10px;
            margin: 0 36px 0;
            width: 170px;
            height: 150px;
            border: 1px solid #c9c9c9;
            .icon-check {
                margin-bottom: 8px;
                width: 100%;
                height: 25px;
                text-align: right;
            }
            i,
            span {
                display: inline-block;
                height: 25px;
                font-size: 13px;
            }
            i {
                width: 30px;
                background: url(../../../assets/images/common/icon-unselect.png) no-repeat;
                background-position: right center;
                background-size: 16px;
                text-align: right;
            }
            .selected {
                background: url(../../../assets/images/common/icon-select.png) no-repeat;
                background-position: right center;
                background-size: 16px;
            }
            span {
                width: 100%;
                text-align: center;
                line-height: 25px;
            }
            .pic-title,
            .pic-sub-title {
                height: 15px;
                color: #666;
                line-height: 15px;
            }
            .pic-sub-title {
                margin-bottom: 10px;
            }
            .file-name,
            .date {
                color: #333;
            }
        }
    }
    .empty-wrap {
        width: 100%;
        height: 350px;
        background: url(../../../assets/images/common/empty.png) no-repeat;
        background-position: center center;
    }
}
.cir-lib-wrap {
    .el-dialog__body {
        padding: 0;
    }

}
</style>
