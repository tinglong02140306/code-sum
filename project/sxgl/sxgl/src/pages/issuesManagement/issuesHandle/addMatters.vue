/*
 * @Author: lhqin 
 * @Date: 2018-10-01 12:23:55 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-10-30 14:42:20
 */

<template>
    <div id="addMatters" class="pl20 pr20 pt15">
        <!-- 头部说明 -->
        <div class="title-top clearfix">
            <p class="title-left">
                <span class="t-div mr5"></span>
                <span>{{operateName}}</span>
            </p>
            <p class="btn-groups inline-block ml30" @click="backEvt">
                <Button size="small" class="cursor-p w80">
                    <i class="iconfont icon-back"></i>
                    <span>返回</span>
                </Button>
            </p>
            <p class="fr inline-block des">
                <span>*</span>
                为必填项
            </p>
        </div>
        <div>
            <!-- 切换面板组件 -->
            <addWrap></addWrap>
        </div>

    </div>

</template>
<script>
import addWrap from '@/pages/issuesManagement/issuesHandle/addWrap';
export default {
    data() {
        return {
            savaQuery: '',
            operateName: '新增事项',
            currentView: 'mattInfo', //当前面板组件
            param: {
                matteVersion: '',
                matteCode: ''
            }
        };
    },
    components: {
        addWrap
    },
    methods: {
        backEvt() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.savaQuery = this.$route.query;
        let type = this.savaQuery.type;
        switch (type) {
            case 'addMatters':
                this.operateName = '新增事项';
                break;
            case 'detail':
                this.operateName = '查看事项';
                break;
            case 'edit':
                this.operateName = '编辑事项';
                break;
            case 'copy':
                this.operateName = '复制事项';
                break;
            // case 'change':
            //     this.operateName = '变更事项';
            //     break;
            case 'addChild':
                this.operateName = '新增子项';
                break;
        }
    }
};
</script>
<style lang="less" rel="stylesheet/less">
@import "../../../assets/styles/color.less";
#addMatters {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    .el-form-item__content {
        text-align: left;
    }
    .el-button--primary {
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;
    }

    .title-top {
        height: 42px;
        border-bottom: 1px dashed #d8d8d8;
    }

    .title-top .title-left {
        display: inline-block;
        position: relative;
        height: 25px;
        vertical-align: middle;
    }

    .title-left {
        .t-div {
            display: inline-block;
            width: 7px;
            height: 100%;
            background-color: #078fea;
            vertical-align: middle;
        }

        span:last-child {
            font-size: 14px;
            font-weight: 1000;
            vertical-align: middle;
        }
    }

    .switch-navigate {
        height: 43px;
        line-height: 43px;
        font-size: 13px;
        border: 1px solid #e4e4e4;
    }

    .switch-navigate p {
        text-align: center;
        width: 133px;
        height: 100%;
    }

    .switch-navigate p:last-child {
        position: relative;
        left: -5px;
    }

    .switch-default {
        background-color: #f2f2f2;
        color: #5e5e5e;
    }

    .a-color-red {
        a {
            color: #288ff4;
        }
    }

    // .selected {
    //     background-color: #1255b3;
    //     color: #fffffc !important;
    // }
    .des {
        height: 25px;
        line-height: 25px;
        span {
            color: red;
        }
    }
}
</style>
