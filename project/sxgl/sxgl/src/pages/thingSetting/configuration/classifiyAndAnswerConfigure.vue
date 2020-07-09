/*
* @Author: gaoxiong
* @Date: 2018-10-22
* 一件事收件配置-分类配置
*/
<template>
  <div id="classConfigure">
    <!-- 新增，删除按钮 -->
    <!--<div class="icon-btns">
      <el-button type="text" size="large" icon="el-icon-plus" @click="addEvt"></el-button>
      <el-button type="text" size="large" icon="el-icon-delete" @click="delEvt"></el-button>
    </div>-->
    <!-- 表格数据显示 -->
    <!-- 事项列表start -->
    <div class="list-wrap mt15" style="padding-left: 0px; padding-right: 0px">
      <el-table :data="receiptConfigData" :row-class-name="getRowClass" @selection-change="selectOne"
                style="width: 100%; " tooltip-effect="light">  <!-- font-size: 16px; -->
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <!-- 展开项 -->
        <el-table-column type="expand" prop="classifyAnsDtos" label="展/收" width="80" align="center">
          <template scope="scope">
            <el-table :data="scope.row.classifyAnsDtos" tooltip-effect="light" border>
              <el-table-column align="left" prop="answerName" label="答案名称" width="210" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="defaultSelectTxt" label="是否选中" show-overflow-tooltip></el-table-column>
              <el-table-column align="left" prop="detail" label="说明" show-overflow-tooltip></el-table-column>

              <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope">
                  <el-button type="text" size="large"
                             @click="classifyAnsSort(scope.row, '1')">上移</el-button>
                  <el-button type="text" size="large"
                             @click="classifyAnsSort(scope.row, '0')">下移</el-button>
                  <el-button type="text" size="large"
                             @click="editDialogChild(scope.$index, scope.row)">编辑</el-button>
                  <el-button type="text" size="large"
                             @click="delEvtChild(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 展开项结束 -->
        <el-table-column align="left" prop="classifyName" label="分类名称" width="210" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" prop="isMultiText" label="选项" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="left" prop="detail" label="说明" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="large"
                       @click="classifySort(scope.row, '1')">上移</el-button>
            <el-button type="text" size="large"
                       @click="classifySort(scope.row, '0')">下移</el-button>
            <el-button type="text" size="large"
                       @click="addEvtChild(scope.$index, scope.row)">添加答案</el-button>
            <el-button type="text" size="large"
                       @click="editDialog(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="large"
                       @click="delEvtOne(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   添加分类弹框  编辑 -->
      <el-dialog :title="modelTitle" :visible.sync="addModal" width="50%" center>
        <el-form :model="formItem" :rules="ruleValidate" ref="formValidate" label-width="100px">
          <el-form-item label="分类名称" prop="classifyName">
            <el-input v-model="formItem.classifyName" maxLength=50 autocomplete="off" @change="(val)=>changeInput(val, 'classifyName')"></el-input>
          </el-form-item>
          <el-form-item label="选项" prop="isMulti">
            <el-select v-model="formItem.isMulti">
              <el-option label="单选" value="0"></el-option>
              <el-option label="多选" value="1"></el-option>
              <el-option label="全选" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" prop="detail">
            <el-input type="textarea" maxLength=50 v-model="formItem.detail"  @change="(val)=>changeInput(val, 'detail')" @keyup.enter="getInputEvt" @input="getInputEvt($event)"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm('formValidate',modelTitle)">确 定</el-button>
          <el-button size="small" @click="addModal = false">取 消</el-button>
        </div>
      </el-dialog>

      

      <!-- 新增子分类弹框 编辑子分类 -->
      <el-dialog :title="modelTitleChild" :visible.sync="addModalChild" width="50%" center>
        <el-form :model="formItemChild" :rules="ruleValidate" ref="formValidateChild" label-width="100px">
          <el-form-item label="答案名称" prop="answerName">
            <el-input v-model="formItemChild.answerName" maxLength=50 autocomplete="off" @change="(val)=>changeChildInput(val, 'answerName')"></el-input>
          </el-form-item>
          <el-form-item label="是否选中" prop="defaultSelect">
            <el-radio v-model="formItemChild.defaultSelect" label="1">是</el-radio>
            <el-radio v-model="formItemChild.defaultSelect" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="说明" prop="detail">
            <el-input type="textarea" maxLength=50 v-model="formItemChild.detail" @change="(val)=>changeChildInput(val, 'detail')" @keyup.enter="getChildInputEvt" @input="getChildInputEvt($event)"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"  aligin="right" class="dialog-footer">
          <el-button size="small" type="primary" @click="childSubmitForm('formValidateChild', modelTitleChild)">确 定</el-button>
          <el-button size="small" @click="addModalChild = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 批量新增答案 -->
      <el-dialog :title="batchAddTitle" :visible.sync="batchAddModal" width="900px" custom-class="batch-dialog" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChildEvt">
        <!-- :before-close="sureChildEvt" -->
        <div class="batch-list-wrap">
            <el-table :data="batchObj.batchAnswerData">
                <el-table-column class="font-max" align="left" label="答案名称">
                    <template slot-scope="scope">
                        <span class="item-text" v-if="scope.row.status == '1'">{{scope.row.answerName}}</span>
                        <el-input class="" v-if="batchObj.batchAnswerData[scope.$index].status == '0'" v-model="scope.row.answerName" placeholder="请输入" maxlength="50" @change="(val)=>changeBatchInput(val,scope.$index,'answerName')"></el-input>
                    </template>
                </el-table-column>

                <el-table-column class="font-max" align="center" label="是否选中">
                    <template slot-scope="scope">
                        <span class="item-text" v-if="scope.row.status == '1'">{{scope.row.defaultSelectTxt}}</span>
                        <el-select v-model="scope.row.defaultSelect" placeholder="请选择" v-if="scope.row.status == '0'">
                            <el-option
                                v-for="item in defaultSelectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column align="left" label="说明" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="item-text" v-if="scope.row.status == '1'">{{scope.row.detail}}</span>
                    <el-input class="" v-if="scope.row.status == '0'" v-model="scope.row.detail" placeholder="请输入" maxlength="50" @change="(val)=>changeBatchInput(val,scope.$index,'detail')"></el-input>    
                  </template>
                </el-table-column>

                <el-table-column class="font-max" align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button class="font-max" type="text" size="small" @click="classifyAnsSort(scope.row, '1', 'child')" :disabled="scope.row.status == '0' ? true : false">上移</el-button>
                        <el-button class="font-max" type="text" size="small" @click="classifyAnsSort(scope.row, '0', 'child')" :disabled="scope.row.status == '0' ? true : false">下移</el-button>
                        <el-button class="font-max" type="text" size="small" @click="editBatchAnsEvt(scope.row, scope.$index)" v-if="scope.row.status == '1'">编辑</el-button>
                        <el-button class="font-max" type="text" size="small" @click="editBatchAnsEvt(scope.row, scope.$index)" v-if="scope.row.status == '0'">保存</el-button>
                        <el-button class="font-max" type="text" size="small" @click="delBatchAnsEvt(scope.row, scope.row.isNew)" :disabled="scope.row.isNew == '0' &&scope.row.status == '0' ? true : false">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="btn-add-wrap">
                <Button type="dashed" size="large" icon="md-add" @click="addBatchAnsEvt">增加</Button>
            </div>
        </div>
        <div class="footer dialog-footer">
          <el-button type="primary" size="small" @click="sureChildEvt">确 定</el-button>
          <el-button size="small" @click="cancelChildEvt">取 消</el-button>
        </div>
      </el-dialog>
       
    </div>
  </div>
