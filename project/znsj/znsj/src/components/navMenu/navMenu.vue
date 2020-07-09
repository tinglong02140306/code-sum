/*
 * @Author: qijiang 
 * @Date: 2018-09-30 21:18:44 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-05 10:55:26
 */
<template>
    <div>
        <Menu ref="contactMenu" :mode="mode" :open-names="openName" :active-name="menuState" @on-select="selectEvt" width="180" v-show="!showNav">
            <label v-for="navMenu in navData">
                <Submenu :name="navMenu.id" v-if="navMenu.items.length != 0">
                    <template slot="title">
                        <i  v-if="navMenu.title == '收件中心'" class="iconfont icon-nav-shoujianzhongxin"></i>
                        <i  v-else-if="navMenu.title == '系统设置'" class="iconfont icon-shezhi"></i>
                        <i  v-else-if="navMenu.title == '统计分析'" class="iconfont icon-web-icon-"></i>
                        <img v-else-if="navMenu.icon" :src="navMenu.icon"></img> {{navMenu.title}}
                    </template>
                    <navMenu :navData="navMenu.items"></navMenu>
                </Submenu>
                <MenuItem :name="navMenu.id" :to="navMenu.url" v-if="navMenu.items.length == 0">
                <img v-if="navMenu.icon" :src="navMenu.icon"></img> {{navMenu.title}}
                </MenuItem>
            </label>
        </Menu>
        <div v-show="showNav" class="collapsed-nav-wrap">
            <Dropdown v-for="navMenu in navData" placement="right-start" trigger="click"  @on-click="handleClick">
                <a href="javascript:void(0)" class="collapsed-nav" v-if="navMenu.title == '收件中心'" :class="curCollapsed(navMenu.id)">
                    <i class="iconfont icon-nav-shoujianzhongxin"></i>
                </a>
                <a href="javascript:void(0)" class="collapsed-nav" v-else-if="navMenu.title == '系统设置'" :class="curCollapsed(navMenu.id)">
                    <i class="iconfont icon-shezhi"></i>
                </a>
                <a href="javascript:void(0)" class="collapsed-nav" v-else-if="navMenu.title == '统计分析'" :class="curCollapsed(navMenu.id)">
                    <i class="iconfont icon-web-icon-"></i>
                </a>
                <a href="javascript:void(0)" class="collapsed-nav" v-else-if="navMenu.title != '收件中心'||'系统设置'|| '统计分析'" :class="curCollapsed(navMenu.id)">
                    <img :src="navMenu.icon" alt="png" style="width:23px;height: 23px;">
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="item in navMenu.items" :name="item.id" class="font-max">{{item.title}}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>

</template>
<script>
export default {
    name: 'navMenu',
    props: {
        icon: {
            type: String,
            default: 'navicon-round'
        },
        size: {
            type: Number,
            default: 26
        },
        mode: {
            type: String,
            default: 'vertical'
        },
        theme: {
            type: String,
            default: 'dark'
        },
        navData: {
            type: Array,
            default: []
        },
        openName: {
            type: Array
        },
        showNav: {
            type: Boolean
        }
    },
    data() {
        return {
            collapsed: false,
            temp: ''
        }
    },
    computed: {
        menuState: {
            get() {
                return this.$store.state.menuState;
            }
        }
    },
    mounted() {

    },
    created() {
    },
    methods: {
        curCollapsed(id) {
            let flag = false;
            $(this.openName).each(function(index, item){
                if(item == id) {
                    flag = true;
                }
            });
            return flag ?  'cur': '';
        },
        handleClick(val) {
            this.findUrl(val, this.navData);
            this.$router.push(this.temp);
            this.$store.commit('setState', {
                menuState: val
            });
            sessionStorage.menuState = val;
        },
        findUrl(id, data) {
            let len = data.length,
                temp = '';
            for (let i = 0; i < len; i++) {
                if(data[i].id == id) {
                    this.temp =  data[i].url;
                    break;
                } else {
                    if(data[i].items && data[i].items.length > 0) {
                        this.findUrl(id, data[i].items);
                    }   
                }
            }
        },
        selectEvt(val) {
            this.$store.commit('setState', {
                menuState: val
            });
            sessionStorage.menuState = val;
        },
        update() {
            let $this = this;
            this.$nextTick(() => {
                $this.$refs.contactMenu.updateOpened();
                $this.$refs.contactMenu.updateActiveName();
            });
        }
    }
}
</script>
<style lang="less">
.ivu-menu-submenu-title img,
.ivu-menu-item img {
    width: 15px;
    height: 15px;
    vertical-align: middle;
}
.ivu-menu-submenu-title {
    .icon-nav-shoujianzhongxin {
        font-weight: bold;
    }
}
.collapsed-nav-wrap {
    padding: 20px 0 0 5px;
    .ivu-dropdown {
        margin-bottom: 15px;
    }
    .collapsed-nav {
        margin-right: 10px;
        display: inline-block;
        width: 44px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-radius: 50%;
        background: #edf0f6;
        i {
            font-size: 23px;
        }
        &.cur {
            background: #2080e4;
            color: #fff;
        }
    }
}
.ivu-select-dropdown {
    top: 20px;
    left: 59px;
    width: 100px;
}
</style>
