/*
 * @Author: lhqin 
 * @Date: 2018-10-22 16:13:55 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-10-30 14:43:14
 */

<template>
    <div id="addOneThing" class="pl20 pr20 pt15">
        <!-- 头部说明 -->
        <div class="title-top">
            <p class="title-left">
                <span class="t-div mr5"></span>
                <span class="ell ell-detail">{{operateName}}</span>
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
            <oneThingInfo></oneThingInfo>
        </div>

    </div>

</template>
<script>
import oneThingInfo from '@/pages/thingManagement/thingHandle/oneThingInfoPanel'
export default {
    data() {
        return {
            savaQuery: '',
            operateName: '新增一件事',
            param: {
                eventVersion: '',
                eventCode: ''
            }
        };
    },
    components: {
        oneThingInfo
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
            case 'addOneThing':
                this.operateName = '新增一件事';
                break;
            case 'detail':
                this.operateName = '查看一件事';
                break;
            case 'edit':
                this.operateName = '编辑一件事';
                break;
            case 'change':
                this.operateName = '变更一件事';
                break;
            case 'copy':
                this.operateName = '复制一件事';
                break;
        }
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#addOneThing {
    .el-form-item__content {
        text-align: left;
    }

    overflow-y: auto;
    height: 100%;
    background-color: #fff;

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
        .ell-title {
            display:inline-block;
            max-width: 900px;
        }
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

    .selected {
        background-color: #1683c8;
        color: #fffffc !important;
    }

    .des {
        height: 25px;
        line-height: 25px;
        span {
            color: red;
        }
    }
}
</style>
