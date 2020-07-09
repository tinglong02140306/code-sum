
<template>
    <div id="caseConfiguration" class="case-configuration mt15">
        <Row class="clearfix" type="flex">
            <Col span="10">
            <div class="tree-wrap tree-wrap-left">
                <p class="tree-title">分类</p>
                <div class="tree-main-wrap">
                    <Tree :data="dataLeft" :render="renderContentLeft"></Tree>
                </div>
            </div>
            </Col>
            <Col span="4">
            <div class="tree-tip">
                <div class="tree-tip-box">
                    <p>拖入右侧 ></p>
                    <!-- <p>拖动左侧的分类节点到右侧</p> -->
                    <!-- <img src="@/assets/images/common/icons8-advance.png" alt=""> -->
                </div>
            </div>
            </Col>
            <Col span="10">
            <div class="tree-wrap tree-wrap-right" @dragover="dragOver" @drop="drop">
                <p class="tree-title">情形
                    <Icon type="ios-trash-outline" />
                </p>
                <div class="tree-main-wrap">
                    <Tree :data="dataRight" :render="renderContentRight"></Tree>
                </div>
            </div>
            </Col>
        </Row>
        <!-- 按钮部分 -->
        <div class="btn-wrap">
            <i-button type="primary" @click="saveData">确定</i-button>
        </div>
    </div>