</template>
<script>
  import util from "@/api";

  export default {
    data() {
      return {
        id: this.$parent.matterStageId,//阶段id
        matterCode: this.$parent.matterCode/*'sjbma_001'*/,
        version: this.$parent.matterVersion/*'1.0'*/,
        titles: this.$parent.matterTitles,
        modelTitle: '新增分类',
        modelTitleChild: '新增答案',
        //字典类型-0新增 1编辑
        isTypeAdd: 0,
        //新增子分类弹框
        addModalChild: false,
        receiptConfigData: [],
        // 选中的数据
        flagData: [],
        // 选择框的数据源
        isMulti: [{
          value: '0',
          label: '单选'
        }, {
          value: '1',
          label: '多选'
        }, {
          value: '2',
          label: '全选'
        }],
        // 添加分类弹出框
        addModal: false,
        // 分类弹框数值绑定
        formItemChild: {
          classifyCode: '',
          answerName: '',
          detail: ''
        },
        // 分类弹框校验
        ruleValidate: {
          // 分类名称
          classifyName: [{
            required: true,
            message: '您尚未输入分类名称',
            trigger: 'change'
          },{
            max: 50,
            message: '长度最大不能超过50',
            trigger: 'change'
          }],
          // 分类名称
          answerName: [{
            required: true,
            message: '您尚未输入分类名称',
            trigger: 'change'
          },{
            max: 50,
            message: '长度最大不能超过50',
            trigger: 'change'
          }],
          // 选项
          isMulti: [{
            required: true,
            message: '选项必填',
            trigger: 'change'
          }],
          // 说明
          detail: [{
            type: 'string',
            max: 50,
            message: '长度最大不能超过50',
            trigger: 'change'
          }],
          defaultSelect: [{
            required: true,
            message: '请选择是否选中',
            trigger: 'change'
          }],
        },
        // 分类弹框数值绑定
        formItem: {
          id: '',
          classifyName: '',
          isMulti: '',
          detail: ''
        },
        //三个删除对话框
        // delEvtDialogModal: false,
        delEvtIds: '',
        // delEvtOneDialogModal: false,
        delEvtOneId: '',
        // delEvtChildDialogModal: false,
        delEvtChildId: '',

        // 批量新增  ---- 参数
        batchAddTitle: '新增答案', 
        batchAddModal: false,
        curClassifyCode: '',
        defaultSelectOptions: [{
            value: '0',
            label: '否'
        },{
            value: '1',
            label: '是'
        }],
        // batchAnswerData: [],
        notSaveChildData: [],
        notSaveFlag: false,
        batchObj: {
          batchAnswerData: []
        }
      }
    },
    methods: {
      /**
       * 兼容ie9 超过50 不自动阶段问题
       */
      getInputEvt(val) {
        let that = this;
        if(val && val.length > 50) {
            val = val.substring(0,50);
        }
        that.formItem.detail = val;
      },
      /**
       * 兼容ie9 超过50 不自动阶段问题
       */
      getChildInputEvt(val) {
        let that = this;
         if(val && val.length > 50) {
            val = val.substring(0,50);
        }
        that.formItemChild.detail = val;
      },
      /**
       *  修复ie记忆问题
       *  添加分类
       */
      changeInput(val, key) {
          let that = this;
          if(key == 'detail' && val && val.length > 50) {
              val = val.substring(0,50);
          }
          that.formItem[key] = val == '' ? '' : val;

      },
      /**
       *  修复ie记忆问题
       *  添加子分类
       */
      changeChildInput(val, key) {
          let that = this;
          if(key == 'detail' && val && val.length > 50) {
              val = val.substring(0,50);
          }
          that.formItem[key] = val == '' ? '' : val;
      },
      /**
       *  修复ie记忆问题
       *  批量新增答案
       */
      changeBatchInput(val, index, key) {
        let that = this;
        that.batchObj.batchAnswerData[index][key] = val == '' ? '' : val;

      },
      /*
       * 新增答案 -编辑/保存
       */
      editBatchAnsEvt(row, index) {
        // this.modelTitleChild = '编辑子分类';
        // this.addModalChild = true;
        // // 信息回填
        // this.formItemChild = Object.assign({}, row);
        // this.formItemChild.id = row.id;
        let that = this,
            data = that.batchObj.batchAnswerData[index];
        if(row.status == '1') {
          if(!that.notSaveFlag) {
              that.$set(data, 'status', '0');
              that.batchObj.batchAnswerData.splice(index, 1, data);
              that.notSaveChildData = data;
              that.notSaveFlag = true;
          }else {
              that.$Message.warning('有尚未保存的数据');
              return;
          }
        }else if(row.status == '0'){
          let addDto = {},
              updateDto = {};
            if(!row.answerName) {
                that.$Message.warning('请填写答案名称！');
                return;
            }
          if (row.isNew == '1') {
                addDto = {
                  //分类编码
                  classifyCode: row.classifyCode,
                  //事项编码
                  situationMattCode: that.matterCode,
                  objectType: '2',//1:事项 2:一件事
                  // 事项版本
                  situationMattVersion: that.version,
                  // 子类名称
                  answerName: row.answerName,
                  //  描述
                  detail: row.detail,
                  //是否选中
                  defaultSelect: row.defaultSelect
                }
                //新增子分类
                this.typeSave('/qxpz/classify/addClassifyAns', addDto, 'addBatchAnswer');
            } else {
                //编辑子分类
                updateDto = {
                  detail: row.detail,
                  id: row.id,
                  answerName: row.answerName,
                  defaultSelect: row.defaultSelect
                }
                //编辑子分类
                that.typeSave('/qxpz/classify/updateClassifyAns', updateDto, 'addBatchAnswer');
            }
        }
      },
       /*
       * 新增答案 -删除
       */
      delBatchAnsEvt(row,index) {
          let that = this,
              url = '/qxpz/classify/delAns?id=' + row.id;
          that.$confirm('确定删除这条记录', '提示', {
                cancelButtonText: '取 消',
                confirmButtonText: '确 定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
              if(row.isNew == '1') {
                that.batchObj.batchAnswerData.splice(that.batchObj.batchAnswerData.length-1,1);
                that.notSaveFlag = false;
                that.notSaveChildData = [];
              }else {
                that.delEvtOk(url, '3');
              }   
            }).catch(() => { 
            });
      },
      /*
       * 新增答案 -新增
       */
      addBatchAnsEvt() {
        let that = this;
          if(!that.notSaveFlag) {
              that.notSaveChildData = [{
                classifyCode: that.curClassifyCode,
                answerName: '',
                defaultSelect: '0',
                detail: '',
                status: '0',
                isNew: '1'
              }];
              that.batchObj.batchAnswerData.push(that.notSaveChildData[0]);
              that.notSaveFlag = true;
          }else {
              that.$Message.warning('有尚未保存的数据');
          } 
      },
      /*
       * 获取答案
       * type: 1 说明是上移、下移、删除
       */
      getAnswerData(type) {
        let that = this;
        util.ajaxMerPost('/qxpz/classify/getAns', {
          matterCode: that.matterCode,
          version: that.version,
          objectType: '2',
          classifyCode: that.curClassifyCode
        },function (res) {
            let data = res.data;
            that.batchObj.batchAnswerData = data;
            for(let i = 0; i < that.batchObj.batchAnswerData.length; i++) {
                that.batchObj.batchAnswerData[i].status = '1';
                that.batchObj.batchAnswerData[i].isNew = '0';
            }
            if(type == '1' && that.notSaveChildData.length > 0) {
              that.batchObj.batchAnswerData.push(that.notSaveChildData[0]);
            }
        },
        function (res) {
            that.$Message.warning('数据加载失败');
        }, that);
      },
      /*
       * 答案 取消
       */
      cancelChildEvt() {
        let that = this;
        that.sureChildEvt();
      },
      /*
       * 答案 确定
       */
      sureChildEvt() {
        let that = this;
        if(that.notSaveFlag) {
          that.$Message.warning('有尚未保存的数据');
          return;
        }else {
          that.batchAddModal = false;
          that.batchObj.batchAnswerData.splice(that.batchObj.batchAnswerData.length - 1, 1);
          that.notSaveChildData = [];
          that.notSaveFlag = false;
          that.getMatter();
        }
      },

      // 编辑事项
      editDialog(index, row) {
        this.modelTitle = '编辑分类';
        this.addModal = true;
        // 信息回填
        this.formItem = Object.assign({}, row);
        this.formItem.id = row.id;
      },
      // 编辑子事项
      editDialogChild(index, row) {
        this.modelTitleChild = '编辑答案';//编辑子分类
        this.addModalChild = true;
        // 信息回填
        this.formItemChild = Object.assign({}, row);
        this.formItemChild.id = row.id;
      },
      // 新增事项
      addEvt() {
        this.modelTitle = '新增分类';
        this.addModal = true;
        // 清空数据
        this.$nextTick(() => {
          this.$refs.formValidate.resetFields();
          this.formItem = {};
        });
      },
      addEvtChild(index, row) {
        let that = this;
        that.batchAddModal = true;
        that.$nextTick(() => {
            that.batchObj.batchAnswerData = [];
            that.curClassifyCode = row.code;
            that.batchObj.batchAnswerData = row.classifyAnsDtos;
            for(let i = 0; i < that.batchObj.batchAnswerData.length; i++) {
                that.batchObj.batchAnswerData[i].status = '1';
                that.batchObj.batchAnswerData[i].isNew = '0';
            }
            that.notSaveChildData = [];
            that.notSaveFlag = false;
        });

        // this.modelTitleChild = '添加答案';
        // this.addModalChild = true;
        // // 清空数据
        // this.$nextTick(() => {
        //   this.$refs.formValidateChild.resetFields();
        //   this.formItemChild = {};
        //   this.formItemChild.classifyCode = row.code;
        // });
      },
      // 子事项新增弹框
      childSubmitForm(formName, title) {
        let addDto = {},
          updateDto = {};
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (title == '新增答案') {
              addDto = {
                //分类编码
                classifyCode: self.formItemChild.classifyCode,
                //事项编码
                situationMattCode: self.matterCode,
                objectType: '2',//1:事项 2:一件事
                // 事项版本
                situationMattVersion: self.version,
                // 子类名称
                answerName: self.formItemChild.answerName,
                //  描述
                detail: self.formItemChild.detail,
                //是否选中
                defaultSelect:  self.formItemChild.defaultSelect
              }
              //新增子分类
              this.typeSave('/qxpz/classify/addClassifyAns', addDto, 'addModalChild');
            } else {
              //编辑子分类
              updateDto = {
                detail: self.formItemChild.detail,
                id: self.formItemChild.id,
                answerName: self.formItemChild.answerName,
                defaultSelect: self.formItemChild.defaultSelect
              }
              //编辑子分类
              this.typeSave('/qxpz/classify/updateClassifyAns', updateDto, 'addModalChild');
            }
          }
        });
      },
      // 新增or编辑提交事件
      submitForm(formName, title) {
        let addDto = {},
          updateDto = {};
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (title == '新增分类') {
              addDto = {
                objectVersion: self.version,
                isMulti: self.formItem.isMulti,
                classifyName: self.formItem.classifyName,
                objectCode: self.matterCode,
                type: '2', //分类1：事项 2：一件事
                detail: self.formItem.detail,
                subStageCode: self.id
              }
              //新增
              this.typeSave('/qxpz/classify/addClassify', addDto, 'addModal');
            } else {
              //编辑
              updateDto = {
                detail: self.formItem.detail,
                id: self.formItem.id,
                isMulti: self.formItem.isMulti,
                classifyName: self.formItem.classifyName
              }
              //编辑
              this.typeSave('/qxpz/classify/updateClassify', updateDto, 'addModal');
            }
          }
        });
      },
      //事项新增or编辑
      typeSave(url, data, option) {
        let self = this;
        util.ajaxObjPost(url, data, function (res) {
            self.$Message.success(res.data);
            // 刷新父页面列表
            setTimeout(function () {
              if(option == 'addBatchAnswer') {
                self.notSaveFlag = false;
                self.notSaveChildData = [];
                self.getAnswerData();
              }else {
                self.addModal = false;
                self.addModalChild = false;
                self.option = false;
                self.getMatter();
              }
            }, 500);
        }, function (res) {
          self.$Message.warning(res.data.errMsg);
        }, this);
      },
      //   有无子项
      getRowClass: function (row, rowIndex) {
        if (row.row.classifyAnsDtos == null) { // 无子项
          return 'row-expand-cover';
        }
      },
      //   请求事项表格数据
      getMatter() {
        let $this = this;
        let params = {
          id: $this.id,
          matterCode: $this.matterCode,
          objectType: '2',
          version: $this.version
        }
        util.ajaxMerPost('/qxpz/classify/getAllClassify', params,
          function (res) {
            $this.receiptConfigData = res.data;
            // let isMulti=res.data;
            let isMulti, receiptIsMulti;
            for (let i = 0, len = res.data.length; i < len; i++) {
              isMulti = res.data[i].isMulti;
              if (isMulti == '0') {
                $this.receiptConfigData[i].isMultiText = '单选';
              } else if (isMulti == '1') {
                $this.receiptConfigData[i].isMultiText = '多选';
              } else {
                $this.receiptConfigData[i].isMultiText = '全选';
              }
            }

          },
          function (res) {
          }, this);
      },
      // 选中
      selectOne(data, index) {
        // data就是选中的数据
        this.flagData = data;
      },
      //批量删除分类
      delEvt() {
        let ids = '',
            that = this;
        for (var i = 0, len = this.flagData.length; i < len; i++) {
          ids += this.flagData[i].id + ',';
        }
        ids = ids.substr(0, ids.length - 1)
        if (ids == '') {
          this.$Message.warning('请先选择数据');
          return false
        }
        // this.delEvtIds = ids;
        // this.delEvtDialogModal = true;
        that.$confirm('确定删除所选记录', '提示', {
            cancelButtonText: '取 消',
            confirmButtonText: '确 定',
            cancelButtonClass: 'fr ml10',
            type: 'warning'
        }).then(() => {
            let url = '/qxpz/classify/del?ids=' + ids;
            this.delEvtOk(url, '1');
        }).catch(() => { 
        });
      },
      // delEvtDialogOk() {
      //   let url = '/qxpz/classify/del?ids=' + this.delEvtIds;
      //   this.delEvtOk(url, '1');
      // },
      // 删除分类
      delEvtOne(index, row) {
        let that = this;
        that.$confirm('确定删除这条记录', '提示', {
            cancelButtonText: '取 消',
            confirmButtonText: '确 定',
            cancelButtonClass: 'fr ml10',
            type: 'warning'
        }).then(() => {
            let url = '/qxpz/classify/del?ids=' + row.id;
            that.delEvtOk(url, '2');
        }).catch(() => { 
        });

        // this.delEvtOneId = row.id;
        // this.delEvtOneDialogModal = true;
      },
      // delEvtOneDialogOk() {
      //   let url = '/qxpz/classify/del?ids=' + this.delEvtOneId;
      //   this.delEvtOk(url, '2');
      // },
      // 删除子分类
      delEvtChild(index, row) {
        let that = this;
        that.$confirm('确定删除这条记录', '提示', {
            cancelButtonText: '取 消',
            confirmButtonText: '确 定',
            cancelButtonClass: 'fr ml10',
            type: 'warning'
        }).then(() => {
            let url = '/qxpz/classify/delAns?id=' + row.id;
            that.delEvtOk(url, '3');
        }).catch(() => { 
        });
        // this.delEvtChildId = row.id;
        // this.delEvtChildDialogModal = true;
      },
      // delEvtChildDialogOk() {
      //   let url = '/qxpz/classify/delAns?id=' + this.delEvtChildId;
      //   this.delEvtOk(url, '3');
      // },
      //确认删除
      delEvtOk(url, type) {
        let self = this;
        util.ajaxObjPost(url, {}, function (res) {
          if (res.flag) {
            self.$Message.success('删除成功');
            // 刷新父页面列表
            setTimeout(function () {
              
              if (type == '1'){//批量删除分类
                // self.delEvtDialogModal = false;
                // self.getAnswerData('1');
                 self.getMatter();
                
              }
              if (type == '2'){//删除单个分类
                // self.delEvtOneDialogModal = false;
                self.getMatter();
              }
              if (type == '3'){//删除子分类
                // self.delEvtChildDialogModal = false;
                // 刷新答案子项
                self.getMatter();
                self.getAnswerData('1');
              }
            }, 500);
          } else {
            self.$Message.error('删除失败');
          }
        }, function (res) {
          self.$Message.error(res.data.errMsg);
        }, this);
      },
      //分类上下移
      classifySort(row, flag) {
        let self = this;
        util.ajaxMerPost('/qxpz/classify/classifySort', {
          id: row.id,
          flag: flag,
        }, function (res) {
          if (res.flag) {
            self.$Message.success('操作成功');
            // 刷新父页面列表
            self.getMatter();
           
          } else {
            self.$Message.error(res.errMsg);
          }
        }, function (res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        }, this);
      },
      //答案上下移
      classifyAnsSort(row, flag, type) {
        let self = this;
        util.ajaxMerPost('/qxpz/classify/classifyAnsSort', {
          id: row.id,
          flag: flag
        }, function (res) {
            self.$Message.success('操作成功');
            // 刷新父页面列表
            // self.getMatter();
            if(type == 'child') {
                // 刷新答案列表
                self.getAnswerData('1');
            }else {
              self.getMatter();
            }
           
        }, function (res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        }, this);
      }
    },
    created() {
      this.getMatter();
    },
  }

