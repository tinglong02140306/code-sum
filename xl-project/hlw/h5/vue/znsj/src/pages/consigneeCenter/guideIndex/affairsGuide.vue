/*
 * @Author: lhqin 
 * @Date: 2018-09-30 12:40:23 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-07 15:08:34
 */
<template>
    <div id="affairsGuide">
        <!-- 头部标题部分 -->
        <div class="guid-head">
            <detailHead :titles="titles" :isBackShow="true"></detailHead>
        </div>
        <div class="pr10" v-if="contentData.length > 0">
            <div class="guide-text" >
                <div v-for="(item,index) in contentData" >
                    <p class="content-title">{{item.guideTitle}}</p>
                    <p v-html="item.guideDsc"></p>
                </div>
            </div>
        </div>
        <div class="autoHeight">
            <emptyPage  v-if="contentData.length == 0"></emptyPage>
        </div>
    </div>

</template>
<script>
import unit from '@/api/index';
import detailHead from "@/components/common/detailHead";   // 公共
import emptyPage from "@/components/common/emptyPage";   // 缺省页
export default {
    data() {
        return {
            titles:'指南',//标题
            guideTitle:'',//指南标题
            guideContent:'',//指南内容
            contentData:[],//指南数据源

            params:{}//参数
        };
    },
    methods: {
        /*
        ** 获取指南内容
        */
        getGuideContent(url,obj) {
            let _that = this;
            unit.ajaxMerPost('/znsj-web/' + url, obj, function (res) {
                let data = res.data;
                if(data.length > 0) {
                    _that.contentData = data;
                } else {
                    _that.contentData = [];
                }
            }, function (res) {
                _that.$message.warning('获取数据失败');
            }, _that);
        }
        
    },
    components: {
        detailHead: detailHead,
        emptyPage:emptyPage,
    },
    created() {
        let p,
        url,
        obj;
        p = this.$route.query || {};  
        this.params = JSON.parse(p.params);
        if(this.params.type === '1') {//事项指南
            url = 'matter/getGuide';
            obj = {
                matterCode:this.params.matterCode,
                version:this.params.version
            };
        } else {//事件指南
            url = 'eventSj/getGuide';
            obj = {
                eventCode:this.params.eventCode,
                version:this.params.version
            };
        }
        this.titles = this.params.matterName;
        this.getGuideContent(url,obj);//获取指南内容
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#affairsGuide {
    overflow-y: auto;
    height: 100%;
    padding:10px 20px 20px 20px;
    background-color: #fff;
    display:flex;
    flex-direction:column;
    // .pr10{
    //     height:100%;
    // }
    .guide-text {
        font-size: 14px;
        color: #333;
        .content-title {
            color: #333;
            font-weight: 900;
            padding: 5px 0;
        }
    }
    .guid-head{
        flex:none;
    }
    .autoHeight{
        flex:1;
    }
}
</style>
