<template>
    <div class="layout" :type="fontFlag" :color="colorFlag">
        <!-- v-if="isNew" -->
        <zufwHeader v-if="isNew" ref="shit" icon="md-menu" @openGpyDialog="openGpyDialog" @downPlugin="downPlugin" @logout="logout" :userData="userData"></zufwHeader>
        <Layout>
          <Sider v-if="isNew" class="iframe-sider" :collapsed-width="60" width="200" v-model="collapsed" hide-trigger collapsible>
            <navMenu ref="navMenu" :navData="navData" :openName="openName" :showNav="collapsed" v-show="showNav"></navMenu>
            <div class="opt-bottom">
              <ul class="clearfix">
                <li class="fl huanziti" @click="isShow('huanziti')" v-if="!collapsed">
                  <i class="iconfont icon-huanziti"></i>
                  <div ref="huanziti" class="huanziti-font" v-show="status.huanziti">
                    <span ref="big" class="big" :class="{select: fontFlag == 'big'}" @click="selectFont('big')">较大</span>
                    <span ref="normal" class="normal" :class="{select: fontFlag == 'normal'}" @click="selectFont('normal')">标准</span>
                  </div>
                </li>
                <li class="fl huanziti" @click="isShow('huanfu')"  v-if="!collapsed">
                  <i class="iconfont icon-huanfu" style="font-size: 26px;"></i>
                  <div ref="huanfu" class="huanfu-logo" v-show="status.huanfu">
                    <span ref="light" class="light" :class="{select: colorFlag == 'light'}" @click="selectColor('light')">
                      <span class="huanfu-select"></span>
                    </span>
                    <span ref="dark" class="dark" :class="{select: colorFlag == 'dark'}" @click="selectColor('dark')">
                      <span class="huanfu-select"></span>
                    </span>
                  </div>
                </li>
                <li class="fl shouqi" @click="handleChange"  v-if="!collapsed">
                  <i class="iconfont icon-shouqi1"></i>
                </li>
                <li class="fl zhankai" @click="handleChange"  v-if="collapsed">
                  <i class="iconfont icon-zhankai"></i>
                </li>
              </ul>
            </div>
          </Sider>
          <div class="iframe-main">
            <div class="iframe-content" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
              <div id="app" v-cloak>
                <router-view/>
              </div>
            </div>
            <zufwFooter v-if="isNew"></zufwFooter>
          </div>
        </Layout>
        <!-- 高拍仪型号选型弹框 -->
        <gpy-sel-Type ref="gpySelTypeDlg" :gpySetActive="gpySetActive" @gpySureOk="gpySureOk"></gpy-sel-Type>
        <!-- 高拍仪插件下载弹框 -->
        <down-plugin ref="downPlugin"></down-plugin>
        <!-- 高拍仪显示区域 -->
        <gpy-take-pic ref="gpyTakePic"></gpy-take-pic>
    </div>
</template>

