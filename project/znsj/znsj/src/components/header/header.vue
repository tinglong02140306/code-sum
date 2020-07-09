/*
 * @Author: qijiang 
 * @Date: 2018-09-30 21:18:44 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-14 15:18:08
 */
<template>
    <div class="iframe-header bg-header-base">
        <div class="iframe-banner">
        </div>
        <div class="custom-content-con">
            <span style="cursor:pointer;" class="ivu-avatar ivu-avatar-circle ivu-avatar-default ivu-avatar-image ivu-avatar-icon"  @click="showUserInfo" >
                <!-- <img v-if="userPic" :src="userPic" onerror="javascript:this.src='bog-receive-web/static/images/common/hP.png';"> -->
            </span>
            <div id="userInfo" v-if="showInfo">
                <userInfo :userData="userData" @openGpyDialog="openGpyDialog" @downPlugin="downPlugin"></userInfo>
            </div>
            <span class="user-name">{{loginName}}</span>
            <span class="btn-exit-system" title="退出" @click="exitBtn">退出</span>
        </div>
    </div>
</template>
<script>
import util from "@/api";
import navMenu from '@/components/navMenu/navMenu';
import userInfo from '@/components/userInfo/userInfo';
export default {
    components: {
        navMenu: navMenu,
        userInfo: userInfo
    },
    props: {
        userData: {
            type: Array
        },
        icon: {
            type: String,
            default: 'navicon-round'
        },
        size: {
            type: Number,
            default: 26
        }
    },
    data() {
        return {
            collapsed: false,
            theme: 'light',
            mode: 'horizontal',
            showInfo: false,
            userPic: ''
        }
    },
    computed: {
        menuState: {
            get() {
                return this.$store.state.menuState;
            }
        },
        loginName: {
            get() {
                return this.$store.state.loginName;
            }
        }
    },
    methods: {
        showUserInfo() {
            this.showInfo = !this.showInfo;
        },
        selectEvt(val) {
            this.$store.commit('setState', {
                menuState: val
            });
            localStorage.menuState = val;
        },
        exitBtn() {
            this.$emit('logout');
        },
        /*
         * 启动高拍仪
         */
        openGpyDialog() {
            let that = this;
            that.$emit('openGpyDialog');
        },
        /*
         * 插件下载 
         */
        downPlugin() {
            let that = this;
            that.$emit('downPlugin');
        },
        getUserPic() {
            let that = this;
            util.ajaxMerPost('/bog-receive-web/getUserPhoto', {
            }, function (res) {
                that.$set(that, 'userPic', res.data)
            }, function (res) {
                that.$set(that, 'userPic', '1');
                that.$Message.warning('获取数据失败');
            }, that);
        }
    },
    mounted() {
        this.getUserPic();
    },
}
</script>
<style lang="less">
@import "../../assets/styles/color.less";
.iframe-header {
    // overflow: hidden;
    position: relative;
    padding: 0 20px;
    width: 100%;
    // background: @baseBgColor;
    height: 60px;
    line-height: 60px;
    z-index: 99;
    .iframe-banner {
        float: left;
        margin-left: 10px;
        height: 60px;
        width: 128px;
        background: url(../../assets/images/common/logo-font.png) 0 14px
            no-repeat;
        background-size: 100% auto;
    }
    .custom-content-con {
        float: right;
        padding: 0 0 0 20px;
        height: 60px;
        line-height: 60px;
        #userInfo {
            position: absolute;
            top: 75px;
            right: 139px;
            background: #fff;
            z-index: 9;
        }
        .user-name {
            margin-right: 26px;
            margin-left: 10px;
            font-size: 14px;
            color: #fff;
        }
        .btn-exit-system {
            padding-left: 20px;
            background: url(../../assets/images/common/icon-exit-background.png)
                no-repeat left center;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>
