/*
 * @Author: tinglong
 * @Date: 2019-01-03
 * @Description: 高拍仪插件下载弹框
 */
<template>
    <div id="downPluginDio">
        <el-dialog
            title="插件下载"
            :visible.sync="pluginVisible"
            width="800px"
            height="600px"
            custom-class="gpy-plugin-dialog">
            <el-table :data="pluginData">
                <el-table-column class="font-min" prop="fileName" label="插件名称">
                    <template slot-scope="scope">
                        <span class="item-text">{{ scope.row.fileName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" class="font-min" prop="fileSize" label="大小">
                    <template slot-scope="scope">
                        <span class="item-text">{{ scope.row.fileSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" class="font-min" prop="fileType" label="格式">
                    <template slot-scope="scope">
                        <span class="item-text">{{ scope.row.fileType }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button class="font-min" type="text" size="small" @click="downPluginEvent(scope.row.fileName)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import unit from "@/api";
export default {
    data() {
        return {
            // pluginData: [{
            //     fileName: '良田高拍仪插件',
            //     fileSize: '36.04M',
            //     fileType: 'ZIP',
            // },{
            //     fileName: '汉王高拍仪插件',
            //     fileSize: '26.8M',
            //     fileType: 'ZIP',
            // }],
            pluginData: [],
            pluginVisible: false
        }
    },
    methods: {
        /**
         * 插件下载点击事件
         */
        downPluginEvent(name) {
            let that = this,
                path = that.$store.state.path;
            window.location.href = path+ '/plugins/download?fileName='+ encodeURI(name);
        },
        /**
         * 插件列表数据请求
         */
        getPluginList() {
            let that = this;
            unit.ajaxMerPost('/bog-receive-web/plugins/pluginList', {} ,function(res) {
                let data = res.data;
                that.pluginData = data;
            },function(error) {
                that.$Message.error('数据请求失败');
            }, that);
        },
    }
}
</script>
<style lang="less">
#downPluginDio {
    // 高拍仪插件下载弹框
    .gpy-plugin-dialog {
        .el-table {
            border: 1px solid #ccc;
            border-bottom: none;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ddd;
        }
        .el-dialog__footer {
            border-top: 1px solid #ddd;
        }
        .el-dialog__body {
            min-height: 300px;
        }
    }
}
</style>