<template>
    <div class="addCardNoWrap">
        <van-sticky>
            <commHead :title="title"></commHead>
        </van-sticky>
        <div class="form-wrap">
            <van-field
                v-model="cardNo"
                type="digit"
                label="卡号"
                maxlength="16"
                placeholder="请填写信联卡卡号"
            />
            <van-field id="PasswordS" v-model="pwd" type="text" label="密码" placeholder="请填写密码" />
            <!-- <van-cell center title="设置默认支付卡" label="提醒：每次下单会默认推荐改卡">
                <template #right-icon>
                    <van-switch v-model="checked" size="24px" />
                </template>
            </van-cell> -->
        </div>
        <div class="btn-wrap">
            <van-button round type="info" size="large" color="#f6390d" @click="bindCardClick">绑定</van-button>
        </div>
    </div>
</template>

<script>
import { Switch, Field, Button, Cell, Toast, Sticky} from "vant";
import { mapState, mapMutations } from "vuex";
import commHead from "../../components/commHead";
import API from "@/api";
export default {
    name: "addCardNo",
    components: {
        [Switch.name]: Switch,
        [Field.name]: Field,
        [Button.name]: Button,
        [Cell.name]: Cell,
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            cardNo: "",
            pwd: "",
            // checked: true, // 默认是true
            title: "绑定信联卡",
            subKeyPad: {},
        };
    },
    methods: {
        ...mapMutations(["updateActiveTab"]),
        // 返回上一页点击事件
        bindCard() {
            let param = {
                card_no: this.cardNo,
                passwd: this.subKeyPad.getPasswordValue()
            };
            Toast.loading({
                message: '加载中...',
                duration: 0,
                forbidClick: true,
            });
            API.xlkBind(param).then((data) => {
                Toast.clear();
                if(data.code == '0000'){
                    Toast('绑卡成功！');
                    this.$router.go(-1);
                }
            }).catch(error => {
                Toast.clear();
                Toast(error);
            });
        },
        // 绑定点击事件
        bindCardClick() {
            let cardNo = this.cardNo.trim(),
                pwd = this.subKeyPad.getPasswordValue();
            if (!cardNo) {
                Toast("请输入卡号！");
                return;
            }
            if (!pwd) {
                Toast("请输入密码!");
                return;
            }
            if(this.subKeyPad.getPasswordLength() != 6) {
                Toast("请输入六位密码!");
                return;
            }
            if (!(cardNo.length == 16)) {
                Toast("请输入正确卡号！");
                return;
            }
            this.bindCard();
        },
        loadPwdBoard(id) {
            let self = this;
            $.ccsk_ready(function() {
                var ParentKeyPad = $.getCCSKeyPad('/xlk-shop/keyboard/encrypt', "Number"); //js封装请求后台返回键盘样式
                self.subKeyPad = ParentKeyPad.init({
                    antiScreenCapture: true,
                    elementId: id, //此处必须和密码输入框的id一致
                    placeholder: "请输入密码",
                    length: 6,
                    input_style: {
                        width: 200,
                        height: 34
                    }
                });
                //键盘加载完成回调函数
                self.subKeyPad.onload(function() {});
                //输入完成回调函数，password为加密后的密文
                self.subKeyPad.complete(function(password) {});
            });  
        }
    },
    mounted() {
        this.loadPwdBoard('PasswordS'); 
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.addCardNoWrap {
    width: 100%;
    height: 100vh;
    background: #f2f2f2;
    .btn-wrap {
        margin: 3rem 4% 0;
        width: 92%;
        .van-button--large {
            height: 1.1rem;
            line-height: 1rem;
        }
    }
}
</style>