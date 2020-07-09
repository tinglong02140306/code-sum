<template>
    <div class="userinfo-wrap">
        <span class="arraw-t"></span>
        <div class="userinfo" v-for="item in userData">
            <Row>
                <i-col :span="8" class="userinfo-til">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</i-col>
                <i-col :span="16">{{item.name}}</i-col>
            </Row>
            <Row>
                <i-col :span="8" class="userinfo-til">身份证号：</i-col>
                <i-col :span="16">{{item.sfzh}}</i-col>
            </Row>
            <Row>
                <i-col :span="8" class="userinfo-til">登&nbsp;录&nbsp;名：</i-col>
                <i-col :span="16">{{item.loginName}}</i-col>
            </Row>
            <Row>
                <i-col :span="8" class="userinfo-til">用户类型：</i-col>
                <i-col :span="16">{{ item.userTypeTxt }}</i-col>
            </Row>
            <Row>
                <i-col :span="8" class="userinfo-til ukey">UKey：</i-col>
                <i-col :span="16">{{item.ukey}}</i-col>
            </Row>
        </div>
        <ul class="change-info">
            <!-- <li>
                <a href="javascript:;">修改个人信息</a>
            </li>
            <li>
                <a href="javascript:;">选择密码</a>
            </li> -->
            <li>
                <a href="javascript:;" @click="selGpyEvt">选择高拍仪</a>
            </li>
            <li>
                <a href="javascript:;" @click="downPluginEvt">插件下载</a>
            </li>
        </ul>
        <!-- <div class="btn-box">
            <i-button>退出</i-button>
        </div> -->
    </div>
</template>

<script>
export default {
    props: {
        userData: {
            type: Array
        },
    },
    data() {
        return {
            userInfo: [
                // { username: '管理员', IDCard: '342425199104829384', account: 'sadmin', userType: '普通用户', UKey: 'ukey_tests' }
            ],
        }
    },
    methods: {
        /*
         * 选择高拍仪触发事件
         */
        selGpyEvt() {
            let that = this;
            that.$emit('openGpyDialog');
        },
        /**
         * 插件下载
         */
        downPluginEvt() {
            let that = this;
            that.$emit('downPlugin');
        },
        
    }
}
</script>

<style lang="less">
.userinfo-wrap {
    width: 260px;
    background: #fff;
    position: relative;
    padding: 10px 20px;
    font-size: 14px;
    font-family: "PingFang SC";
    box-shadow: 0px 3px 7px 3px #e5e5e5;
    line-height: 1.6;
    .arraw-t {
        content: "";
        position: absolute;
        border: 8px solid transparent;
        border-bottom-color: #fff;
        top: -16px;
        right: 20px;
    }
    .userinfo {
        border-bottom: 1px solid #e8eaec;
        padding: 10px 0;
        .userinfo-til {
            text-align: right;
        }
    }
    .change-info {
        padding: 10px 0;
        li {
            line-height: 1.6;
            a {
                color: #2d8cf0;
                font-family: "PingFang SC";
            }
        }
    }
    .btn-box {
        text-align: right;
        .ivu-btn {
            width: 62px;
            height: 28px;
            background: #f8f9fb;
            border: 1px solid #ced5e3;
            padding: 0;
        }
    }
}
</style>
