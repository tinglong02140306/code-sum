/*
 * @Author: rxsong
 * @Date: 2018-08-22
 * @Description: 尾部
 */
<template>
    <div class="footer">
        <span>建设单位：{{devOrg}}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 技术支持：{{techSupport}}</span>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
export default{
    data(){
        return{
            devOrg:'',
            techSupport:''
        }
    },
    methods:{
        getFootData(url,param,proName){
            let that=this;
            unit.ajaxMerPost(url,param,function(res) {
                if(res.flag){
                   that[proName]=res.data;
                }        
            },function(error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        }
    },
    mounted(){
        let baseUrl=this.$store.state.userUrl;
        this.getFootData(baseUrl+'/commer/getSupportInfo',{},'techSupport');
        this.getFootData(baseUrl+'/commer/getConstructInfo',{},'devOrg');
       
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