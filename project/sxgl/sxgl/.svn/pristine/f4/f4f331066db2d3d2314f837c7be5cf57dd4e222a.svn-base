/*
 * @Author: qianju2
 * @Date: 2018-10-29 9:46:42 
 * @Last Modified by: qianju2
 * @Last Modified time: 2018-12-28 17:25:59
 */
 <template>
    <div id="department" class="clearfix">
            <tabNavigate :tabs="tabs"></tabNavigate>
            <div class="main-wrap  clearfix">
                <!-- 查询 -->
                <div class="clearfix">
                    <!-- 常规查询 -->
                    <el-row class="clearfix">
                        <el-col :span="6" :md="6">
                            <label class="mr5">行政区划</label>
                            <div class="inline-block common-width">
                                <Cascader class="inline-block bwidth" placeholder="全部" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select filterable :transfer="true"></Cascader>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <label class="mr5">单位名称</label>
                            <div class="inline-block common-width">
                                <el-input :maxlength="100" v-model="deptName" placeholder="请输入单位名称" size="small" @change="changeDeptName"></el-input>
                            </div>
                        </el-col>
                        <!-- 查询/更多 -->
                        <el-col :span="6" :md="6" :push="0">
                            <el-button class="w70 h30" type="primary" size="mini" @click="searchEvt">查询</el-button>
                            <!-- <a ref="higSearch" class="higher-search-a text-blue fz14" href="javascript:void(0)" @click="higSearchEvt">
                                <span>{{ higSerMsg }}</span>
                                <i class="iconfont icon-xia"></i>
                            </a> -->
                        </el-col>
                        <!-- 新增/删除 -->
                        <el-col :span="6" :md="6" :push="0">
                            <div class="btn-search-wrap">
                                <div class="fr">
                                    <el-button class="w60 h30 btn-del" size="mini" @click="delDeptEvt('')">删除</el-button>
                                </div>
                                <div class="fr mr10">
                                    <el-button class="w60 h30" type="primary" size="mini" @click="editDeptEvt('')">新增</el-button>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- 高级查询 -->
                    <!-- <el-row class="clearfix mt20" v-bind:class="{hide:isHigRow}">
                        <el-col :span="6" :md="6">
                            <label class="mr5">上级单位</label>
                            <div class="inline-block common-width">
                                <el-input :maxlength="100" v-model="supName" placeholder="请输入上级单位" size="small" @change="changeSuperiorDept"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <label class="mr5 inline-block label-width">上级主管单位</label>
                            <div class="inline-block common-width">
                                <el-input :maxlength="100" placeholder="请输入上级主管单位" size="small" @change="changeSuperiorCompetentDept"></el-input>
                            </div>
                        </el-col>
                    </el-row> -->
                </div>
                <!-- 列表 -->
                <div class="list-wrap mt20">
                    <el-table :data="deptData" @selection-change="tableSelChange">
                        <el-table-column class="font-max" align="center" type="selection" width="55">
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" prop="deptName" label="单位名称">
                            <template scope="scope">
                                <span :title="scope.row.deptName">{{scope.row.deptName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" prop="adminDivName" label="行政区划">
                            <template scope="scope">
                                <span :title="scope.row.adminDivName">{{scope.row.adminDivName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" width='160' prop="deptCode" label="单位编码">
                            <template scope="scope">
                                <span :title="scope.row.deptCode">{{scope.row.deptCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" width="120" prop="orgCode" label="组织机构代码">
                            <template scope="scope">
                                <span :title="scope.row.orgCode">{{scope.row.orgCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" width="160" prop="socialCreditCode" label="统一社会信用代码">
                            <template scope="scope">
                                <span :title="scope.row.socialCreditCode">{{scope.row.socialCreditCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" prop="supName" label="上级单位">
                            <template scope="scope">
                                <span :title="scope.row.supName">{{scope.row.supName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" class-name="el-tooltip" align="left" width="120" prop="supComName" label="上级主管单位">
                            <template scope="scope">
                                <span :title="scope.row.supComName">{{scope.row.supComName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="font-max" align="center" width="80" prop="sortNo" label="排序">
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="editDeptEvt(deptData[scope.$index].id,scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="delDeptEvt(deptData[scope.$index].id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block fr mt10">
                        <el-pagination :total="total" :page-size="pageSize" @size-change="deptSizeChange" @current-change="deptCurrentChange" :current-page.sync="currentPage" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>

                <!-- 新增/编辑单位 -->
                <el-dialog :title="deptlTitle" :visible.sync="deptAddVis" @closed="clearValidate" width="800px" height="600px" :close-on-click-modal="false"> 
                    <el-form :model="deptFormData" :rules="deptRules" ref="deptForm" label-width="160px" :label-position="labelPosition" size="small">  
                        <el-row>
                            <el-col :span="10">
                                <el-form-item class="font-min" label="行政区划" prop="adminDiv" :required="deptFormData.adminDiv == '' ? false : true">
                                    <Cascader class="inline-block bwidth" placeholder="请选择" :data="adminDivData" :load-data="xzqhLoadData" v-model="deptFormData.adminDiv" change-on-select filterable @on-change="changeXzqh"></Cascader>
                                </el-form-item> 
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="font-min" label="单位名称" prop="deptName">
                                    <el-input class="font-min" placeholder="请填写单位名称" v-model.trim="deptFormData.deptName"  maxlength='100' @change="changeDeptName2" @input='deptShortNameFill'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item class="font-min" label="单位简称" prop="deptShortName">
                                    <el-input class="font-min" placeholder="请填写单位简称" v-model.trim="deptFormData.deptShortName"  maxlength='100' @change="changeDeptShortName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="font-min" label="单位编码" prop="deptCode">
                                    <el-input class="font-min" placeholder="请填写单位编码" v-model.trim="deptFormData.deptCode"  maxlength='32' @change="changeDeptCode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item class="font-min" label="组织机构代码" prop="orgCode">
                                    <el-input class="font-min" placeholder="请填写组织机构代码" v-model.trim="deptFormData.orgCode"  maxlength='32' @change="changeOrgCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="font-min" label="统一社会信用代码" prop="socialCreditCode">
                                    <el-input class="font-min" placeholder="请填写统一社会信用代码" v-model.trim="deptFormData.socialCreditCode"  maxlength='32' @change="changeSocialCreditCode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item class="font-min select-page-wrap" label="上级单位">
                                    <el-select  placeholder="请选择" v-model.trim="deptFormData.supCode" ref='supDept'  filterable :filter-method="supCodeFilter" :popper-append-to-body="false"> 
                                        <el-option  v-for="item in superiorDeptSec" :title="item.label" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                        <div class="block fr mt10">
                                            <el-pagination class="selectPage" :total="supCodeTotal" :page-size="supCodePageSize" :current-page.sync="supCodeCurrentPage" @current-change="supCodeCurrentChange" layout="total, prev, next,jumper">
                                            </el-pagination>
                                        </div>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="font-min select-page-wrap" label="上级主管单位">
                                    <!--  @remove-tag='removeSupCom' @change="SupComChange" multiple :multiple-limit=10 -->
                                    <el-select v-model="deptFormData.supComCode" placeholder="请选择" filterable :filter-method="supComCodeFilter" :popper-append-to-body="false">
                                        <el-option  v-for="item in superiorCompetentDeptSec" :title="item.label" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                        <div class="block fr mt10">
                                            <el-pagination class="selectPage" :total="supComCodeTotal" :page-size="supComCodePageSize" :current-page.sync="supComCodeCurrentPage" @current-change="supComCodeCurrentChange" layout="total, prev, next,jumper">
                                            </el-pagination>
                                        </div>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item class="font-min" label="排序" prop="sortNo">
                                    <el-input class="font-min" v-model="deptFormData.sortNo" @change="changeSortNo"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="font-min" label="单位类型" prop="deptType">
                                    <el-select  placeholder="请选择" v-model="deptFormData.deptType" filterable :popper-append-to-body="false">
                                        <el-option v-for="item in deptTypeSec" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item class="font-min" label="单位描述" prop="deptDsc">
                                <el-input type="textarea" maxlength='200' v-model.trim="deptFormData.deptDsc"></el-input>
                                </el-form-item>
                            </el-col>  
                        </el-row>
                        <div class="footer">
                            <el-button type="primary" size="small" :disabled="isDisable" @click="saveFormData('deptForm')">确 定</el-button>
                            <el-button size="small"  @click="deptAddVis = false">取 消</el-button>
                        </div>
                    </el-form>
                </el-dialog>
            </div>
    </div>
 </template>
 <script>
 import unit from '@/api/index';
 import tabNavigate from "@/components/common/tabNavigate";   // 页签导航
 export default {
     components: {
        tabNavigate: tabNavigate,
    },
     data(){
        let sortNoRules = (rule, value, callback) => {
            var that = this;
            if(value===""){
                callback();
            }else{
                let rule = /^([1-9][0-9]{0,4}|0)$/
                if (!rule.test(value)) {
                     callback(new Error("请输入0到99999的整数"));
                } else {
                    callback();
                }
            }
        };
         return{
            tabs: ['基础信息管理', '单位管理'],
            proData: [],
            xzqhVal: [], // 行政区划
            supName: "",//上级单位
            deptName:'',//单位名称
            saveXzqh: [], //暂存行政区划
            time:0,
            higSerMsg: '更多',
            isHigRow:true,
            deptSeldArr: [],  // 指南删除选中项 id
            // 表格数据
            deptData:[],
            // 列表分页
            currentPage: 1,
            pageSize: 10,
            total: 0,
            // 新增
            deptAddVis:false,
            xzqhChange:false,
            deptlTitle:"新增单位", 
            isDisable:false,
            adminDivData:[],//新增--行政区划
            deptShortNameEmpty:true,
            deptFormData:{
                adminDiv:[],
                deptName : '',//单位名称
                deptShortName : '',//单位简称
                deptCode : '',//单位编码
                orgCode : '',//组织机构编码
                socialCreditCode : '',//统一社会信用代码
                supCode : '',//上级单位
                // supComCode :[],//上级主管单位
                supComCode:'',//上级主管单位
                sortNo : '',//排序
                deptType : '',//单位类型
                deptDsc : '',//单位描述
            },
            xzqhFlag: [],
            // 下拉框分页
            supCodeCurrentPage: 1,
            supCodePageSize: 10,
            supCodeTotal: 0,
            // supCodeSearch:'',

            supComCodeCurrentPage: 1,
            supComCodePageSize: 10,
            supComCodeTotal: 0,


            superiorDeptSec:[],//上级单位
            superiorCompetentDeptSec:[],//上级主管单位
            deptTypeSec:[],//单位类型
            deptRules:{
                adminDiv: [
                    { type:'array',required: true, message: '请选择行政区划', trigger: 'change' },
                ],
                deptName:[
                    { required: true, message: '请填写单位名称', trigger: 'blur' },
                    { max:100, message: '长度最大不能超过100', trigger: 'blur'}
                ],
                deptShortName:[
                    { required: true, message: '请填写单位简称', trigger: 'blur' },
                    { max:100, message: '长度最大不能超过100', trigger: 'blur'}
                ],
                deptCode:[
                    { required: true, message: '请填写单位编码', trigger: 'blur' },
                    { pattern:/^[\w]+$/,message:'请输入数字或英文',trigger:'blur'},
                    { max:32, message: '长度最大不能超过32', trigger: 'blur'}
                ],
                orgCode:[
                    { required: true, message: '请填写组织机构代码', trigger: 'blur' },
                    { pattern:/^[\w]+$/,message:'请输入数字或英文',trigger:'blur'},
                    { max:32, message: '长度最大不能超过32', trigger: 'blur'}
                ],
                socialCreditCode:[
                    { required: true, message: '请填写统一社会信用代码', trigger: 'blur' },
                    { pattern:/^[\w]+$/,message:'请输入数字或英文',trigger:'blur'},
                    { max:32, message: '长度最大不能超过32', trigger: 'blur'}
                ],
                deptType:[
                    { required: true, message: '请选择单位类型', trigger: 'change' },
                ],
                deptDsc:[
                    {required: false,max:200, message: '长度最大不能超过200', trigger: 'blur'}
                ],
                sortNo:[
                     {
                        required: false,
                        validator: sortNoRules,
                        trigger: "blur"
                    }
                ]
            },
            labelPosition: 'right',
         };
     },
     methods:{
         /*
         * 修复ie记忆问题
         */
        // 查询
        changeDeptName(val) { //单位名称
            this.deptName = val == '' ? '' : val;
        },
        changeSuperiorDept(val) {//上级单位
            this.supName = val == '' ? '' : val;
        },
        changeSuperiorCompetentDept(val) {
            this.matterNameVal = val == '' ? '' : val;
        },
        // 新增
        changeDeptName2(val) {
            this.deptFormData.deptName = val == '' ? '' : val;
        },
        changeDeptShortName(val) {
            let that = this;
            that.deptFormData.deptShortName = val == '' ? '' : val;
            if(val != that.deptFormData.deptName){
                that.deptShortNameEmpty = false;
            }
        },
        changeDeptCode(val) {
            this.deptFormData.deptCode = val == '' ? '' : val;
        },
        changeOrgCode(val) {
            this.deptFormData.orgCode = val == '' ? '' : val;
        },
        changeSocialCreditCode(val) {
            this.deptFormData.socialCreditCode = val == '' ? '' : val;
        },
        changeSortNo(val) {
            this.deptFormData.sortNo = val == '' ? '' : val;
        },
         // 清空表单校验
        clearValidate: function() {
            // let that = this;
			// if (that.$refs["deptForm"]) {
			// 	that.$refs["deptForm"].clearValidate();       
            // }
        },
        /*
        ** 获取默认行政区划
        */
        getDefaultXzqh() {
            let that=this;
            that.saveXzqh=[];
            that.xzqhVal = [];
            that.xzqhVal.push('');
            that.saveXzqh.push('');
            that.getDeptData();
        },
         /*
        ** 获取行政区划
        */
        getXzqhTreeData(type) {
            let that = this,
            obj = {};
            if(type === '1'){
                obj.value= that.xzqhVal[0]
            }else if(type === '2'){
                obj.value= that.deptFormData.adminDiv[0]
            }
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        if(item.existChild) {
                            item.children = [];
                            item.loading = false;
                        }
                    });
                    if(type === '1'){
                        that.proData = res.data;
                        that.proData.unshift({
                            label:'全部',
                            value:'all'
                        });
                    }else if(type === '2'){
                        that.adminDivData = res.data;
                        // that.adminDivData.unshift({
                        //     label:'全部',
                        //     value:'all'
                        // });
                    }
                } else {
                    that.$message.warning('服务端错误');
                }
            }, function (res) {
                that.$message.warning('服务端错误');
            }, that);
        },
       /* 
        ** 行政区划动态加载
        */
        xzqhLoadData(item, callback) {
            let _that = this,
                qhCode = item.value;
            item.loading = true;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
                    if (result.flag == true) {
                        $.each(result.data, function (i, t) {
                            if(t.existChild){
                                t.children = [];
                                t.loading = false;
                            }
                        });
                        item.children = result.data;
                        if(!_that.xzqhChange){
                            setTimeout(()=>{
                                for(let i=1;i<_that.xzqhFlag.length;i++){
                                    _that.deptFormData.adminDiv.push(_that.xzqhFlag[i].value);
                                }
                            }, 0);
                        }
                    } else {
                        _that.$message.warning('服务端错误');
                    }
                    item.loading = false;
                    callback();
                }, function (result) {
                    _that.$message.warning('服务端错误');
                }, _that);
            }, 300);
        },
        // 行政区划改变
        changeXzqh(value, selectedData) {
            let that = this;
            that.deptFormData.adminDiv = value;
            that.xzqhChange = true;
        },
        /*
        ** 切换更多、常规
        */
        // higSearchEvt(e) {
        //     this.isHigRow = this.isHigRow !== true;
        //     let iEle = $(e.target)
        //         .parent()
        //         .find('i');
        //     this.higSerMsg = this.higSerMsg === '更多' ? '常规' : '更多';
        //     iEle.hasClass('icon-xia')
        //         ? iEle.removeClass('icon-xia').addClass('icon-shang')
        //         : iEle.removeClass('icon-shang').addClass('icon-xia');
        // },
        /*
        ** 查询
        */
        searchEvt() {
            let that = this;
            that.currentPage = 1;
            that.getDeptData();
        },
        // 获取单位列表
        getDeptData() {
            let that = this, 
                url = '/dept/getDeptPage',
                param = {
                    adminDiv: that.xzqhVal[that.xzqhVal.length - 1]=='all'?'': that.xzqhVal[that.xzqhVal.length - 1],//行政区划
                    adminDivName: "",
                    supName: that.supName.trim(),//上级单位
                    deptName: that.deptName.trim(),//单位名称
                    pageNum: that.currentPage,  
                    pageSize: that.pageSize,  
                };       
            unit.ajaxObjPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data,
                    rows = data.rows;//列表数据
                    that.total = data.total;
                    that.currentPage = data.pageNum;
                if(res.flag) {
                    that.deptData = [];
                    for(let i in rows) {
                        that.$set(that.deptData, i, rows[i]); 
                    }
                }else {
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        deptShortNameFill(val){
            let that = this;
            that.deptShortNameEmpty ? that.deptFormData.deptShortName = val : that.deptFormData.deptShortName = that.deptFormData.deptShortName;                    
        },
        /*
         * 编辑、新增单位
         */
        editDeptEvt(id,row) {
            let that = this,
                url,
                supAdminDiv;
            that.curId = id;
            that.getDictionarys();//单位类型字典值
            // that.xzqhVal = [];
            that.deptFormData.adminDiv =[];//行政区划
            that.getXzqhTreeData('2');//行政区划
            
            if(id) {  // 根据id获取数据  编辑
                url = '/dept/getDeptDetail';
                unit.ajaxMerPost('/znsj-web' + url, {
                    id: id
                },function(res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if(res.flag) {
                        setTimeout(function() {
                            for(var key in data) {
                                if(key!='adminDiv'){
                                    that.$set(that.deptFormData,key,data[key]);
                                    // if(key == 'supComCode'){
                                    //     data[key] ? that.$set(that.deptFormData,key,data[key].split(',')) : that.deptFormData[key]=[];
                                    // }
                                }else{
                                    supAdminDiv = row.supAdminDiv;
                                    // that.deptFormData.adminDiv = [];
                                    that.xzqhChange = false;
                                    if(supAdminDiv.length != 0){
                                        that.deptFormData.adminDiv.push(supAdminDiv[0].value);
                                        that.xzqhFlag = JSON.parse(JSON.stringify(supAdminDiv));
                                        // for(let i=0;i<supAdminDiv.length;i++){
                                        //     that.deptFormData.adminDiv.push(supAdminDiv[i].value);
                                        // }
                                        // that.xzqhFlag = JSON.parse(JSON.stringify(that.deptFormData.adminDiv));
                                    }else{
                                        that.deptFormData.adminDiv = [];
                                    }
                                }
                            }
                            if(that.deptFormData.sortNo){
                                that.deptFormData.sortNo = that.deptFormData.sortNo;
                            }else{
                                that.deptFormData.sortNo = '';
                            }
                            if(!that.deptFormData.deptShortName && !that.deptFormData.deptName){
                                that.deptShortNameEmpty = true
                            }else{
                                that.deptShortNameEmpty = false;
                            }

                            // 上级单位字典项
                            that.getsupCodeData('1'); 
                            // 上级主管单位
                            that.getsupCodeData('2');
                            setTimeout(()=>{
                                if(that.deptFormData.supName){
                                    that.superiorDeptSec = [];
                                    that.superiorDeptSec =[{label:that.deptFormData.supName,value:that.deptFormData.supCode}]
                                    that.supCodeTotal= 1;
                                }
                                if(that.deptFormData.supComName){
                                    that.superiorCompetentDeptSec = []
                                    that.superiorCompetentDeptSec = [{label:that.deptFormData.supComName,value:that.deptFormData.supComCode}];
                                    that.supComCodeTotal= 1;
                                }
                            },0)
                            
                            // if(that.deptFormData.supComName){
                            //     let supComNameArr = [];
                            //     that.superiorCompetentDeptSec = []
                            //     supComNameArr = that.deptFormData.supComName.split(',');
                            //     for(let i = 0; i<supComNameArr.length;i++){
                            //        that.superiorCompetentDeptSec[i]={};
                            //        that.superiorCompetentDeptSec[i].label = supComNameArr[i];
                            //        that.superiorCompetentDeptSec[i].value = that.deptFormData.supComCode[i];
                            //     }
                            //     that.supComCodeTotal = supComNameArr.length;
                            // }else{
                            //     // 上级主管单位
                            //     that.getsupCodeData('2');
                            // }
                            },30);
                    }else {
                        that.$Message.error(data.errMsg || '数据加载失败！'); 
                    }
                },function(error) {
                    that.$Message.error(error.errMsg||'数据加载失败！');
                }, that);
                that.deptAddVis = true;
                that.deptlTitle = '编辑单位';
            }else {
                that.deptlTitle = '新增单位';
                that.deptAddVis = true;
                that.clearFormData();
                that.deptShortNameEmpty = true;
                // 上级单位字典项
                that.getsupCodeData('1'); 
                // 上级主管单位
                that.getsupCodeData('2');
            }
        },
        /*
         * 清空表单数据
         */
        clearFormData() {
            let that = this;
            // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
            if (that.$refs['deptForm'] !== undefined || that.$refs.deptForm !== undefined) {
                that.$refs['deptForm'].resetFields(); 
                that.xzqhFlag = [];
                that.deptFormData.adminDiv = [];//行政区划
                that.deptFormData.deptName = '';//单位名称
                that.deptFormData.deptShortName = '';//单位简称
                that.deptFormData.deptCode = '';//单位编码
                that.deptFormData.orgCode = '';//组织机构编码
                that.deptFormData.socialCreditCode = '';//统一社会信用代码
                that.deptFormData.supCode = '';//上级单位
                that.deptFormData.supName = '';
                // that.deptFormData.supComCode = [];//上级主管单位
                that.deptFormData.supComCode ='';//上级主管单位
                that.deptFormData.supComName ='';
                that.deptFormData.sortNo = '';//排序
                that.deptFormData.deptType = '';//单位类型
                that.deptFormData.deptDsc = '';//单位描述
            }
        },
         /*
         * 保存单位
         */
        saveFormData(formName) {
            let that = this,
                url,
                param;
            that.$refs[formName].validate((valid) => {
                if(!valid) {
                    return;
                }
                let that = this;
                url = that.curId ? '/dept/updateDept' : '/dept/addDept';
                param = JSON.parse(JSON.stringify(that.deptFormData));
                param.adminDiv = that.deptFormData.adminDiv[that.deptFormData.adminDiv.length-1];
                param.sortNo = param.sortNo==''? 0:param.sortNo;
                that.$delete(param,"adminDivName");
                that.saveJsonType(url, param); 
            });
        },
         /*
         * 保存数据json字符串形式 编辑
         * id: 记录id
         * type (string, optional): 事件类型：1:事项 2：一件事
         */

        saveJsonType(url, param) {
            let that = this;
            that.isDisable = true;
            unit.ajaxPost('/znsj-web' + url ,param).then(function(res){
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(data.flag) {
                    that.$Message.success(data.data || '保存成功！');
                    that.deptAddVis = false;
                    // 清空表单数据
                    that.clearFormData();
                    // 刷新数据
                    that.getDeptData();
                }else {
                    that.$Message.error(data.errMsg || '信息保存失败!');
                }
                 that.isDisable = false;
            }).catch(function(error){
                that.$Message.error(error.errMsg || '数据加载失败！');
                that.isDisable = false;
            });
        },
        // 删除单位列表数据
        delDeptEvt(id){
            let that = this,
                idData,tips;
            that.curId = id;
            if(id){
                tips = '确定要删除这条记录吗?'
            }else{
                idData = that.deptSeldArr;
                if(idData.length == 0){
                    that.$Message.warning('请选择要删除的记录！');
                    return;
                }else{
                    tips = '确定删除选中的记录吗？'
                    that.curId = idData.join(',');
                }
            }
            that.$confirm(tips,'提示',{
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass:'fr ml10',
                type: 'warning'
            }).then(()=>{
                that.sureDelEvt();
               
            }).catch(()=>{
               
            });
        },
        // 确定删除
        sureDelEvt(){
            let that = this,
                url = "/dept/deleteDept",
                param = {
                    ids:that.curId
                };
            unit.ajaxMerPost('/znsj-web' + url , param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    // 刷新数据
                    that.getDeptData(); 
                    that.$Message.success(data.data || '删除成功！') 
                }else {
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);

        },
        /*
         * table复选框chang事件
         */ 
        tableSelChange(val) {
            let that = this;
            that.deptSeldArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.deptSeldArr.push(val[i].id);
                }
            }
        },
        // 分页*****************************************************
         /*
        ** 列表每页显示数据量变更
        */
        deptSizeChange: function (val) {
            let that = this;
            that.pageSize = val;
            that.currentPage = 1;
            that.getDeptData();
        },
        /*
        ** 列表页码变更
        */
        deptCurrentChange: function (val) {
            let that = this;
            that.currentPage = val;
            that.getDeptData();
        },
        // 下拉分页***********************************
        // 上级单位*****************
        // 页码变更
        supCodeCurrentChange:function(val){
            let that = this;
            that.supCodeCurrentPage = val;
            that.getsupCodeData("1");
        },
        // 搜索
        supCodeFilter:function(val){
            let that = this;
            // that.supCodeSearch = val;
            that.deptFormData.supName = val;
            that.deptFormData.supCode = val;
            that.getsupCodeData("1");
        },
        // 上级主管单位*****************
         // 页码变更
        supComCodeCurrentChange:function(val){
            let that = this;
            that.supComCodeCurrentPage = val;
            that.getsupCodeData("2")
        },
        // 搜索
        supComCodeFilter: function(val){
            let that = this;
            that.deptFormData.supComName = val;
            that.deptFormData.supComCode = val;
            that.getsupCodeData("2");
        },
        // 获取上级单位字典项
         getsupCodeData(type) {
            let that = this, 
                param,
                url = '/dept/getDeptDictInfoPage';
                if(type == '1'){//上级单位
                    param = {
                        pageNum: that.supCodeCurrentPage,
                        pageSize: that.supCodePageSize,
                        deptName: that.deptFormData.supName
                    };  
                }else if(type == '2'){//上级主管单位
                    param = {
                        pageNum: that.supComCodeCurrentPage,
                        pageSize: that.supComCodePageSize,
                        deptName: that.deptFormData.supComName
                    }; 
                    
                }
            unit.ajaxObjPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data,
                    rows = data.rows;//列表数据
                    if(type == '1'){//上级单位
                        that.supCodeTotal = data.total;
                        that.supCodeCurrentPage = data.pageNum;
                        if(res.flag) {
                            that.superiorDeptSec = [];
                            for(let i in rows) {
                                that.$set(that.superiorDeptSec, i, rows[i]); 
                            }
                        }else {
                            that.$Message.error(data.data || '数据加载失败！');
                        }
                    } if(type == '2'){//上级主管单位
                        that.supComCodeTotal = data.total;
                        that.supComCodeCurrentPage = data.pageNum;
                        if(res.flag) {
                            that.superiorCompetentDeptSec = [];
                            for(let i in rows) {
                                that.$set(that.superiorCompetentDeptSec, i, rows[i]); 
                            }
                        }else {
                            that.$Message.error(data.data || '数据加载失败！');
                        }
                    }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        // //多选下拉框 移除多选项
        // removeSupCom(val){
        //     let that = this;
        //     if(that.deptFormData.supComCode.length ==0){
        //         that.deptFormData.supComName = '';
        //         that.getsupCodeData("2");
        //     }
        // },
        // // 多选下拉框 下拉选项取消勾选
        // SupComChange(val){
        //     let that = this;
        //     if(val==''){
        //         that.deptFormData.supComName = '';
        //         that.getsupCodeData("2");
        //     }
        // },

        // 获取单位类型字典项
         // 获取字典项
        getDictionarys(){
            let that = this,
                url = '/dic/getDictionarys',
                param = {
                    pinYinType: 'DWLX'
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    that.deptTypeSec = data;
                }else {
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);

        },


        /*
        ** 初始化
        */
        init() {
            let that = this;
            // 获取行政区划
            that.getXzqhTreeData('1');
            // 获取单位列表
            that.getDeptData();
        }
    },
    mounted() {
        this.init();
    }
 }
 </script>
 
 <style lang="less">
    #department{
        overflow: auto;
        height: 100%;
        padding: 0 20px 0 20px;
        background-color: #edf0f6;
        .main-wrap {
            padding: 20px 20px 15px 20px;
            background-color: #fff;
        }
        
        .ivu-select-dropdown{
            z-index:9000!important;
        }
        .common-width {
            width: 67%;
        }
        .bwidth {
            width: 100%;
        }
        .label-width{
            width: 72px;
            text-align: right;
        }
        // 更多
        .higher-search-a {
            margin: 0 15px 0 10px;
        }
        .el-button--primary {
            color: #fff;
            background-color: #2d8cf0;
            border-color: #2d8cf0;
        }
        // 新增删除按钮
        .btn-search-wrap {
            .btn-del{
                background: #ed3f14;
                border-color:#ed3f14;
                color: #fff;
            }
        }
        .el-table {
            border-top:1px solid #ddd;
            border-left:1px solid #ddd;
            border-right:1px solid #ddd;
            // font-size: 14px !important;
            color: #515a6e;
            // 超出截断
            .el-tooltip>.cell{
                white-space: nowrap;
                min-width: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        // 弹框样式
        .el-dialog__body {
            padding: 30px 0;
            .el-select {
                width: 100%;
            }
            .half-width{
                width: 50%!important;
                margin-right: 5px;
            }
            .el-checkbox{
                margin-left: 30px;
            }
            .el-textarea__inner{
                height: 100px;
            }
            .el-textarea textarea{
                resize: none;
            }
        }
         .el-dialog__header {
            border-bottom: 1px solid #ddd;
        }
        .el-button.is-disabled{
            cursor: pointer;
        }
        .selectPage {
            .el-pagination__jump {
                margin-left: 10px;
            }
        }
        .selectPage.el-pagination .btn-next,.selectPage.el-pagination .btn-prev{
            padding: 0;
        }
        // 行政区划
        .ivu-cascader-not-found .ivu-select-dropdown {
            width: inherit!important;
        }
        // 下拉框最大宽度
        .select-page-wrap .el-select-dropdown{
            width: 308px;
        }
        // 下拉框分页
        .selectPage .el-input__inner {
            cursor: text;
            padding: 0 3px;
        }
        // 弹框按钮样式覆盖
        .footer {
            padding:10px 30px 0 0;
            // height: 50px;
            background: #fff;
            text-align: right;
            line-height: 50px;
            border-top: 1px solid #ddd;
        }
        
    }
 </style>
 
 