<script>
import util from "@/api";
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import navMenu from '@/components/navMenu/navMenu';
import downPlugin from '@/components/gpy/downPluginDio';
import gpySelTypeDlg from '@/components/gpy/gpySelTypeDlg';
import hspDevice from '@/utils/hspDevice.js';
import gpyTakPicDig from '@/components/gpy/gpyTakPicDig';
export default {
  name: 'App',
  components: {
    zufwHeader: Header,
    zufwFooter: Footer,
    navMenu: navMenu,
    'down-plugin': downPlugin,
    'gpy-sel-Type': gpySelTypeDlg,
    'gpy-take-pic': gpyTakPicDig
  },
  data() {
    return {
      showNav:true,
      userData: [{ name: '管理员', sfzh: '342425199104829384', loginName: 'sadmin', userType: '普通用户', ukey: 'ukey_tests' }],
      collapsed: false,
      wrapperHeight: 0,
      navData: [{"icon":null,"isSelect":"false","items":[{"icon":null,"isSelect":"false","items":[],"title":"综合收件","url":"/searchMatters","id":"4028ba0565615116016672c61bf827d7","openType":"","code":"A_M20301010000","type":"URL"},{"icon":null,"isSelect":"false","items":[],"title":"我的收件","url":"/myReceipt/receiptList","id":"4028ba0565615116016672c68b7527d8","openType":"","code":"A_M20301020000","type":"URL"}],"title":"收件中心","url":"http://172.31.1.87:8885/znsj-sj-web/sarchMatters","id":"4028ba0565615116016672bb9dc827d6","openType":"","code":"A_M20301000000","type":"MENU"},{"icon":null,"isSelect":"false","items":[{"icon":null,"isSelect":"false","items":[],"title":"系统设置","url":"/systemOneMatter","id":"4028ba0567540d50016760252f7e106a","openType":"","code":"A_M20304010000","type":"URL"}],"title":"系统设置","url":"http://172.31.1.87:8885/znsj-sj-web/systemOneMatter","id":"4028ba0565615116016672c68b7527e9","openType":"","code":"A_M20304000000","type":"MENU"},{"icon":null,"isSelect":"false","items":[{"icon":null,"isSelect":"false","items":[],"title":"统计分析","url":"/statisticList","id":"asdaba0565615116016672c68b7527e9","openType":"","code":"A_M20305010000","type":"URL"}],"title":"统计分析","url":"http://172.31.1.87:8885/znsj-sj-web/statisticList","id":"fds8ba0567540d5001676sdfvg7e106a","openType":"","code":"A_M20304000000","type":"MENU"}],
      openName: [],
      status: {
        huanziti: false,
        huanfu: false
      },
      gpySetActive: false,
      initDevFirFlag: false
    }
  },
  computed: {
    isNew: {
      get() {
        return this.$store.state.isNew;
      }
    },
    fontFlag: {
      get() {
        return this.$store.state.fontFlag;
      }
    },
    colorFlag: {
      get() {
        return this.$store.state.colorFlag;
      },
    },
    isIndexPage: {
        get() {
          return this.$store.state.isIndexPage;
        },
        set: function () {
        }
    },
    takePicFlag: {
      get() {
        return this.$store.state.takePicFlag;
      },
      set: function () {
      }

    }
  },
  methods: {
      selectColor(val) {
        this.$store.commit('setState', {
          colorFlag: val
        });
        localStorage.colorFlag = val;
      },
      selectFont(val) {
        this.$store.commit('setState', {
          fontFlag: val
        });
        localStorage.fontFlag = val;
      },
      isShow(val) {
        if(this.status[val]) {
          this.status[val] = false;
          this.status.huanfu = false;
          this.status.huanziti = false;
        } else {
          this.status.huanziti = false;
          this.status.huanfu = false;
          this.status[val] = !this.status[val];
        }
      },
      handleChange() {
        let $this = this;
        this.showNav = false;
        this .collapsed = !this .collapsed;
        setTimeout(function(){ 
            $this.showNav = true;
        },200);
      },
      selectEvt(val) {
        this.$store.commit('setState', {
          menuState: val
        });
        sessionStorage.menuState = val;
      },
      //处理菜单数据
      handleMenuData(data) {
        let $this = this;
        for (let i = 0; i < data.length; i++) {
          if (data[i].url.indexOf(location.hash.substring(1, location.hash.length - 1)) > -1) {
            $this.$store.commit('setState', {
              menuState: data[i].id
            });
            sessionStorage.menuState = data[i].id;

            $this.$nextTick(() => {
              $this.$refs.navMenu.update();
            });
            return;
          }
          if (data[i].items.length > 0) {
            this.handleMenuData(data[i].items);
          }
        }
      },

      getNavData() {
        let $this = this;
        util.ajaxObjPost('/znsj-web/getNavData', {

        }, function (res) {
          let data = res.data.data.items,
            openName = [];
          for (let i = 0; i < data.length; i++) {
            $this.openName.push(data[i].id);
          }
          $this.navData = data;
          $this.handleMenuData(data);

          $this.$nextTick(() => {
            if ($this.$refs.navMenu && $this.$refs.navMenu.update) {
              $this.$refs.navMenu.update();
            }
          });
        }, function (res) {

        }, this);
      },
      getUserInfo(userTypeArr) {
        let $this = this;
        util.ajaxObjPost('/znsj-web/getUserInfo', {
        }, function (res) {
          $this.userData = [];
          let data = res.data;
          data.user.userTypeTxt = $this.getUerTypeTxt(userTypeArr, data.userDetail.userType)
          data.user.userType = data.userDetail.userType;
          $this.userData.push(data.user);
          $this.$store.commit('setState', {
            loginName: res.data.loginName,
            xzqhId: res.data.organization.xzqhId,
            xzqhName: res.data.organization.name,
            userId: res.data.user.id
          });
        }, function (res) {
        }, this);
      },
      logout() {
        window.location.href = this.$store.state.path + '/logout';
      },

    /*
     * 高拍仪弹框仅在ie下弹出
     */
    gpyIsShow() {
        let that = this;
        if(util.isIE()) {
            that.gpySetActive = true;
        }else {
            that.gpySetActive = false;
        }
    },
    /*
     * 打开高拍仪弹框
     */
    openGpyDialog() {
        let that = this;
        if(util.isIE()) {
            that.gpySetActive = true;
        }else {
            that.$Message.warning('您所使用的浏览器不支持高拍仪功能');
        }
    },
    /*
     *关闭弹框
     */
    gpySureOk() {
        this.gpySetActive = false;
        this.$refs.gpyTakePic.initTakePicDriver();
    },
    /**
     * 插件下载
     */
    downPlugin() {
        let that = this;
        that.$refs.downPlugin.pluginVisible = true;
        that.$refs.downPlugin.getPluginList();
    },
    /**
     * 获取用户类型 字典项
     */
    getUseyType(){
        let that = this;
        util.ajaxMerPost('/znsj-web/dic/getDictionarys', {
            pinYinType: 'yhlx'
        }, function (res) {
            that.getUserInfo(res.data);
        }, function (res) {
            that.$Message.warning('获取数据失败');
        }, that);
    },
    /**
     * 用户类型字典项处理
     */
    getUerTypeTxt(arr, type) {
      for(let i = 0; i < arr.length; i++) {
        if(arr[i].value == type) {
          return arr[i].label;
          break;
        }
      }
    }
  },

  mounted() {
    let $this = this;
    if (this.isNew) {  //判断是否打开新页面，隐藏导航栏
        $this.wrapperHeight = document.documentElement.clientHeight - 60 - 42;
        window.onresize = () => {
            $this.wrapperHeight = document.documentElement.clientHeight - 60 - 42;
        }
    } else {
        $this.wrapperHeight = document.documentElement.clientHeight;
        window.onresize = () => {
            $this.wrapperHeight = document.documentElement.clientHeight;
        }
    }
    if($this.isIndexPage) {
        // 判断高拍仪弹框在ie下是否可以打开
        $this.gpyIsShow();
    }
  },
  created() {
    this.getUseyType();
    this.getNavData();
  },
  destory() {
  }
}
</script>
<style lang="less">
@import "./assets/styles/theme.less";
.el-popup-parent--hidden {
    padding-right: 0 !important;
}
.layout {
    height: 100%;
    width: 100%;

    & > .ivu-layout {
        display: block;
        height: 100%;
        width: 100%;

        .ivu-layout-sider {
            float: left;
            height: 100%;
            height: calc(~"100% - 60px") !important;
            .ivu-layout-sider-children {
                border-right: 1px solid @optBorderColor;
            }
        }

        .iframe-main {
            display: block;
            overflow: hidden;
            height: 100%;

            .iframe-content {
                #app {
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                    min-width: 1166px;
                    background: #eef1f7;
                }
            }
        }

        .opt-bottom {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 40px;
            line-height: 40px;
            background: @optBgColor;
            border-top: 1px solid @optBorderColor;
            cursor: pointer;
            .huanziti {
                position: relative;
                height: 100%;
                width: 85px;
                text-align: center;
                box-sizing: border-box;
                border-right: 1px solid @optBorderColor;
                i {
                    font-size: 20px;
                }
                .huanziti-font {
                    padding: 0 20px;
                    position: absolute;
                    bottom: 45px;
                    left: 7px;
                    width: 180px;
                    height: 45px;
                    background: url(./assets/images/common/huanziti-font.png)
                        no-repeat;
                    background-size: 100% auto;
                    text-align: left;
                    span {
                      margin-right: 20px;
                      line-height: 36px;
                      cursor: pointer;
                      &.select {
                        color: #2d8cf0;
                      }
                      &.big {
                        font-size: 16px;
                      }
                      &.normal {
                        font-size: 14px;
                      }
                    }
                }
                .huanfu-logo {
                    padding: 0 30px;
                    position: absolute;
                    bottom: 49px;
                    left: -75px;
                    width: 180px;
                    height: 45px;
                    background: url(./assets/images/common/huanfu-logo.png)
                        no-repeat;
                    background-size: 100% auto;
                    text-align: left;
                    span {
                      position: relative;
                      display: inline-block;
                      margin-right: 15px;
                      width: 21px;
                      height: 14px;
                      border-radius: 3px;
                      cursor: pointer;
                      line-height: 36px;
                      .huanfu-select {
                        position: absolute;
                        bottom: -6px;
                        right: -29px;
                        display: none;
                        background: url(./assets/images/common/huanfu-select.png) no-repeat;
                      }
                      &.select {
                        .huanfu-select {
                          display: block;
                        }
                      }
                      &.light {
                        background: #2d8cf0;
                      }
                      &.dark {
                        background: #71798b;
                      }
                    }
                }
            }
            .shouqi {
                width: 29px;
                box-sizing: border-box;
                text-align: center;
            }
            .zhankai {
                width: 100%;
                box-sizing: border-box;
                text-align: center;
                i {
                    font-size: 23px;
                }
            }
        }
    }
}
</style>
