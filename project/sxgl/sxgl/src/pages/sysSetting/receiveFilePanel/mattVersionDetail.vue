/*
 * @Author: lhqin 
 * @Date: 2018-10-19 10:06:26 
 * @Last Modified by: lhqin
 * @Last Modified time: 2018-10-22 15:08:17
 */

<template>
    <div id="mattVersion" class="pr20 pb20 pl20">
        <div class="pr10">
            <div id="matterCode" class="hide">{{matterCode}}</div>
            <!-- 版本列表start -->
            <div id="versionWrap" class="list-wrap mt10">
                <el-table :data="mattVersionData" tooltip-effect="light" border>
                    <el-table-column align="center" prop="matterCode" label="事项编号" width="170" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="matterName" label="事项名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="matterVersion" label="版本" width="80" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间" width="130" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="createUser" label="创建人" width="90" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="updateTime" label="更新时间" width="130" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="updateUser" label="更新人" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="状态" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.status === '01' ? '启用':'停用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button type="text" size="large" @click="goMattInfo($event,scope.row,'detail')">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block fr mt10">
                    <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="SizeChange" @current-change="CurrentChange" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </div>
            <!-- 版本列表end -->
        </div>
    </div>
</template>
<script>
import unit from "@/api/index";
export default {
    props: {
        matterCode: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            savaQuery: {},
            mattVersionData: []
        };
    },
    methods: {
        /*
        ** 获取事项配置列表数据
        */
        getVersionData() {
            let _that = this,
            matterCode = $('#matterCode').text(),
                obj = {
                    matterCode: _that.matterCode,
                    pageNum: _that.currentPage,
                    pageSize: _that.pageSize
                };
            unit.ajaxMerPost("/znsj-web/matterAllocation/getMatterVersionPage", obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.total = data.total;
                    _that.currentPage = data.pageNum;
                    data = data.rows;
                    $.each(data, function (index, item) {
                        item.matterCode = matterCode;
                        item.matterName =
                            (item.matterName === null || item.matterName === '') ? "--" : item.matterName;
                        item.matterVersion =
                            (item.matterVersion === null || item.matterVersion === '') ? "--" : item.matterVersion;
                        item.createTime =
                            (item.createTime === null || item.createTime === '') ? "--" : item.createTime;
                        item.createUser =
                            (item.createUser === null || item.createUser === '') ? "--" : item.createUser;
                        item.updateTime =
                            (item.updateTime === null || item.updateTime === '') ? "--" : item.updateTime;
                        item.updateUser =
                            (item.updateUser === null || item.updateUser === '') ? "--" : item.updateUser;
                        item.status =
                            (item.status === null || item.status === '') ? "--" : item.status;
                    });
                    _that.mattVersionData = data;
                } else {
                    _that.$message.warning("请求数据失败");
                }
            }, function (res) {
                _that.$message.warning("请求数据失败");
            }, _that);
        },
        /*
        ** 事项列表每页显示数据量变更
        */
        SizeChange: function (val) {
            let _that = this;
            _that.pageSize = val;
            _that.currentPage = 1;
            _that.getVersionData();
        },
        /*
        ** 事项列表页码变更
        */
        CurrentChange: function (val) {
            let _that = this;
            _that.currentPage = val;
            _that.getVersionData();
        },
        /*
        ** 跳转查看详情
        */
        goMattInfo($event, row, type) {
            let obj = {
                id: row.id,
                type: type
            };
            this.$router.push({
                path: '/addMatters',
                query: obj
            });
        },
        /*
        ** 初始化
        */
        init() {
            this.getVersionData();
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#mattVersion {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    overflow-y: auto;

    .el-table {
        font-size: 16px;
    }

}
</style>
