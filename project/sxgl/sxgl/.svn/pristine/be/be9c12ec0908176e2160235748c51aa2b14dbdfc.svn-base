/*
* @Author: gaoxiong
* @Date: 2018-10-29 13:06:00
* 事项配置—材料配置
*/
<template>
  <div id="issuesMaterialConfigure">
    <Table ref="table" :columns="columnsData" :data="dataList"></Table>
    <!--新增编辑框-->
    <Modal id="issuesMaterialConDialog" v-model="materialConDialogModal" :title="materialTitle" :mask-closable="false" :scrollable="true" @on-visible-change="onIssuesMaterialModalVisibleChange">
      <div>
        <Form :model="formItem" :rules="ruleValidate" ref="ruleValidate" :label-width="100">
          <h3 class="materialInfo borderBot">
            <a href="javascript:;">基本信息</a>
          </h3>
          <Row>
            <Col span="12">
            <FormItem label="环节名称" prop="linkCode">
              <Select v-model="formItem.linkCode" :transfer="true">
                <Option v-for="item in hjmcOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="原始材料名称" prop="originalMaterialName" class="oriMaterial-form-item">
              <Input v-model="formItem.originalMaterialName" placeholder="请输入原始材料名称" :maxlength="1200"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="原始材料编码" prop="orignalCode">
              <Input v-model="formItem.orignalCode" placeholder="请输入原始材料编码" :maxlength="50"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="材料名称" prop="matterialName">
              <Input v-model="formItem.matterialName" placeholder="请输入材料名称" :maxlength="200"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="必要性" prop="isNeed">
              <Select v-model="formItem.isNeed" :transfer="true">
                <Option v-for="item in needOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="材料形式" prop="materialForm" class="material-form-item">
              <CheckboxGroup v-model="materialForm" @on-change="materialFormChange">
                <Checkbox v-for="(item,index) in formOptions" :label="item.value" :key="item.value">{{item.label}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="材料类型" prop="type">
              <Select v-model="formItem.type" :transfer="true">
                <Option v-for="item in typeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="复印件份数" prop="copiesNum">
              <Input id="copiesNum" v-model="formItem.copiesNum" placeholder="请输入复印件份数"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="原件份数" prop="originalNum">
              <Input id="originalNum" v-model="formItem.originalNum" placeholder="请输入原件份数"></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="上传文件格式" prop="uploadFileFormats" class="uploadFile-form-item">
            <CheckboxGroup v-model="uploadFileFormats" @on-change="uploadFileFormatsChange">
              <Checkbox v-for="item in fileTypeOptions" :label="item" :key="item">{{item}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="11">
            <FormItem label="材料大小" prop="matterialSize">
              <Input v-model="formItem.matterialSize" placeholder="请输入材料大小"></Input>
            </FormItem>
            </Col>
            <Col span="1">
            <span style="padding-left: 10px;height: 30px; line-height: 30px;">MB</span>
            </Col>
          </Row>
          <Row>
            <Col span="9">
            <FormItem label="关联组" prop="asscGroupId">
              <Select v-model="formItem.asscGroupId" filterable ref="guanlian" :transfer="true">
                <Option v-for="item in asscGroupOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="3">
            <span class="asscGroupBtn" @click="openAssociationGroupModal()">关联组管理</span>
            </Col>
            <Col span="12">
            <FormItem label="材料来源" prop="source">
              <Input v-model="formItem.source" placeholder="请输入材料来源" :maxlength="50"></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="内容审查要点" prop="contentTxt">
            <Input class="font-min" v-model="formItem.contentTxt" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <FormItem label="附件上传">
            <span class="upload-extensions-tip">可上传Word、Excle、PDF文件，且不超过10M</span>
          </FormItem>
          <FormItem class="upload-wrap-all" label>
            <FormItem class="upload-item" prop="icon1">
              <vue-upload-web ref="upload" :url="uploadObj.cdnUrl" :form-data="uploadObj.cdnParams" :fileSingleSizeLimit="10240000" :accept="uploadObj.accept" :key-generator="keyGenerator" @progress="uploadProgress" @success="uploadSuccessFJ" @before="beforeUpload" @error="uploadError" @complete="handleComplete" upload-button=".upload-btn-one" :multiple="false"></vue-upload-web>

              <!--上传加号按钮-->
              <div class="upload-btn-one upload-view ivu-upload ivu-upload-drag">
                <div class="icon">
                  <i class="ivu-icon ivu-icon-md-cloud-upload"></i>
                  <span class="upload-name">内容审查附件</span>
                </div>
                <!-- <Icon type="md-cloud-upload" /> -->
              </div>

              <!--已经上传的附件-->
              <div class="elec-photo elec-photo11">
                <div class="file-list">
                  <a href="javascript:;">
                    <span class="file-name" :data-path="formItem.contentAttch" :title="formItem.contentAttchName">{{formItem.contentAttchName}}</span>
                    <i v-if="formItem.contentAttchName" class="icon-del" :data-path="formItem.contentAttch" @click="delFileEvt(formItem.contentAttchName,formItem.contentAttch,1)"></i>
                  </a>
                </div>
              </div>
            </FormItem>
            <FormItem class="upload-item" label prop="icon2">
              <vue-upload-web ref="upload" :url="uploadObj.cdnUrl" :form-data="uploadObj.cdnParams" :accept="uploadObj.accept" :fileSingleSizeLimit="10240000" :key-generator="keyGenerator" @progress="uploadProgress" @success="uploadSuccessSL" @before="beforeUpload" @error="uploadError" @complete="handleComplete" upload-button=".upload-btn-two" :multiple="false"></vue-upload-web>

              <div class="upload-btn-two upload-view ivu-upload ivu-upload-drag">
                <div class="icon">
                  <i class="ivu-icon ivu-icon-md-cloud-upload"></i>
                  <span class="upload-name">示例</span>
                </div>
              </div>

              <!-- <span class="upload-extensions-tip">
              （可上传10M内word、excel、pdf、ppt、压缩包格式附件）
              </span>-->
              <div class="elec-photo elec-photo11">
                <div class="file-list">
                  <a href="javascript:;">
                    <span class="file-name" :data-path="formItem.sampleUrl" :title="formItem.sampleUrlName">{{formItem.sampleUrlName}}</span>
                    <i v-if="formItem.sampleUrlName" class="icon-del" :data-path="formItem.sampleUrl" @click="delFileEvt(formItem.sampleUrlName,formItem.sampleUrl,3)"></i>
                  </a>
                </div>
              </div>
            </FormItem>
            <FormItem class="upload-item" label prop="icon3">
              <div class="upload-wrap">
                <vue-upload-web ref="upload" :url="uploadObj.cdnUrl" :form-data="uploadObj.cdnParams" :fileSingleSizeLimit="10240000" :accept="uploadObj.accept" :key-generator="keyGenerator" @progress="uploadProgress" @success="uploadSuccessKB" @before="beforeUpload" @error="uploadError" @complete="handleComplete" upload-button=".upload-btn-three" :multiple="false"></vue-upload-web>

                <div class="upload-btn-three upload-view ivu-upload ivu-upload-drag">
                  <div class="icon">
                    <i class="ivu-icon ivu-icon-md-cloud-upload"></i>
                    <span class="upload-name">空白表格</span>
                  </div>
                </div>

                <div class="elec-photo elec-photo11">
                  <div class="file-list">
                    <a href="javascript:;">
                      <span class="file-name" :data-path="formItem.blankForm" :title="formItem.blankFormName">{{formItem.blankFormName}}</span>
                      <i v-if="formItem.blankFormName" class="icon-del" :data-path="formItem.blankForm" @click="delFileEvt(formItem.blankFormName,formItem.blankForm,2)"></i>
                    </a>
                  </div>
                </div>
              </div>
            </FormItem>
          </FormItem>
          <!-- 扩展信息 -->
          <h3 class="materialInfo" :class="{'borderBot': !isShowExtendInfo}">
            <a href="javascript:;" @click="showExtendInfo">
              扩展信息
              <i class="iconfont" :class="{'icon-shang': isShowExtendInfo,'icon-xia': !isShowExtendInfo}"></i>
            </a>
          </h3>
          <div v-show="isShowExtendInfo">
            <Row>
              <Col span="12">
              <FormItem label="材料持有人">
                <Input v-model="formItem.possessor" placeholder="请输入材料持有人" :maxlength="500"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row class="clearfix">
              <Col span="20">
              <FormItem label="在线填表" prop="isOnline" class="ivu-form-item-required ivu-form-item-error">
                <RadioGroup v-model="isOnline" @on-change="isOnlineChange">
                  <Radio label="0" :disabled="isAdd==1 && formItem.isServerConfigured==1">不开启</Radio>
                  <Radio label="1" :disabled="isAdd==1 && formItem.isServerConfigured==1">开启</Radio>
                  <label v-show="isStart" class="ivu-radio-wrapper ivu-radio-group-item ivu-radio-wrapper-checked ivu-radio-default radio-tip">提示：只能添加一个打印表单模板和一个其它类型的表单模板</label>
                </RadioGroup>
              </FormItem>
              </Col>
              <div class="btn-wrap-auto" v-show="isStart">
                <span class="btn-sure font-min" @click="editMaterialTemplate({})" v-if="mterialTemplateData.length<2">新增</span>
                <span class="btn-sure font-min" v-if="mterialTemplateData.length>=2" style="color: #c0c4cc;cursor: not-allowed;">新增</span>
              </div>
            </Row>
            <el-table :data="mterialTemplateData" tooltip-effect="light" class="mterrialTable" v-show="isStart">
              <el-table-column class="font-max" align="center" label="表单名称">
                <template scope="scope">
                  <span :title="scope.row.billName">{{scope.row.billName}}</span>
                </template>
              </el-table-column>
              <el-table-column class="font-max" align="center" label="表单类型">
                <template scope="scope">
                  <span :title="scope.row.billTypeName">{{scope.row.billTypeName}}</span>
                </template>
              </el-table-column>
              <el-table-column class="font-max" align="center" label="表单模板">
                <template scope="scope">
                  <span :title="scope.row.billTemplateName">{{scope.row.billTemplateName}}</span>
                </template>
              </el-table-column>
              <el-table-column class="font-max" align="center" label="模板版本">
                <template scope="scope">
                  <span :title="scope.row.templateVersion">{{scope.row.templateVersion}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                  <el-button class="font-max" type="text" size="small" @click="editMaterialTemplate(scope.row, scope.$index)" :disabled="scope.row.dataServerId">编辑</el-button>
                  <el-button class="font-max" type="text" size="small" @click="delMaterialTemplate(scope.row, scope.$index, '')" :disabled="scope.row.dataServerId">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </Form>
      </div>
      <div slot="footer" class="dialog-footer">
        <Checkbox v-if="checkBoxVisiable" v-model="isCreateAnother">创建另一个</Checkbox>
        <el-button type="button" size="small" class="el-button el-button--primary" @click="okMaterialConDialog('ruleValidate')">
          <span>确定</span>
        </el-button>
        <el-button type="button" size="small" class="el-button el-button--default" @click="materialConDialogModal = false">
          <span>取消</span>
        </el-button>
      </div>
    </Modal>
    <!--关联组管理-->
    <Modal id="associationGroupModal" v-model="associationGroupModal" title="关联组管理" :mask-closable="false" :scrollable="true" @on-visible-change="onAssociationVisibleChange">
      <div>
        <div class="association-table-header ivu-table-header">
          <table style="width: 100%" cellspacing="0" cellpadding="0" border="0">
            <colgroup>
              <col>
              <col width="25%">
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div class="ivu-table-cell">
                    <span class>关联组名称</span>
                  </div>
                </th>
                <th class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <span class>操作</span>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <Form ref="associationGroup" :model="formDynamic" style="width: 100%">
          <FormItem class="association-form-item" v-for="(item, index) in formDynamic.associationGroupList" :key="index" :prop="'associationGroupList.' + index + '.groupName'" :rules="[{required: true, message: '请输入关联组名称', trigger: 'blur'},
            {max: 200, message: '长度最大不能超过200', trigger: 'change'}]">
            <Row>
              <Col v-if="item.status == 1" class="group-name">
              <span :title="item.groupName">{{item.groupName}}</span>
              </Col>
              <Col v-if="item.status != 1" style="width: 74%; display: inline-block">
              <Input type="text" v-model="item.groupName" placeholder="请输入" :maxlength="200"></Input>
              </Col>
              <Col class="editBtn">
              <span v-if="item.status == 1" @click="editAssociation(item, index)">编辑</span>
              <span v-if="item.status != 1" style="color: #c0c4cc;cursor: not-allowed;">编辑</span>
              <!-- <span v-if="item.status != 1" @click="editAssociation(item, index)">保存</span> -->
              <span style="margin-left: 10px" @click="deleteAssociation(item, index)">删除</span>
              </Col>
            </Row>
          </FormItem>
          <FormItem style="margin-top: 20px">
            <Row>
              <Col style="width: 100%">
              <Button type="dashed" size="large" long @click="addAssociation" icon="md-add">新增</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="button" size="small" class="el-button el-button--primary" @click="addAsscGroup()">
          <span>确定</span>
        </el-button>
        <el-button type="button" size="small" class="el-button el-button--default" @click="associationGroupModal = false">
          <span>取消</span>
        </el-button>
      </div>
    </Modal>

    <!-- 配置表单 -->
    <Modal id="materialTemplateModal" :title="modelTitle" v-model="modelFlag" width="980px" :close-on-click-modal="false" :show-ok="false" :show-cancel="false">
      <materialTemplateSet v-if="modelFlag" @saveMaterialTemplate="saveMaterialTemplate" :backData="backData" :matriCode="matriCode" :mterialTemplateData="mterialTemplateData"></materialTemplateSet>
    </Modal>

    <!-- 配置事项 -->
    <el-dialog :title="modelServerTitle" :visible.sync="modelServerFlag" width="1270px" :close-on-click-modal="false">
      <dataServerSetModel v-if="modelServerFlag" ref="modelServerFlag" @closeDialog="closeServerDialog" :param="serverParam"></dataServerSetModel>
    </el-dialog>
  </div>
</template>
<script>
// 公共工具方法
import Vue from "vue";
import util from "@/api/index";
import expandRow from "@/pages/issuesManagement/configuration/materialTableExpand.vue";
import dataServerSetModel from "@/components/serverSet/dataServerSetModel";
//新增模板
import materialTemplateSet from "@/pages/issuesManagement/configuration/materialTemplateSet.vue";
import vueUploadWeb from "@/components/upload/upload";
Vue.use(vueUploadWeb);

export default {
  components: {
    materialTemplateSet: materialTemplateSet,
    dataServerSetModel: dataServerSetModel,
    expandRow,
    "vue-upload-web": vueUploadWeb
  },
  data() {
    // 数值 0 - 10 验证方法
    let validateNum = (rule, value, callback) => {
      if (value) {
        let rule = /^(([1-9]|10){1})$/;
        if (!rule.test(value)) {
          callback(new Error("请输入1到10的数字"));
        } else {
          callback();
        }
      } else {
        if (rule.required) {
          if (rule.field == "copiesNum") {
            callback(new Error("请输入复印件份数"));
          }
          if (rule.field == "originalNum") {
            callback(new Error("请输入原件份数"));
          }
        } else {
          callback();
        }
      }
    },
      validateMaterSize = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入材料大小"));
        } else {
          let rule = /(^[1-4][0-9]$)|(^[5][0]$)|^(([0-9]|10){1})$/; // /^(([0-9]|10){1})$/;
          if (!rule.test(value)) {
            callback(new Error("请输入0到10的数字"));
          } else {
            callback();
          }
        }
      };
    return {
      moreNum: true, //防止频繁点击
      modelServerFlag: false,
      modelServerTitle: "数据服务配置",
      serverParam: {},
      // 新增模板模块start
      modelTitle: "新增模板",
      modelFlag: false,
      backData: {}, //返回参数
      mterialTemplateData: [], //表单配置数据源
      matriCode: "",
      isStart: false, //是否开启在线填表
      // 新增模板模块end

      checkBoxVisiable: false,
      materialList: [],
      id: this.$parent.param.id,
      version: this.$parent.param.matterVersion /*'1.0'*/,
      matterCode: this.$parent.param.matterCode /*'cssx1'*/,
      isParent: this.$parent.param.isParent, //1：父事项；0：子事项
      matterialId: "", // 当前编辑材料id
      isShowExtendInfo: false,
      columnsData: [
        {
          type: "expand",
          width: 39,
          render: (h, params) => {
            if (params.row.child) {
              return h(expandRow, {
                props: {
                  row: params.row.child,
                  editModal: this.editModal,
                  openDeleteModal: this.openDeleteModal,
                  serverReset: this.serverReset,
                  goServerConfig: this.goServerConfig
                }
              });
            }
          }
        },
        {
          title: "环节名称",
          key: "linkName",
          align: "center",
          width: 120
        },
        {
          title: "材料名称",
          key: "matterialName",
          align: "left",
          width: 180,
          render: (h, params) => {
            let classFlag = false;
            if (params.row.matterialNameTitle) {
              if (params.row.matterialNameTitle.length > 39) {
                classFlag = true;
              }
              return h("span", {
                attrs: {
                  title: params.row.matterialNameTitle
                },
                domProps: {
                  innerHTML: params.row.matterialName
                },
                class: {
                  "tip-title": classFlag
                }
              });
            } else {
              return h("span", {
                domProps: {
                  innerHTML: params.row.matterialName
                }
              });
            }
          }
        },
        {
          title: "原始材料名称",
          key: "orignalName",
          width: 240,
          render: (h, params) => {
            let classFlag = false;
            if (params.row.orignalNameTitle) {
              if (params.row.orignalNameTitle.length > 39) {
                classFlag = true;
              }
              return h("span", {
                attrs: {
                  title: params.row.orignalNameTitle
                },
                domProps: {
                  innerHTML: params.row.orignalName
                },
                class: {
                  "tip-title": classFlag
                }
              });
            } else {
              return h("span", {
                domProps: {
                  innerHTML: params.row.orignalName
                }
              });
            }
          }
        },
        {
          title: "材料类型",
          key: "typeTxt",
          width: 100,
          render: (h, params) => {
            if (params.row.orignalNameTitle) {
              return h("span", {
                attrs: {
                  title: params.row.typeTxt
                },
                domProps: {
                  innerHTML: params.row.typeTxt
                }
              });
            } else {
              return h("span", {
                domProps: {
                  innerHTML: params.row.typeTxt
                }
              });
            }
          }
        },
        {
          title: "必要性",
          key: "isNeedTxt",
          width: 100,
          align: "center"
        },
        {
          title: "服务配置",
          key: "isNeedTxt",
          align: "center",
          width: 131,
          render: (h, params) => {
            if (!params.row.child) {
              if (params.row.isServerConfigured == 0) {
                return h("div", [
                  h(
                    "a",
                    {
                      style: {
                        color: "#606266",
                        marginRight: "10px"
                      },
                      on: {
                        click: () => {
                          this.goServerConfig(params, false);
                        }
                      }
                    },
                    "未配置"
                  ),
                  h(
                    "span",
                    {
                      style: {
                        color: "#c0c4cc",
                        marginRight: "10px"
                      }
                    },
                    "重置"
                  )
                ]);
              } else {
                return h("div", [
                  h(
                    "a",
                    {
                      style: {
                        color: "#409EFF",
                        marginRight: "10px"
                      },
                      on: {
                        click: () => {
                          this.goServerConfig(params, true);
                        }
                      }
                    },
                    "已配置"
                  ),
                  h(
                    "a",
                    {
                      style: {
                        color: "#409EFF",
                        marginRight: "10px"
                      },
                      on: {
                        click: () => {
                          this.serverReset(params);
                        }
                      }
                    },
                    "重置"
                  )
                ]);
              }
            }
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            if (!params.row.child) {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.upSort(params);
                      }
                    }
                  },
                  "上移"
                ),
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.downSort(params);
                      }
                    }
                  },
                  "下移"
                ),
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.editModal(params);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF"
                    },
                    on: {
                      click: () => {
                        this.openDeleteModal(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.upSort(params);
                      }
                    }
                  },
                  "上移"
                ),
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.downSort(params);
                      }
                    }
                  },
                  "下移"
                )
              ]);
            }
          }
        }
      ],
      dataList: [],

      /*dialog相关数据*/
      materialConDialogModal: false,
      materialTitle: "新增材料",
      materialId: "",
      materialCode: "",

      // 回显请求数据信息
      formDataList: {},
      // 文件上传参数
      uploadObj: {
        cdnUrl: "/bog-matter-mgr/commer/upload",
        cdnParams: { flag: "1", isPreView: "1" },
        accept: {
          extensions: "xls,xlsx,doc,docx,pdf,wps",
          mimeTypes:
            "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-works,application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation,application/x-zip-compressed,application/octet-stream"
        }
      },
      // 材料形式 '电子件','原件','复印件'
      formOption: [],
      // 对象键值对的形式
      formOptions: [],
      // 材料类型 下拉框数据
      typeOptions: [],
      // 环节名称 字典数据源
      hjmcOptions: [],
      // 文件格式
      fileTypeOptions: [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "jpg",
        "jpeg",
        "png",
        "bmp",
        "pdf",
        "wps"
      ],
      // 必要性下拉数据
      needOptions: [],
      // 有无关联组
      asscGroupOptions: [
        /*{
          value: '',
          label: '无'
        }*/
      ],

      ruleValidate: {
        linkCode: [
          {
            required: true,
            message: "请选择环节名称",
            trigger: "change"
          }
        ],
        isOnline: [
          {
            required: false,
            message: "请选择在线填表",
            trigger: "change"
          }
        ],
        originalMaterialName: [
          {
            required: true,
            message: "请输入原始材料名称",
            trigger: "change"
          },
          {
            max: 1200,
            message: "长度最大不能超过1200",
            trigger: "change"
          }
        ],
        orignalCode: [
          {
            required: true,
            message: "请输入原始材料编码",
            trigger: "change"
          },
          {
            max: 50,
            message: "长度最大不能超过50",
            trigger: "change"
          }
        ],
        matterialName: [
          {
            required: true,
            message: "请输入材料名称",
            trigger: "change"
          },
          {
            max: 200,
            message: "长度最大不能超过200",
            trigger: "change"
          }
        ],
        copiesNum: [
          {
            required: false,
            validator: validateNum,
            trigger: "blur"
          }
        ],
        originalNum: [
          {
            required: false,
            validator: validateNum,
            trigger: "blur"
          }
        ],
        isNeed: [
          {
            required: true,
            message: "请选择必要性",
            trigger: "change"
          }
        ],
        matterialSize: [
          {
            required: true,
            validator: validateMaterSize,
            trigger: "blur"
          }
        ],
        asscGroupId: [
          {
            message: "请选择关联组",
            trigger: "change"
          }
        ],
        source: [
          {
            type: "string",
            max: 50,
            message: "长度最大不能超过50",
            trigger: "change"
          }
        ],
        contentTxt: [
          {
            type: "string",
            max: 500,
            message: "长度最大不能超过500",
            trigger: "change"
          }
        ]
      },
      // 表单数值绑定
      formItem: {
        originalMaterialName: "",
        matterialSize: 10,
        contentAttchName: "",
        blankFormName: "",
        sampleUrlName: "",
        type: "QTCL",
        linkCode: "", // 环节编码
        possessor: "" //材料持有人
      },
      isOnline: "0", //在线填表
      materialForm: [],
      uploadFileFormats: [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "jpg",
        "jpeg",
        "png",
        "bmp",
        "pdf",
        "wps"
      ],
      loading1: false,
      options1: [], //远程搜索数据
      isCreateAnother: true, //是否创建另一个
      isAdd: 0, //0:新增； 1:编辑
      ids: "", //删除的id
      //关联组管理
      associationGroupModal: false,
      formDynamic: {
        associationGroupList: []
      }
    };
  },
  methods: {
    //重置服务
    serverReset(obj, type) {
      if (obj.row.isOnline == 0) {
        //不开启
        this.serverParam.templateType = "5";
      } else {
        this.serverParam.templateType = "4"; //4
      }
      let _that = this,
        jsonObj = {
          dataTemplateId: null,
          linkId: obj.row.id,
          templateType: _that.serverParam.templateType
        };
      _that
        .$confirm("确定要清除已配置的服务吗？", "提示", {
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
          cancelButtonClass: "fr ml10",
          type: "warning"
        })
        .then(() => {
          util.ajaxObjPost(
            "/znsj-web/data/server/clean",
            jsonObj,
            function (res) {
              if (res.flag == true) {
                _that.getMatter();
              } else {
                _that.$Message.warning(res.errMsg || "请求数据失败");
              }
            },
            function (res) {
              _that.$Message.warning(res.data.errMsg || "请求数据失败");
            },
            _that
          );
        })
        .catch(() => { });
    },
    //服务配置
    goServerConfig(obj, flag) {
      this.serverParam.dataTemplateId = null;
      this.serverParam.linkId = obj.row.id;
      if (obj.row.isOnline == 0) {
        //不开启
        this.serverParam.templateType = "5";
        this.serverParam.tempAttrId = obj.row.id;
      } else {
        this.serverParam.templateType = "4"; //4
        this.serverParam.matriCode = obj.row.code;
        this.serverParam.matriVersion = obj.row.version;
      }
      this.serverParam.flag = flag;
      this.serverParam.name = "";
      this.modelServerFlag = true;
    },
    //关闭弹框
    closeServerDialog() {
      this.getMatter();
      this.modelServerFlag = false;
    },
    //在线填表选择事件
    isOnlineChange(val) {
      let that = this,
        delIds = "",
        isDel = false; //是否可删除
      $(that.mterialTemplateData).each(function (index, obj) {
        if (obj.dataServerId) {
          isDel = true;
        }
        delIds += obj.id + ",";
      });

      if (delIds) {
        delIds = delIds.substr(0, delIds.length - 1);
      }
      if (val == 0 && that.mterialTemplateData.length > 0) {
        if (!isDel) {
          that
            .$confirm("已配置的表单将被删掉，确定关闭吗？", "提示", {
              confirmButtonText: "确 定",
              cancelButtonText: "取 消",
              cancelButtonClass: "fr ml10",
              type: "warning"
            })
            .then(() => {
              that.isOnline = "0";
              that.isStart = false;
              that.delMaterialTemplate(delIds, 0, "all");
            })
            .catch(() => { 
              that.isOnline = "1";
            });
        } else {
          that.$Message.error("表单已被服务绑定，不可关闭");
        }
        setTimeout(() => {
          that.isOnline = "1";
        }, 100);
      } else if (val == 0 && that.mterialTemplateData.length == 0) {
        that.isStart = false;
      } else {
        that.isStart = true;
      }
    },
    //删除表单模板
    delMaterialTemplate(row, index, type) {
      let that = this,
        delIds = "";
      if (that.isAdd == 0) {
        if (type == "all") {
          that.mterialTemplateData = [];
          that.$Message.success("删除成功");
        } else {
          that
            .$confirm("确定要删除这条记录吗？", "提示", {
              confirmButtonText: "确 定",
              cancelButtonText: "取 消",
              cancelButtonClass: "fr ml10",
              type: "warning"
            })
            .then(() => {
              that.mterialTemplateData.splice(index, 1);
              that.$Message.success("删除成功");
            })
            .catch(() => { });
        }
      } else {
        if (row.dataServerId) {
          that.$Message.warning("表单已被服务绑定，不可关闭");
        } else {
          if (type == "all") {
            delIds = row;
            util.ajaxMerPost(
              "/znsj-web/matri/bill/delete",
              {
                ids: delIds
              },
              function (res) {
                res = typeof res === "string" ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                  that.$Message.success("删除成功");
                  if (type == "all") {
                    that.mterialTemplateData = [];
                  } else {
                    that.mterialTemplateData.splice(index, 1);
                  }
                }
              },
              function (res) {
                that.$Message.error(res.data.errMsg || "数据加载失败！！");
              },
              that
            );
          } else {
            delIds = row.id;
            that
              .$confirm("确定要删除这条记录吗？", "提示", {
                confirmButtonText: "确 定",
                cancelButtonText: "取 消",
                cancelButtonClass: "fr ml10",
                type: "warning"
              })
              .then(() => {
                util.ajaxMerPost(
                  "/znsj-web/matri/bill/delete",
                  {
                    ids: delIds
                  },
                  function (res) {
                    res = typeof res === "string" ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                      that.$Message.success("删除成功");
                      if (type == "all") {
                        that.mterialTemplateData = [];
                      } else {
                        that.mterialTemplateData.splice(index, 1);
                      }
                    }
                  },
                  function (res) {
                    that.$Message.error(res.data.errMsg || "数据加载失败！！");
                  },
                  that
                );
              })
              .catch(() => { });
          }
        }
      }
    },
    //前端保存表单模板
    saveMaterialTemplate(obj, flag) {
      if (flag) {
        if (!obj.index && obj.index != 0) {
          if (this.mterialTemplateData.length == 1) {
            if (
              this.mterialTemplateData[0].billTypeName == "打印表单" &&
              obj.billTypeName == "打印表单"
            ) {
              this.$Message.warning("只能添加一个打印表单模板");
              return false;
            } else if (
              this.mterialTemplateData[0].billTypeName != "打印表单" &&
              obj.billTypeName != "打印表单"
            ) {
              this.$Message.warning("只能添加一个其他类型的表单模板");
              return false;
            }
          }
          this.mterialTemplateData.push(obj);
        } else {
          if (this.mterialTemplateData.length == 2) {
            if (obj.index == 1) {
              if (
                this.mterialTemplateData[0].billTypeName == "打印表单" &&
                obj.billTypeName == "打印表单"
              ) {
                this.$Message.warning("只能添加一个打印表单模板");
                return false;
              } else if (
                this.mterialTemplateData[0].billTypeName != "打印表单" &&
                obj.billTypeName != "打印表单"
              ) {
                this.$Message.warning("只能添加一个其他类型的表单模板");
                return false;
              }
            }
            if (obj.index == 0) {
              if (
                this.mterialTemplateData[1].billTypeName == "打印表单" &&
                obj.billTypeName == "打印表单"
              ) {
                this.$Message.warning("只能添加一个打印表单模板");
                return false;
              } else if (
                this.mterialTemplateData[1].billTypeName != "打印表单" &&
                obj.billTypeName != "打印表单"
              ) {
                this.$Message.warning("只能添加一个其他类型的表单模板");
                return false;
              }
            }
          } else {
            this.mterialTemplateData[obj.index] = obj;
          }
        }
      }
      this.modelFlag = false;
    },
    //编辑表单模板
    editMaterialTemplate(row, index) {
      if (index || index == 0) {
        row.index = index;
        this.modelTitle = "编辑模板";
      } else {
        this.modelTitle = "新增模板";
      }
      this.modelFlag = true;
      this.backData = row;
    },
    // 扩展信息
    showExtendInfo(e) {
      let that = this;
      that.isShowExtendInfo = !that.isShowExtendInfo;
    },
    //新增表单模板
    addMaterialTemplate() { },
    // 获取材料信息表数据
    getMatter() {
      let $this = this;
      util.ajaxObjPost(
        "/znsj-web/matterial/getMatterialByMatteCode?matteCode=" +
        $this.matterCode +
        "&matteVersion=" +
        $this.version,
        {},
        function (res) {
          let data = res.data;
          data.forEach(function (item, index) {
            if (!item.child) {
              item._disableExpand = true;
            }
            if (item.matterialName && item.matterialName.length > 40) {
              item.matterialNameTitle = item.matterialName;
              item.matterialName = item.matterialName.substr(0, 40) + "...";
            } else {
              item.matterialNameTitle = "";
            }
            if (item.orignalName && item.orignalName.length > 40) {
              item.orignalNameTitle = item.orignalName;
              item.orignalName = item.orignalName.substr(0, 40) + "...";
            } else {
              item.orignalNameTitle = "";
            }
          });
          $this.dataList = data;
          setTimeout(() => {
            let tips = $(".tip-title");
            $(tips).each(function (index, obj) {
              if (tips.eq(index).attr("title").length > 39) {
                tips.eq(index).tipTip();
              }
            });
          }, 100);
        },
        function (res) {
          $this.$Message.error("数据请求失败");
        },
        this
      );
    },
    openModal() {
      // 解决ie兼容性问题 requestAnimationFrame
      util.solveAnimFrame();

      //init
      let self = this;
      self.checkBoxVisiable = true;

      let query = this.$refs["guanlian"].$data.query;
      if (query) {
        this.$refs["guanlian"].$data.query = "";
      }
      // 重置原件、复印件校验规则
      self.ruleValidate.originalNum[0].required = true;
      self.ruleValidate.copiesNum[0].required = true;

      this.$refs["ruleValidate"].resetFields();
      this.formItem = {
        originalMaterialName: "",
        copiesNum: "1",
        originalNum: "1",
        isNeed: "1",
        matterialSize: 10,
        contentAttchName: "",
        blankFormName: "",
        sampleUrlName: "",
        type: "QTCL",
        linkCode: "", // 环节编码
        possessor: "" //材料持有人
      };
      this.mterialTemplateData = [];
      this.isOnline = "0";
      this.isShowExtendInfo = false;
      self.isStart = false;
      self.matriCode = "";
      //http
      this.getSumDictionary(); // 获取材料类型字典项
      //show
      this.materialConDialogModal = true;
      this.isAdd = 0;
      this.materialTitle = "新增材料";
    },
    editModal(params) {
      this.checkBoxVisiable = false;
      let query = this.$refs["guanlian"].$data.query;
      if (query) {
        this.$refs["guanlian"].$data.query = "";
      }
      this.$refs["ruleValidate"].resetFields();
      //http
      this.getSumDictionary(); // 获取材料类型字典项
      //show
      this.materialConDialogModal = true;
      this.isAdd = 1;
      this.materialTitle = "编辑材料";
      this.ids = params.row.id;
      this.matriCode = "";
      this.isShowExtendInfo = false;
      this.getMatterialInfo(params.row.id);
    },
    //获取各种字典项
    getSumDictionary() {
      let that = this;
      // 获取材料类型字典项
      that.getDicData("CLLX", function (data) {
        that.typeOptions = [];
        for (var i in data) {
          that.$set(that.typeOptions, i, data[i]);
        }
      });

      // 获取材料形式
      that.getDicData("CLXS", function (data) {
        that.formOption = []; // 选中数组形式
        that.formOptions = []; // 键值对形式
        let temp = [];
        for (var i in data) {
          that.$set(that.formOptions, i, data[i]);
          that.$set(that.formOption, i, data[i].value);
          temp.push(data[i].value);
        }
        if (that.isAdd == 0) {
          //新增默认全部
          that.materialForm = temp;
        }
      });

      // 有无关联组
      that.getAsscGroupList();

      // 必要性
      that.getDicData("CLBYX", function (data) {
        that.needOptions = [];
        for (var i in data) {
          that.$set(that.needOptions, i, data[i]);
        }
      });
      //环节名称字典值
      that.getDicData("HJMC", function (data) {
        that.hjmcOptions = [];
        for (var i in data) {
          that.$set(that.hjmcOptions, i, data[i]);
        }
      });
    },

    //获取字典项公共方法
    getDicData(param, success) {
      let that = this;
      util.ajaxMerPost(
        "/znsj-web/dic/getDictionarys",
        { pinYinType: param },
        function (res) {
          res = typeof res === "string" ? JSON.parse(res) : res;
          let data = res.data;
          if (res.flag) {
            if (data && data.length > 0) {
              success && success(data);
            }
          } else {
            that.$Message.error(res.data || "数据加载失败!");
          }
        },
        function (error) {
          that.$Message.error("数据加载失败！！");
        },
        that
      );
    },

    //根据情形事项获取关联组下拉框数据
    getAsscGroupList() {
      let self = this,
        curId = self.formItem.asscGroupId,
        query;
      self.$set(self.formItem, "asscGroupId", "");
      query = self.$refs["guanlian"].$data.query;
      if (query) {
        self.$refs["guanlian"].$data.query = "";
      }
      util.ajaxMerPost(
        "/znsj-web/matterial/getAsscGroupList",
        {
          matteVersion: self.version,
          matteCode: self.matterCode
        },
        function (res) {
          let hasGroupVal = false,
            curGroupLabel;
          self.asscGroupOptions = [];
          for (let i in res.data) {
            self.$set(self.asscGroupOptions, i, res.data[i]);
            if (curId == res.data[i].value) {
              hasGroupVal = true;
              curGroupLabel = res.data[i].label;
            }
          }
          self.asscGroupOptions.unshift({
            label: "请选择",
            value: ""
          });
          if (self.asscGroupOptions.length > 1 && curId) {
            self.$set(self.formItem, "asscGroupId", hasGroupVal ? curId : "");
          }
        },
        function (error) {
          self.$Message.error("数据加载失败");
        },
        self
      );
    },
    //获取材料基本详情
    getMatterialInfo(id) {
      let self = this;
      self.matterialId = id;
      util.ajaxMerPost(
        "/znsj-web/matterial/getMatterialInfo",
        {
          id: id
        },
        function (res) {
          if (res.flag) {
            if (res.data.formList && res.data.formList.length > 0) {
              self.mterialTemplateData = res.data.formList;
            }

            self.matriCode = res.data.code;
            self.isOnline = res.data.isOnline;

            if (res.data.isOnline == 1) {
              self.isStart = true;
            } else {
              self.isStart = false;
            }
            self.formItem = res.data;
            self.uploadFileFormats = res.data.fileType
              ? res.data.fileType.split(",")
              : self.fileTypeOptions;
            self.materialForm = res.data.form
              ? res.data.form.split(",")
              : self.formOption;
            self.formItem.originalMaterialName = res.data.orignalName;
            self.ruleValidate.originalNum[0].required =
              self.materialForm.indexOf("02") != -1 ? true : false;
            self.ruleValidate.copiesNum[0].required =
              self.materialForm.indexOf("03") != -1 ? true : false;
          } else {
            self.$Message.error(res.data || "数据加载失败!");
          }
        },
        function (error) {
          self.$Message.error("数据加载失败！");
        },
        this
      );
    },
    keyGenerator: function (file) { },
    beforeUpload: function (file) {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)",
        customClass: "el-mask"
      });
    },
    uploadProgress: function (file, percentage) { },
    uploadSuccessFJ: function (file, res) {
      var that = this,
        data,
        info;
      if (
        res &&
        res.data &&
        res.data.fileInfo &&
        res.data.fileInfo.length > 0
      ) {
        data = res.data;
        info = data.fileInfo[0];

        that.formItem.contentAttchName = info.fileName;
        that.formItem.contentAttch = info.filePath;
      } else {
        that.$Message.error(res.data);
        return;
      }
    },
    uploadSuccessKB: function (file, res) {
      var that = this,
        data,
        info;
      if (
        res &&
        res.data &&
        res.data.fileInfo &&
        res.data.fileInfo.length > 0
      ) {
        data = res.data;
        info = data.fileInfo[0];
        that.formItem.blankFormName = info.fileName;
        that.formItem.blankForm = info.filePath;
      } else {
        return;
      }
    },
    uploadSuccessSL: function (file, res) {
      var that = this,
        data,
        info;
      if (
        res &&
        res.data &&
        res.data.fileInfo &&
        res.data.fileInfo.length > 0
      ) {
        data = res.data;
        info = data.fileInfo[0];
        that.formItem.sampleUrlName = info.fileName;
        that.formItem.sampleUrl = info.filePath;
      } else {
        return;
      }
    },
    uploadError: function (data) {
      if (data == "上传出错！请检查后重新上传！错误代码Q_TYPE_DENIED") {
        this.$Message.error("上传出错，请检查后重新上传"); // 上传出错，上传文件为空
      } else {
        this.$Message.error(data);
      }
    },
    handleComplete: function (data) {
      this.loading.close();
    },
    delFileEvt: function (name, url, index) {
      var that = this;
      util.ajaxMerPost(
        "/znsj-web/commer/fileDelete?filePath=" + url,
        {},
        function (res) {
          res = typeof res == "string" ? $.parseJSON(res) : res;
          var data = res.data;
          if (res.flag) {
            that.$Message.success(data || "删除成功！");
            if (index == 1) {
              that.formItem.contentAttchName = "";
              that.formItem.contentAttch = "";
            } else if (index == 2) {
              that.formItem.blankFormName = "";
              that.formItem.blankForm = "";
            } else {
              that.formItem.sampleUrlName = "";
              that.formItem.sampleUrl = "";
            }
          } else {
            that.$Message.error(data || "删除失败！");
          }
        },
        function (error) {
          that.$Message.error("删除失败！");
        },
        that
      );
    },
    previewFileEvt: function (e) {
      var self = $(e.currentTarget),
        path = self.data("path"); // 文件路径
      if (!path) {
        return;
      }
      window.open(path);
    },
    deleteImg(event) {
      const imageUrl = event.currentTarget.getAttribute("img-url");
      this.imgList = this.imgList.filter(img => img.imageUrl != imageUrl);
    },
    //新增或者编辑
    okMaterialConDialog(name) {
      let self = this;
      self.$refs[name].validate(valid => {
        // if(self.formItem.originalMaterialName==''){ //手动输入的材料或者没有选择材料
        //    if(self.$refs.originalMaterialName._data.query==''){
        //        $("#oriMaterialFormItemTip").removeClass("hide");
        //        return;

        //    }
        // }

        //材料名称和文件格式的校验
        if (
          self.materialForm.length == 0 &&
          self.uploadFileFormats.length == 0
        ) {
          $("#materialFormItemTip").removeClass("hide");
          $("#uploadFileFormItemTip").removeClass("hide");
          return;
        }
        if (
          self.materialForm.length == 0 &&
          self.uploadFileFormats.length != 0
        ) {
          $("#materialFormItemTip").removeClass("hide");
          return;
        }
        if (
          self.materialForm.length != 0 &&
          self.uploadFileFormats.length == 0
        ) {
          $("#uploadFileFormItemTip").removeClass("hide");
          return;
        }

        if (self.mterialTemplateData.length == 0 && self.isOnline == 1) {
          self.$Message.warning("请新增表单模板");
          return;
        } else if (self.mterialTemplateData.length == 1 && self.isOnline == 1) {
          if (self.mterialTemplateData[0].billTypeName == "打印表单") {
            self.$Message.warning("请添加一个其他类型的表单模板");
            return;
          }
          if (self.mterialTemplateData[0].billTypeName != "打印表单") {
            self.$Message.warning("请添加一个打印表单模板");
            return;
          }
        }

        if (valid) {
          //新增
          if (self.isAdd == 0) {
            if (self.formItem.asscGroupId) {
              self.asscGroupCheck();
            } else {
              self.addMaterial();
            }
          }
          //编辑
          if (self.isAdd == 1) {
            if (self.formItem.asscGroupId) {
              self.asscGroupCheck("2", self.matterialId);
            } else {
              self.editMaterial();
            }
          }
        }
      });
    },
    // 编辑
    editMaterial() {
      let self = this;
      self.formItem.fileType = self.uploadFileFormats.join(",");
      self.formItem.form = self.materialForm.join(",");
      self.formItem.id = self.ids;
      self.formItem.matterCode = self.matterCode;
      self.formItem.matterVersion = self.version;
      self.formItem.orignalName = self.formItem.originalMaterialName;
      self.formItem.isOnline = self.isOnline;

      let params = self.formItem,
        tempName = params.orignalName,
        tempCode = params.orignalCode;

      util.ajaxObjPost(
        "/znsj-web/matterial/editMatterial",
        params,
        function (res) {
          if (res.flag) {
            self.$Message.success("操作成功");
            setTimeout(function () {
              self.materialConDialogModal = false;
              if (self.isCreateAnother) {
                self.formItem.originalMaterialName = tempName;
                self.formItem.orignalCode = tempCode;
              }
              // 重置原件、复印件校验规则
              // self.ruleValidate.originalNum[0].required = false;
              // self.ruleValidate.copiesNum[0].required = false;
              //对话框消失的回调
              self.getMatter();
            }, 500);
          } else {
            self.$Message.error("操作失败");
          }
        },
        function (res) {
          self.$Message.error(res.data.errMsg);
        },
        self
      );
    },
    //新增
    addMaterial() {
      let self = this;
      self.formItem.fileType = self.uploadFileFormats.join(",");
      self.formItem.form = self.materialForm.join(",");
      self.formItem.id = "";
      self.formItem.matterCode = self.matterCode;
      self.formItem.matterVersion = self.version;
      self.formItem.orignalName = self.formItem.originalMaterialName;
      self.formItem.isOnline = self.isOnline;
      self.formItem.formList = self.mterialTemplateData;

      let params = self.formItem,
        tempName = params.orignalName,
        tempCode = params.orignalCode;

      util.ajaxObjPost(
        "/znsj-web/matterial/addMatterial",
        params,
        function (res) {
          if (res.flag) {
            self.$Message.success("操作成功");
            setTimeout(function () {
              self.materialConDialogModal = false;
              if (self.isCreateAnother) {
                self.openModal();
                self.formItem.originalMaterialName = tempName;
                self.formItem.orignalCode = tempCode;
              }
              // 重置原件、复印件校验规则
              // self.ruleValidate.originalNum[0].required = false;
              // self.ruleValidate.copiesNum[0].required = false;

              //对话框消失的回调
              self.getMatter();
            }, 500);
          } else {
            self.$Message.error("操作失败");
          }
        },
        function (res) {
          self.$Message.error(res.data.errMsg);
        },
        this
      );
    },
    //删除框
    openDeleteModal(row) {
      let that = this,
        tips = "确定要删除这条记录吗？";
      if (row.isServerConfigured == "1") {
        tips = "该材料有绑定的服务，确定要删除吗？";
      }
      this.ids = row.id;
      that
        .$confirm(tips, "提示", {
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
          cancelButtonClass: "fr ml10",
          type: "warning"
        })
        .then(() => {
          that.delMaterialDialogOk();
        })
        .catch(() => { });
    },
    //删除
    delMaterialDialogOk() {
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/deleteMatterial",
        {
          ids: self.ids
        },
        function (res) {
          if (res.data && res.flag) {
            self.$Message.success("删除成功");
            // 刷新父页面列表
            setTimeout(function () {
              self.getMatter();
            }, 500);
          } else {
            self.$Message.error("删除失败");
          }
        },
        function (res) {
          self.$Message.error("删除失败");
        },
        this
      );
    },
    //上移
    upSort(param) {
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/upSort",
        {
          id: param.row.id,
          isGroup: param.row.isGroup
        },
        function (res) {
          if (res.data && res.flag) {
            self.$Message.success("操作成功");
            // 刷新父页面列表
            self.getMatter();
          } else {
            self.$Message.error(res.errMsg);
          }
        },
        function (res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        },
        this
      );
    },
    //下移
    downSort(param) {
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/downSort",
        {
          id: param.row.id,
          isGroup: param.row.isGroup
        },
        function (res) {
          if (res.data && res.flag) {
            self.$Message.success("操作成功");
            // 刷新父页面列表
            self.getMatter();
          } else {
            self.$Message.error(res.errMsg);
          }
        },
        function (res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        },
        this
      );
    },
    //关联组管理
    openAssociationGroupModal() {
      //init
      this.$refs["associationGroup"].resetFields();
      //http
      this.getAsscGroupPage();
      //show
      this.associationGroupModal = true;
    },
    //编辑关联组
    editAssociation(item, index) {
      if (item.status == 1) {
        this.formDynamic.associationGroupList[index].status = 0;
      } else {
        if (!item.groupName) {
          this.$Message.error("关联组名称不能为空");
          return;
        }
        if (item.groupName.length > 200) {
          return;
        }
        if (item.id) {
          //编辑
          this.editAsscGroup(item, index);
        } else {
          //新增
          this.addAsscGroup(item, index);
        }
      }
    },
    //新增关联组
    addAssociation() {
      let self = this;
      self.formDynamic.associationGroupList.push({
        id: "",
        matterCode: self.matterCode,
        matterVersion: self.version,
        groupName: "",
        status: 0
      });
    },
    //获取关联组列表
    getAsscGroupPage() {
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/getAsscGroupPage",
        {
          matteVersion: self.version,
          matteCode: self.matterCode
        },
        function (res) {
          if (res.data) {
            res.data.forEach(function (item) {
              item.status = 1;
            });
            self.formDynamic.associationGroupList = res.data;
          }
        },
        function (res) {
          self.$Message.error("操作失败");
        },
        this
      );
    },

    //编辑关联组数据
    editAsscGroup(item, index) {
      let self = this;
      util.ajaxObjPost(
        "/znsj-web/matterial/editAsscGroup",
        {
          id: item.id,
          groupName: item.groupName,
          matterVersion: self.version,
          matterCode: self.matterCode
        },
        function (res) {
          if (res.flag) {
            self.formDynamic.associationGroupList[index].status = 1;
          }
        },
        function (res) {
          self.$Message.error("操作失败");
        },
        this
      );
    },
    //新增关联组数据
    addAsscGroup(item, index) {
      let self = this;
      if (self.formDynamic.associationGroupList.length == 0) {
        self.associationGroupModal = false;
        return false;
      }
      for (let i = 0; i < self.formDynamic.associationGroupList.length; i++) {
        if (self.formDynamic.associationGroupList[i].groupName == "") {
          self.$Message.warning("关联组名称不能为空");
          return false;
        }
      }
      this.loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)",
        customClass: "el-mask"
      });
      util.ajaxObjPost(
        "/znsj-web/matterial/addAsscGroup",
        self.formDynamic.associationGroupList,
        function (res) {
          self.loading.close();
          self.$Message.success("保存成功");
          self.getMatter();
          self.associationGroupModal = false;
        },
        function (res) {
          self.loading.close();
          self.$Message.error("操作失败");
        },
        self
      );
    },
    //校验关联组
    asscGroupCheck(type, id) {
      let self = this;
      let params = {
        orignalName: self.formItem.originalMaterialName,
        id: self.formItem.asscGroupId,
        type: self.formItem.type,
        form: self.materialForm.join(","),
        copiesNum: self.formItem.copiesNum,
        originalNum: self.formItem.originalNum,
        isNeed: self.formItem.isNeed,
        matterCode: self.matterCode,
        matterVersion: self.version,
        linkCode: self.formItem.linkCode
      };
      if (id) {
        params.matterialId = id;
      }

      util.ajaxObjPost(
        "/znsj-web/matterial/asscGroupCheck",
        params,
        function (res) {
          if (res.flag) {
            if (type == "2") {
              // 编辑
              self.editMaterial();
            } else {
              self.addMaterial();
            }
          } else {
            self.$Message.error(res.errMsg);
          }
        },
        function (res) {
          self.$Message.error(res.data.errMsg);
        },
        self
      );
    },
    //关联组对话框显示监听
    onAssociationVisibleChange(flag) {
      if (!flag) {
        // 刷新关联组列表
        this.getAsscGroupList();
      }
    },
    //删除关联组数据
    deleteAssociation(item, index) {
      let self = this,
        state = item.status;

      self
        .$confirm("确定要删除这条记录吗？", "提示", {
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
          cancelButtonClass: "fr ml10",
          type: "warning"
        })
        .then(() => {
          // 已在后台保存过
          if (item.id) {
            util.ajaxMerPost(
              "/znsj-web/matterial/deleteAsscGroup",
              {
                id: item.id
              },
              function (res) {
                if (res.flag) {
                  self.$Message.success("删除成功");
                  self.formDynamic.associationGroupList.splice(index, 1);
                  self.getAsscGroupPage();
                }
              },
              function (res) {
                self.$Message.error(res.data.errMsg);
              },
              self
            );
            // 未在后台保存过
          } else {
            self.formDynamic.associationGroupList.splice(index, 1);
            self.$Message.success("删除成功");
          }
        })
        .catch(() => { });
    },
    //材料形式值变化
    materialFormChange(value) {
      let that = this;
      //如果勾选复印件则复印件份数为必填，如果勾选原件则原件份数为必填
      if (value.length > 0) {
        that.ruleValidate.originalNum[0].required =
          value.indexOf("02") != -1 ? true : false;
        that.ruleValidate.copiesNum[0].required =
          value.indexOf("03") != -1 ? true : false;
        // this.$refs['ruleValidate'].resetFields();
        // if(value.indexOf('02')) {
        //     that.ruleValidate.originalNum[0].required = true;
        // }
        // for (var i = 0; i < value.length; i++) {
        //   for (var j = 0; j < this.formOptions.length; j++) {
        //     if (this.formOptions[j].label == '原件') {
        //       if (this.formOptions[j].value == value[i]) {
        //         this.ruleValidate.originalNum[0].required = true;
        //       } else {
        //         this.ruleValidate.originalNum[0].required = false;
        //       }
        //     }
        //     if (this.formOptions[j].label == '复印件') {
        //       if (this.formOptions[j].value == value[i]) {
        //         this.ruleValidate.copiesNum[0].required = true;
        //       } else {
        //         this.ruleValidate.copiesNum[0].required = false;
        //       }
        //     }
        //   }
        // }
      }
      //控制材料样式提示变化
      if (value.length == 0) {
        $("#materialFormItemTip").removeClass("hide");
      } else {
        $("#materialFormItemTip").addClass("hide");
      }
    },
    //文件格式值变化
    uploadFileFormatsChange(value) {
      //控制文件格式提示变化
      if (value.length == 0) {
        $("#uploadFileFormItemTip").removeClass("hide");
      } else {
        $("#uploadFileFormItemTip").addClass("hide");
      }
    },
    onIssuesMaterialModalVisibleChange(flag) {
      let that = this;
      this.$nextTick(() => {
        if (flag) {
          $(".material-form-item .ivu-form-item-content").append(
            "<div id='materialFormItemTip' class=\"ivu-form-item-error-tip hide\">请选择材料形式</div>"
          );
          $(".uploadFile-form-item .ivu-form-item-content").append(
            "<div id='uploadFileFormItemTip' class=\"ivu-form-item-error-tip hide\">请选择材料形式</div>"
          );

          //  $(".oriMaterial-form-item .ivu-form-item-content").append(
          //     "<div id='oriMaterialFormItemTip' class=\"ivu-form-item-error-tip hide\">请输入原始材料名称</div>"
          //   );
        } else {
          $("#materialFormItemTip").remove();
          $("#uploadFileFormItemTip").remove();
          that.mterialTemplateData = [];
        }
      });
    }
  },
  mounted() {
    util.solveAnimFrame();
    util.solveIviewTable();
  },
  computed: {
    getMatterSource() {
      if (this.isParent == "1") {
        return "1";
      } else {
        return "2";
      }
    }
  },
  created() {
    this.getMatter();
  }
};
</script>
<style lang="less" rel="stylesheet/stylus">
@import "../../../assets/styles/theme.less";
#issuesMaterialConfigure {
    .ivu-table {
        font-size: 14px !important;
    }
    .el-button {
        font-size: 14px !important;
    }
    .ivu-table-expanded-cell {
        padding: 0;
        border: none !important;
        .ivu-table-wrapper {
            border-top: none;
            border-left: none;
            border-bottom: none;
            .ivu-table-row td:nth-child(1) {
                //  padding-left: 50px;
                width: 300px;
            }
            tr.ivu-table-row td {
                background-color: #f8f9fb !important;
            }
        }
    }
    .ivu-table-expanded-cell[class*="cell"] {
        padding: 0;
        border-bottom: 0 !important;
        padding-left: 40px;
        background-color: #f8f9fb !important;
    }

    // .ivu-table-cell-expand {
    //   -ms-transition: -ms-transform 0.2s ease-in-out;
    //   -webkit-transition: -webkit-transform 0.2s ease-in-out;
    //   transition: transform 0.2s ease-in-out;
    // }
    // .ivu-table-cell-expand-expanded {
    //   -ms-transform: rotate(90deg);
    //   -webkit-transform: rotate(90deg);
    //   -moz-transform: rotate(90deg);
    //   -o-transform: rotate(90deg);
    //   transform: rotate(90deg);
    // }
}
#issuesMaterialConDialog {
    .tip-title {
        display: inline-block;
        max-width: 100%;
    }
    .mterrialTable,
    .el-table {
        td .cell {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .ivu-radio-group {
        vertical-align: top;
    }
    .el-table td,
    .el-table th {
        padding: 8px 0;
    }
    .radio-tip {
        color: #ff0000;
    }
    .btn-wrap-auto {
        float: right;
        width: auto;
        cursor: pointer;
        text-align: right;
        span {
            display: inline-block;
            width: 60px;
            height: 30px;
            // font-size: 13px;
            color: #fff;
            border-radius: 3px;
            line-height: 30px;
            text-align: center;
        }
        .btn-sure {
            margin-top: 5px;
            margin-right: 10px;
            background: @baseColor;
        }
    }
    h3.materialInfo {
        height: 42px;
        line-height: 42px;
        margin-bottom: 16px;
        a {
            display: inline-block;
            padding-left: 22px;
            background: url(../../../assets/images/common/icon-nav-list.png)
                no-repeat center left;
        }
        a:hover {
            color: #666;
        }
    }

    .borderBot {
        border-bottom: 1px dashed #d8d8d8;
    }
    .icon-xia:before {
        content: "\E78D";
        color: #288ff4;
    }
    .icon-shang:before {
        content: "\E634";
        color: #288ff4;
    }
    .el-table {
        border: 1px solid #dcdee2;
        border-bottom: none;
    }
    .ivu-modal-body {
        padding-top: 0;
    }
    textarea.ivu-input {
        font-size: 12px;
    }
    .ivu-select-dropdown {
        z-index: 2000 !important;
        width: 215px !important;
    }
    .dialog-footer {
        .el-button {
            width: 64px;
            height: 34px;
        }
    }
    // .upload-wrap-all {
    //   .ivu-form-item-content {

    //   }
    // }
    .upload-item {
        display: inline-block;
        margin-left: 8px !important;
        margin-right: 17px !important;
        .file-name {
            width: 182px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
        }
    }
    position: relative;
    .progressContainer {
        height: 20px;
        width: 96%;
        border-radius: 10px;
        background-color: #ddd;
        margin-left: 2%;
    }
    .progress {
        background-color: @baseColor;
        border-radius: 10px;
        height: 20px;
        line-height: 20px;
    }
    b {
        color: #fff;
        font-weight: 100;
        font-size: 12px;
        position: absolute;
        left: 40%;
    }
    .btns {
        margin-top: 20px;
    }
    .wenjian {
        font-size: 18px;
        color: #bfbfbf;
    }
    .gouxuan {
        font-size: 15px;
        color: #70c34c;
        float: right;
        margin-top: 6px;
    }
    .chahao {
        font-size: 16px;
        color: #bfbfbf;
        float: right;
        margin-top: 6px;
    }
    .ul-class {
        width: 400px;
        margin-top: 10px;
    }
    /* 文件上传显示 */
    .upload-detail {
        color: #333;
        label {
            display: inline-block;
            width: 110px;
            height: 30px;
            color: @baseColor;
            line-height: 30px;
            text-align: right;
        }
        span {
            display: inline-block;
            padding-right: 15px;
            height: 30px;
            line-height: 30px;
            vertical-align: top;
        }
        .elec-photo {
            .file-list {
                display: inline;
            }
            a {
                display: inline-block;
                padding-right: 10px;
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
            width: 30px;
            height: 30px;
            background: url(../../../assets/images/common/icon-del.png)
                no-repeat;
            background-position: center;
            background-size: 12px;
        }
    }
    .icon-del {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(../../../assets/images/common/icon-del.png) no-repeat;
        background-position: center;
        background-size: 12px;
    }
    .ivu-upload {
        display: inline-block;
    }
    .el-dialog__footer {
        margin-top: 20px;
        text-align: center;
    }
    .upload-view {
        width: 212px;
        height: 48px;
        .webuploader-pick {
            background: transparent;
            padding: 0 !important;
        }
        .icon {
            // width: 48px;
            height: 48px;
            line-height: 48px;
            .ivu-icon-md-cloud-upload {
                font-size: 20px;
                color: #666;
            }
            .upload-name {
                color: #999;
                vertical-align: middle;
            }
        }
    }
    .upload-view div:nth-child(2) {
        width: 100% !important;
        height: 100% !important;
    }
    .upload-extensions-tip {
        color: #999;
        position: absolute;
        top: 15%;
        padding: 2px 0;
        margin-left: 10px;
    }
    .transfer-title {
        font-size: 14px;
    }
    .ivu-modal {
        width: 65% !important;
    }
    .ivu-modal-content {
        border-radius: 2px;
        // .ivu-select-dropdown {
        //   max-width: 100%;
        //   z-index: 2000 !important;
        //   width: 215px !important;
        // }
    }
    .ivu-modal-header {
        border-radius: 2px 2px 0 0;
        // background: @baseColor;
        .ivu-modal-header-inner {
            line-height: 24px;
            font-size: 18px;
            color: #303133;
            font-size: 16px;
            font-weight: normal;
        }
    }
    .asscGroupBtn {
        padding-left: 10px;
        line-height: 50px;
        color: @baseColor;
        cursor: pointer;
    }
    .material-form-item .ivu-form-item-label:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
    }
    .uploadFile-form-item .ivu-form-item-label:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
    }
}
#delConDialog {
    .ivu-modal {
        width: 20% !important;
    }
    .ivu-modal-content {
        border-radius: 2px;
    }
    .ivu-modal-header {
        border-radius: 2px 2px 0 0;
    }
    .ivu-icon-ios-close {
        color: #ffffff;
    }
    .ivu-modal-footer {
        border-top: none;
    }
}
#associationGroupModal {
    position: relative;
    .ivu-modal-footer {
        border: none;
    }
    .ivu-modal {
        width: 50% !important;
    }
    .ivu-modal-content {
        border-radius: 2px;
        .ivu-select-dropdown {
            max-width: 100%;
            z-index: 2000 !important;
            width: 215px !important;
        }
    }

    .group-name {
        width: 74%;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .editBtn {
        color: @baseColor;
        width: 25%;
        display: inline-block;
        text-align: center;
        position: absolute;
        right: 0;
        cursor: pointer;
    }
    .association-form-item {
        margin-bottom: 0;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #e8eaec;
        border-left: 1px solid #e8eaec;
        border-right: 1px solid #e8eaec;
        .ivu-form-item-content {
            line-height: 48px;
            padding-left: 10px;
            .ivu-form-item-error-tip {
                padding-top: 0;
                padding-left: 13px;
                top: 92%;
            }
        }
    }
    .association-table-header {
        height: 40px;
        line-height: 40px;
        background: #f8f8f9;
        border: 1px solid #e8eaec;
    }
}

#materialTemplateModal {
    .ivu-modal-footer {
        display: none;
    }
}
</style>
