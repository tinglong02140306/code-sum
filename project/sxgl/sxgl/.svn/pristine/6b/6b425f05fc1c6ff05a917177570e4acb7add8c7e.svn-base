/*
 * @Author: qijiang 
 * @Date: 2018-10-22 15:26:38 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-02-13 20:46:34
 */
<template>
    <div>
        <script :id="id" type="text/plain"></script>
    </div>
</template>
<script>
export default {
    name: 'UE',
    data() {
        return {
            editor: null
        }
    },
    props: {
        defaultMsg: {
            type: String
        },
        config: {
            type: Object
        },
        id: {
            type: String
        }
    },
    mounted() {
        let _this = this;
        this.editor = UE.getEditor(this.id, this.config); // 初始化UE
        this.editor.addListener("ready", function () {
            _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        });
    },
    methods: {
        getUEContent() { // 获取内容方法
            return this.editor.getContent()
        },
        setContent(data) {
            let _this = this;
            _this.editor.setContent(data);
        },
        setDisabled(bool) {
            let _this = this;
            _this.editor.setDisabled();
        }
    },
    destroyed() {
        this.editor.destroy();
    }
}
</script>