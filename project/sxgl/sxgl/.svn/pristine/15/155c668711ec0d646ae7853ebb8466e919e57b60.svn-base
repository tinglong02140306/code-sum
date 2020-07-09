/*
 * @Author: qijiang 
 * @Date: 2018-09-30 21:18:44 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-02-15 11:01:33
 */
<template>
    <div class="iframe-header bg-header-base">
        <div class="iframe-banner">
        </div>
        <div class="custom-content-con">
            <span class="ivu-avatar ivu-avatar-circle ivu-avatar-default ivu-avatar-image ivu-avatar-icon"  @click="showUserInfo" >
                <img :src="userPic">
                <!-- <img v-if="userPic" :src="userPic" onerror="javascript:this.src='/bog-matter-mgr/static/images/common/hP.png';"> -->
            </span>
            <span class="user-name">{{loginName}}</span>
            <span class="btn-exit-system" title="退出" @click="exitBtn">退出</span>
        </div>
    </div>
</template>
<script>
import navMenu from '@/components/navMenu/navMenu';
import unit from "@/api";   // 公共工具方法
export default {
    components: {
        navMenu: navMenu
    },
    props: {
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
            userUrl: this.$store.state.userUrl + '/getUserPhoto',
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
        handleChange() {
            this.collapsed = !this.collapsed;
            this.$emit('handleChange', this.collapsed);
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
        imgSrc(){
        },
        /**
         * 获取用户头像base64
         */
        getUserPic() {
            let that = this;
            unit.ajaxMerPost('/bog-matter-mgr/getUserPhoto', {
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
    }
}
</script>
<style lang="less">
@import "../../assets/styles/color.less";
.iframe-header {
    overflow: hidden;
    position: relative;
    padding: 0 20px;
    width: 100%;
    // background: @baseBgColor;
    height: 60px;;
    line-height: 60px;
    z-index: 99;
    .iframe-banner {
        float: left;
        margin-left: 10px;
        height: 60px;
        width: 128px;
        background: url(../../assets/images/common/logo-font.png) 0 14px no-repeat;
        background-size: 100% auto;
    }
    .custom-content-con {
        float: right;
        padding: 0 0 0 20px;
        height: auto;
        line-height: 60px;
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
