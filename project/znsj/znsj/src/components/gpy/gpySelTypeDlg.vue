/*
 * @Author: tinglong 
 * @Date: 2018-11-01 10:45:00 
 * @Last Modified by: tinglong
 * @Last Modified time: 2018-11-01 10:45:00 
 * @description 选择高拍仪-弹框
 */
<template>
	<div id="gpySelTypeDlg">
        <el-dialog
            title="选择高拍仪"
            :visible.sync="gpySetActive"
            width="600px"
            custom-class="gpy-typesel-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false">
            <div class="gpy-wrapper">
                <el-radio-group v-model="gpyConfigInfoLabel">
                    <el-radio v-for="(item,index) in gpyOptions" :key="index" :value="index" :label="item.label" @change="gpyTypeChange">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="gpySureOk">确 定</el-button>
            </span>
        </el-dialog> 
	</div>   
</template>
<script>
import unit from "@/api";   // 公共工具方法
export default {
    props: ['gpySetActive'],
	data () {
        return {
            gpyOptions: [{
                value: 'liangtianXF660R',
                label: '良田XF660R'
            },{
                value: 'liangtianS320R',
                label: '良田S320R'
            },{
                value: 'hanwangE1190PRO',
                label: '汉王E1190PRO'
            },{
                value: 'liangtianS620A3R',
                label: '良田S620A3R'
            }],
            gpyConfigInfoLabel:'良田XF660R'
        }
    },
    methods: {
        /*
         * 高拍仪弹框确认
         */
        gpySureOk() {
            let that = this,
            stateObj = that.$store.state;
            if(!stateObj.gpyConfigInfo) {
                that.$Message.warning('请选择高拍仪类型！');
                return;
            }else {
                that.$emit('gpySureOk');
            }
        },
        /*
        * 高拍仪类型选择change事件
        */
        gpyTypeChange(val) {
            let that = this,
                stateObj = that.$store.state;
            for(let i in that.gpyOptions) {
                if(that.gpyOptions[i].label === val) {
                    that.$store.commit('setState', {
                        gpyConfigInfo: that.gpyOptions[i].value
                    });
                    localStorage.gpyConfigInfo = that.gpyOptions[i].value
                }
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#gpySelTypeDlg {
    position: absolute;
    width: 100%;
    min-width: 1000px;
    height: 100%;
}
.gpy-typesel-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }
    .el-dialog__footer {
        border-top: 1px solid #ddd;
    }
    .gpy-wrapper {
        height: 60px;
    }
}

</style>
