/*
 * @Author: rxsong
 * @Date: 2018-08-22
 * @Description: 尾部
 */
<template>
    <div class="footer">
        <span>建设单位：{{footMsg}}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 技术支持：{{supportInfo}}</span>
    </div>
</template>
<script>
import util from '@/api/index';
export default {
    data() {
        return {
            footMsg: '',
            supportInfo: ''
        }
    },
    created() {
        this.getConstructInfo();
        this.getSupportInfo();
    },
    methods: {
        getConstructInfo() {
            let _that = this;
            util.ajaxObjPost('/znsj-web/commer/getConstructInfo', {}, function (res) {
                if (res.flag  == true) {
                    _that.footMsg = res.data;
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        getSupportInfo() {
            let _that = this;
            util.ajaxObjPost('/znsj-web/commer/getSupportInfo', {}, function (res) {
                if (res.flag  == true) {
                    _that.supportInfo = res.data;
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        }
    }
}
</script>
<style>
.footer {
    width: 100%;
    height: 42px;
    line-height: 42px;
    background: #edf0f6;
    text-align: center;
}
</style>