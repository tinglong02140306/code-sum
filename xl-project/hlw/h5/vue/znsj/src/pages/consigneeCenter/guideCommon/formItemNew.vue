/*
 * @Author: qijiang 
 * @Date: 2018-09-30 21:18:44 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-10 16:39:17
 */
<template>
    <div class="form-new-wrap">
        <div v-for="(item, index) in formData" class="form-new-item">
            <FormItem :key="index" :label="item.classifyName" prop="name" :rules="{required: true, message: '请选择' + item.name, trigger: 'change'}" :show-message="showMes">
                <RadioGroup v-model="item.value" @on-change="eventChange(item, index)" v-if="item.isMulti==0">
                    <Radio :label="obj.situationId" v-for="(obj, i) in item.answerList" :disabled="item.isMultiTrue||item.disaAns">
                        {{obj.answerName}}
                    </Radio>
                </RadioGroup>
                <CheckboxGroup v-model="item.value" @on-change="eventChange(item, index)" v-else>
                    <Checkbox :label="obj.situationId" v-for="(obj, i) in item.answerList" :disabled="item.isMultiTrue||obj.defaultSelect==1">
                        {{obj.answerName}}
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <formItemNew v-if="item.answerClassifyList && item.answerClassifyList.length != 0" :formData="item.answerClassifyList" @eventChange="eventChange"></formItemNew>
        </div>
    </div>
</template>
<script>
import util from "@/api";
export default {
    name: 'formItemNew',
    props: {
        formData: {
            type: Array,
            default: [{
                judgeCond: '完成网报（涉及变更股东及注册资本的不用网报），涉及名称调整的完成网上名称核准',
                judgeStd: '浙江省工商全全程电子化登记平台（http://www.wsdj.zjaic.gov.cn/)—登记注册—立即注册账号（个人用户登录）—企业登记-企业变更—在页面选择相对应的业务（填写完毕后保存并提交）'
            }]
        }
    },
    data() {
        return {
            showMes: false
        }
    },
    methods: {
        eventChange(data, index) {
            debugger
            this.$emit('eventChange', data);
        },
    },
    mounted() {

    },
    created() {

    }
}
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.ivu-form {
    .form-new-wrap {
        margin-top: 20px;
        width: 90%;
        .form-new-item {
            margin: 0 10px;
            padding: 10px 0;
        }
    }
    &>.form-new-wrap {
        margin-left: 0;
        margin-top: 0;
        width: 100%;
        &>.form-new-item {
            padding: 10px 0 0 10px;
            margin-bottom: 20px;
            border: 1px solid #dcdee2;
            .form-new-wrap {
                margin-bottom: 20px;
                border: 1px solid #dcdee2;
                .form-new-item:not(:first-child) {
                    border-top: 1px dashed #dcdee2;
                }
            }
        }
    }
}

// .form-new-wrap {
//     margin-top: 20px;
//     width: 90%;
//     &:first-child {
//         margin-left: 0;
//         margin-top: 0;
//         width: 100%;
//     }
//     .form-new-item {
        
//     }
// }
</style>