</template>
<script>
import util from "@/api";
export default {
    data() {
        return {
            dataLeft: [
                {
                    title: 'parent 1',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            'class': {
                                treeParent: true
                            },
                            style: {
                                display: 'none',
                                width: '100%'
                            },
                            attrs: {
                                // draggable: true
                            },
                            on: {
                                'dragstart': (e) => {
                                    this.currentEle = $(e.target);
                                    // this.currentRoot = JSON.stringify(root);
                                    // this.currentNode = JSON.stringify(node);
                                    this.currentData = JSON.stringify(data);
                                }
                            }
                        }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ])
                            ]);
                    },
                    children: []
                }
            ],
            dataRight: [
                {
                    title: 'parent 1',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        this.param = root;
                        return h('span', {
                            'class': {
                                treeParent: true
                            },
                            style: {
                                display: 'none',
                                width: '100%'
                            },
                            attrs: {
                                // draggable: true
                            },
                            on: {
                                'dragstart': (e) => {
                                    this.currentEle = $(e.target);
                                    // this.currentRoot = JSON.stringify(root);
                                    // this.currentNode = JSON.stringify(node);
                                    this.currentData = JSON.stringify(data);
                                },
                                click: (e) => {
                                    if (this.flag) {
                                        this.append(data, node)
                                    }
                                }
                            }
                        }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ])
                            ]);
                    },
                    children: []
                }
            ],
            flag: false,
            sortFlag: false,
            sortIndex: 0,
            currentRoot: '',
            currentNode: '',
            currentData: '',
            currentEle: '',  //当前元素
            buttonProps: {
                type: 'default',
                size: 'small',
            },

            param: []
        }
    },
    methods: {
        renderContentLeft(h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    // width: '100%'
                },
                attrs: {
                    draggable: true,
                    id: data.id
                },
                on: {
                    'dragstart': (e) => {
                        if (data.codeType == 1) {
                            e.preventDefault()
                        }
                        if (data.children.length == 0) {
                            e.preventDefault()
                        }
                        this.currentEle = $(e.target);
                        this.currentData = JSON.stringify(data);
                    }
                }
            }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-folder'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ])
                ]);
        },
        renderContentRight(h, { root, node, data }) {
            this.param = root;
            return h('span', {
                style: {
                    display: 'inline-block',
                    // width: '100%'
                },
                attrs: {
                    draggable: true,
                    id: data.id,
                    codeType: data.codeType
                },
                on: {
                    'dragstart': (e) => {
                        if (data.codeType == 1) {
                            e.preventDefault()
                        }
                        this.currentEle = $(e.target);
                        this.currentData = JSON.stringify(data);
                    },
                    click: (e) => {
                        if (this.sortFlag) {
                            this.sortData(root, node, data);
                        } else if (this.flag) {
                            this.append(data, node)
                        }
                    }
                }
            }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-folder'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                            height: 0,
                            width: 0,
                        }
                    }, [
                            h('Button', {
                                style: {
                                    height: 0,
                                    width: 0,
                                    padding: 0,
                                    border: 0,
                                    'font-size': 0
                                },
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-remove'
                                }),
                                on: {
                                    click: () => { window.event ? window.event.cancelBubble = true : e.stopPropagation(); this.remove(root, node, data) }
                                }
                            })
                        ])
                ]);
        },
        // 删除弹框
        delOpen(_success, _fail) {
            let that = this;
            that.$confirm('确认删除吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                _success ? _success() : true;
            }).catch(() => {
                _fail ? _fail() : true;
            });
        },
        append(data, node, root, ele) {
            let currentData = JSON.parse(this.currentData),
                $this = this;
            const children = data.children || [];
            for (let i = 0; i < children.length; i++) {
                if (children[i].id == currentData.id) {
                    return;
                }
            }
            currentData = this.addUuid([currentData])[0];
            children.push(currentData);
            this.$set(data, 'children', children);
            this.flag = false;
        },
        // 添加uuid
        addUuid(data) {
            let len = data.length;
            for (let i = 0; i < len; i++) {
                data[i].id = this.uuid();
                if (data[i].children && data[i].children.length != 0) {
                    data[i].children = this.addUuid(data[i].children);
                }
            }
            return data;
        },
        addUuidCopy(data) {
            let len = data.length;
            for (let i = 0; i < len; i++) {
                data[i].node.id = this.uuid();
            }
            return data;
        },
        remove(root, node, data) {
            let $this = this;
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
            this.flag = false;
        },
        // 排序
        sortData(root, node, data) {
            let $this = this,
                currentData = JSON.parse(this.currentData);
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            currentData = this.addUuid([currentData])[0];
            parent.children.splice(this.sortIndex - 1, 0, currentData);
            this.sortFlag = false;
        },
        dragOver(e) {
            e.preventDefault()
        },
        drop(e) { //松开拖放,e是容器元素
            // let data = JSON.parse(this.currentData);
            //     node = JSON.parse(this.currentNode),
            //     root = JSON.parse(this.currentRoot);
            let ele = $(e.target).closest('span[draggable=true]'),
                code = '',
                $this = this;
            if (ele[0]) {
                code = ele.attr('codeType');
            }

            if (code == 1 || code == '') {   //必须添加到答案下或者最外层元素才触发
                this.flag = true;
                if (e.target.className.indexOf('tree-main-wrap') !== -1) {
                    $('.treeParent').click();   //最外层元素、新增
                } else if (e.target.className.indexOf('ivu-icon-ios-trash-outline') !== -1) {
                    this.delOpen(function () {
                        $this.currentEle.closest('span[draggable=true]').find('button').click();  //删除
                    }, function () {

                    });
                } else {
                    if (e.target.className.indexOf('tree-title') == -1) {
                        $(e.target).click(); //新增
                        if (this.currentEle.closest('.tree-wrap-right').length == 1) {
                            setTimeout(function () {
                                $this.currentEle.find('button').click();
                            }, 0);
                        }
                    }
                }
            } else if (code == 0) { //上移、下移
                this.sortFlag = true;
                if (this.currentEle.closest('.tree-wrap-right').length == 1) {
                    $this.currentEle.find('button').click();
                }
                setTimeout(function () {
                    $this.sortIndex = $(e.target).closest('ul').index();
                    $(e.target).click(); //新增
                }, 200);  
            }
        },
        handData(data) {  //递归处理数据
            let len = data.length;
            for (let i = 0; i < len; i++) {
                if (data[i].codeType == 0) {  //分类
                    data[i].title = data[i].callsifyValue;
                } else {  //答案
                    data[i].title = data[i].answerValue;
                }
                data[i].expand = true;
                if (data[i].children && data[i].children.length != 0) {
                    data[i].children = this.handData(data[i].children);
                }
            }
            return data;
        },
        handClassData(data, codeType) {
            let len = data.length;
            for (let i = 0; i < len; i++) {
                if (data[i].classifyName) {  //分类
                    data[i].title = data[i].classifyName;
                }
                if (data[i].answerName) {
                    data[i].title = data[i].answerName;
                }
                if (data[i].answerCode) {
                    data[i].code = data[i].answerCode;
                }
                data[i].codeType = codeType;

                data[i].expand = true;
                if (data[i].children && data[i].children.length != 0) {
                    data[i].children = this.handClassData(data[i].children, 1);
                }
            }
            return data;
        },
        saveDataHandle() {  //保存数据处理
            let data = this.param,
                objData = {},
                handleData = [];
            data = this.addUuidCopy(data);
            for (let i = 1; i < data.length; i++) {
                let obj = {};
                obj.objectVersion = data[i].node.objectVersion;
                obj.objectCode = data[i].node.objectCode;

                if (data[i].parent) {  //从父级拿数据，自己有就不用拿
                    obj.parentId = data[data[i].parent].node.id;
                    if (data[i].node.objectCode) {
                        obj.objectCode = data[i].node.objectCode;
                    } else {
                        obj.objectCode = data[data[i].parent].node.objectCode;
                    }
                    if (data[i].node.objectVersion) {
                        obj.objectVersion = data[i].node.objectVersion;
                    } else {
                        obj.objectVersion = data[data[i].parent].node.objectVersion;
                    }

                    if (data[i].node.type) {
                        obj.type = data[i].node.type;
                    } else {
                        obj.type = data[data[i].parent].node.type;
                    }
                } else {
                    obj.objectCode = data[i].node.objectCode;
                    obj.objectVersion = data[i].node.objectVersion;
                    obj.type = data[i].node.type;
                }
                obj.id = data[i].node.id;
                obj.code = data[i].node.code;
                obj.codeType = data[i].node.codeType;
                obj.sortNo = data[i].node.sortNo;
                obj.subStageCode = this.$parent.matterStageId;
                handleData.push(obj);
            }

            objData.objectCode = this.$parent.matterCode;
            objData.objectVersion = this.$parent.matterVersion;
            objData.type = 2;
            objData.subStageCode = this.$parent.matterStageId;
            objData.situationList = handleData;
            return objData;

        },
        saveData() {
            let dtoList = this.saveDataHandle(),
                $this = this;
            // if (dtoList.length == 0) {
            //     $this.$Message.error('保存内容不能为空！');
            //     return;
            // }
            util.ajaxObjPost('/qxpz/situation/saveSituationTree', dtoList, function (res) {
                $this.$Message.success('保存成功');
            }, function (res) {
                $this.$Message.error(res.data.errMsg || '保存失败');
            }, this);
        },
        getTreData() {  //获取初始情形树
            let $this = this;
            util.ajaxMerPost('/qxpz/eventSituation/getSituationTree', {
                objectVersion: $this.$parent.matterVersion,
                objectCode: $this.$parent.matterCode,
                id: this.$parent.matterStageId,
                type: 2
            }, function (res) {
                let data = $this.handData(res.data);
                $this.dataRight[0].children = data;
            }, function (res) {

            }, this);
        },
        getClassifyTree() {  //获取初始分类树
            let $this = this;

            util.ajaxMerPost('/qxpz/classify/getClassifyTree', {
                objectVersion: $this.$parent.matterVersion,
                objectCode: $this.$parent.matterCode,
                id: this.$parent.matterStageId,
                type: 2
            }, function (res) {
                let data = $this.handClassData(res.data, 0);
                $this.dataLeft[0].children = data;
            }, function (res) {

            }, this);
        },
        uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        },
        init() {
            this.getClassifyTree();
            this.getTreData();
        }
    },
    mounted() {
        $('.tree-wrap-left .ivu-tree-arrow.ivu-tree-arrow-open').eq(0).css('display', 'none');
        $('.tree-wrap-right .ivu-tree-arrow.ivu-tree-arrow-open').eq(0).css('display', 'none');
    },
    created() {
        this.getTreData();
        this.getClassifyTree();
    }
}
</script>
<style lang="less">
#caseConfiguration {
    * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
    }
    // overflow: auto;
    height: 100%;
    width: 100%;
    position: relative;
    .tree-wrap {
        border: 1px solid #ced5e3;
        border-radius: 5px;
        .tree-title {
            // margin: 15px auto;
            height: 40px;
            line-height: 40px;
            font-weight: 700;
            font-style: normal;
            // font-size: 13px;
            font-size: 16px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            background-color: #f4f6f9;
            border-bottom: 1px solid #ced5e3;
            .ivu-icon-ios-trash-outline {
                float: right;
                font-size: 19px;
                line-height: inherit;
                margin-right: 8px;
            }
        }
        .tree-main-wrap {
            overflow-y: auto;
            padding: 10px 15px;
            height:345px;
            // height: 265px;
            border: 1px solid #f3f3f3;
            border-radius: 0 0 5px 5px;
        }
        .ivu-tree-children {
            overflow: visible !important;
            height: auto !important;
            font-size: 14px;
        }
        * {
            box-sizing: content-box;
        }
    }
    .tree-tip {
        position: relative;
        min-height: 410px;
        // min-height: 330px;
        font-size: 14px;
        line-height: 2;
    }
    .tree-tip-box {
        position: absolute;
        top: 50%;
        text-align: center;
        width: 100%;
        p{
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100px;
            margin: 0 auto;
        }
    }
    // 按钮部分
    .btn-wrap {
        // width: 100%;
        // height: 60px;
        text-align: right;
        // line-height: 60px;
        // position: absolute;
        // left: 50%;
        // margin-left: -28px;
        // bottom: 0;
        margin-top: 20px;
    }
}
</style>