</script>
<style lang="less" rel="stylesheet/stylus">
  @import "../../../assets/styles/color.less";
  .v-modal {
      z-index: 999 !important;
  }
   .el-button {
      font-size: 14px !important;
    }
  #classConfigure {
    width: 100%;
    .btn-add-wrap {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        .ivu-btn {
          width: 100%;
          height: 100%;
        }
    }
    .el-form-item__content{
        text-align: left;
    }
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    .el-table{
      border: 1px solid #dcdee2;
      border-bottom: 0;
      td {
        padding: 4px 0;
      }
      .el-table__expanded-cell[class*=cell] {
          padding: 20px 50px!important;
      }
    }
    .icon-btns {
      margin-left: 90%;
      margin-bottom: 10px;
      .el-icon-plus, .el-icon-delete {
        font-size: 20px;
      }
    }
    .mt20 {
      padding: 0 15px 15px;
    }
    /* add */
    .el-icon-plus {
      font-size: 16px;
      color: #30e087;
    }
    /* 编辑 */
    .el-icon-edit {
      font-size: 16px;
      color: #e2a141;
    }
    /* 删除 */
    .el-icon-delete {
      color: #de8d78;
    }
  
    .ivu-table {
      font-size: 16px;
    }
    .row-expand-cover {
      td:first-child .el-table__expand-icon {
        visibility: hidden;
      }
    }

    // 弹框样式修改
    .el-dialog__body {
        // padding: 30px 0;
        border-bottom: 1px solid #ddd;
    }
    // 批量新增答案样式修改
    .batch-dialog {
        .el-dialog__body {
            padding: 30px 0 20px;
            .batch-list-wrap {
              padding: 0px 25px 20px;
            }
            .footer {
              padding: 5px 0px 0 0;
              background: #fff;
              text-align: right;
              line-height: 50px;
              border-top: 1px solid #ddd;
          }
        }
        .el-button--default {
          margin-right: 30px;
        }
    }

    .el-row {
        padding: 0 20px;
    }
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
        text-align: left;
    }
    
    .el-dialog__footer {
        padding: 15px 20px 15px;
        text-align: right;
    }
    
  }
  #delConDialog {
    .ivu-modal {
      width: 20%!important;
    }
    .ivu-modal-content {
      border-radius: 2px;
    }
    .ivu-modal-header {
      border-radius: 2px 2px 0 0;
      background: @baseColor;
      .ivu-modal-header-inner {
        color: #ffffff;
      }
    }
    .ivu-icon-ios-close {
      color: #ffffff;
    }
    .ivu-modal-footer{
      border-top: none;
    }
  }
  
</style>
