<template>
    <div class="mineHome">
        <!--  用户登录-->
        <div v-if="!userInfo" class="user-info-wrapper">
            <div class="avatar-wrapper">
                <img class="avatar" src="../../assets/images/avatar.png" alt="">
            </div>
            <div class="user-wrapper">
                <div class="user-name"></div>
            </div>
        </div>
        <div v-else class="user-info-wrapper">
            <div class="avatar-wrapper">
                <img class="avatar" :src="userInfo.avatar" alt="">
            </div>
            <div class="user-wrapper">
                <div class="user-name">{{userInfo.nickname}}</div>
            </div>
        </div>
        <!-- 中间内容 -->
        <div class="body">
            <div class="tips">
                <div>我的订单</div>
                <div style="color:#8a8a8a;" @click="checkAllOrder">查看全部<van-icon name="arrow" /></div>
            </div>
            <div class="goods-guide">
                <div class="guide-box"  @click="checkPay">
                    <img class="guide-icon" src="../../assets/images/pay.png" alt="">
                    <div class="guide-text">待付款</div>
                </div>
                <div class="guide-box" @click="checkReceive">
                    <img class="guide-icon" src="../../assets/images/receive.png" alt="">
                    <div class="guide-text">待收货</div>
                </div>
                <div class="guide-box" @click="checkComment">
                    <img class="guide-icon" src="../../assets/images/complete.png" alt="">
                    <div class="guide-text">我的评价</div>
                </div>
                <div class="guide-box" @click="checkAfterSales">
                    <img class="guide-icon" src="../../assets/images/after-sales.png" alt="">
                    <div class="guide-text">退款/售后</div>
                </div>   
            </div>
            <div class="tips">
                <div>信联卡信息</div>
                <div class="add-card" @click="addCard">新增</div>
            </div>
            <div class="card-box" v-if="cardList && cardList.length>0" v-for="(item, index) in cardList" :key="index">
                <van-cell-group class="card-input card-left" >
                    <van-field v-model="item.card_no"  placeholder="请绑定您的信联卡" readonly />
                </van-cell-group>
                <div class="card-middle">
                    （余额：{{item.balance}}）
                </div>
                <div class="card-right">
                    <!-- <div class="default"></div> -->
                    <img class="delete" @click="deleteCard(item)" src="../../assets/images/delete.png" alt="">
                </div>
            </div>
            <div v-if="!cardList || cardList.length==0" class="card-box">
                <van-cell-group class="card-input card-left" >
                    <van-field  placeholder="请绑定您的信联卡" readonly />
                </van-cell-group>
                <div class="card-right">
                </div>
            </div>
            <div class="tips">我的服务</div>
            <div class="service-guide">
                <div class="service-box" @click="checkAddress">
                    <img class="guide-icon" src="../../assets/images/address.png" alt="">
                    <div class="service-text">我的地址</div>
                </div>
                <a  class="service-box" :href="'tel:'+tel" style="text-decoration: none;" >
                    <img class="guide-icon" src="../../assets/images/service.png" alt="">
                    <div class="service-text">客服热线</div>
                </a>
                <div class="service-box"  @click="checkOurs">
                    <img class="guide-icon" src="../../assets/images/our.png" alt="">
                    <div class="service-text">关于我们</div>
                </div>   
            </div>
        </div> 
    </div>
</template>
<script>
    import { Field,Cell,Icon,Tabbar,TabbarItem,CellGroup,Dialog,Toast, } from 'vant';
    import {mapState, mapMutations } from "vuex";
    import API from "@/api";
    import Config from "@/utils/config";
 export default {
    name:"mineHome",
    components: {
        [Field.name]: Field,
        [Cell.name]: Cell,
        [Icon.name]: Icon,
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        [CellGroup.name]: CellGroup,
        [Dialog.name]: Dialog,
        [Toast.name]: Toast,
    },
    data() {
        return {
            cardList:[],
            cardNo:"",
            // active:'mine',
            tel:95011,
        }
    },
    computed: {
        ...mapState(["token","userInfo","activeTab"])
    },
    mounted() {
        if(this.token && this.token.length !== 0){ 
            this.getCardList()
            this.updateActiveTab('mine')
        }else {
            this.getCode()
        }
        
    },
    methods:{
        ...mapMutations(["modToken","updateUserInfo","updateActiveTab"]),     
        checkAllOrder() {
            this.$router.push({
                name:'order',
                params: {
                name: '',
                }
            })
        },
        getCode () { 
            const code = this.getUrlParam('code') 
            if (code == null || code === '') {
                window.location.href = Config.oauthUrl;
            } else {
				API.login({code}).then(res=> {
                    console.log('res',res)
                    this.modToken(res.data["auth_token"]);
                    const userInfo = {
						avatar: res.data["avatar"],
                        nickname: res.data["nickname"],
                    };
                    this.updateUserInfo(userInfo);
                    this.getCardList();
				}).catch(error => {
					console.log(error);
                    Toast(error.message);
				});
            }
        },
        getUrlParam (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            let url = window.location.href
            let search = url.split('?')[1]
            console.log("search",search)
            if (search){
                var r = search.substr(0).match(reg)
                console.log('code',r)
                if (r !== null) return unescape(r[2])
                return null
            } else {
                return null
            }
        },
        // 订单列表跳转对应的tab页面
            // 待付款
        checkPay() {
            this.$router.push({
                name:'order',
                params: {
                    name: '1',
                }
            })
        },
          //待收货
        checkReceive() {
            this.$router.push({
                name:'order',
                params: {
                    name: '3',
                }
            })
        },
        // 查看我的评论列表
        checkComment() {
            this.$router.push({name:'myComment',})
        },
        // 退款售后列表
        checkAfterSales() {
            this.$router.push({name:'afterSales',})
        },
        // 新增信联卡
        addCard() {
            if (this.cardList.length==3) {
                Toast('很抱歉，您最多可绑定三张信联卡')
            }else {
                this.$router.push({name:'addCardNo',})
            }
        },
        // 删除卡号
        deleteCard(item) {
            console.log('要删除的item',item)
            this.cardNo = item.card_no
            Dialog.confirm({
                title: '系统提示',
                message: '确定删除么？'
            }).then(() => {
                // 确认删除调取解绑接口
               const params = {card_no:this.cardNo,}
               console.log('删除信联卡传参',params)
                API.unBindCard(params).then(res => {
                    console.log('删除信联卡',res)
                    // this.cardNo=''
                    // 此时再次获取一遍信联卡列表，如果有展示最新的
                    this.getCardList()
                }).catch(error => {
                    console.log(error);
                    Toast.fail('error.message');
                });
            }).catch(() => {
                console.log(error);
                Toast.fail('error.message');
            });
        },
        // 查看我的地址
        checkAddress() {
            this.$router.push({name:'addressList'})
        },
        //关于我们
        checkOurs() {
            this.$router.push({path:'/aboutUs',})
        },
        // 信联卡列表
        getCardList() {
            console.log('调取信联卡列表')
            API.cardList().then(res => {
                console.log('res = ', res)
                console.log("cardList：>>>>>>>>>>>>>>>>");
                if(res.data) {
                    this.cardList = res.data.card_list
                    return;
                }
                this.cardList = [];
            }).catch(error => {
                    console.log('error = ', error)
                    //未绑定卡
                    this.cardList = [];
                    console.log('tag', this.cardList && this.cardList.length>0)

            });
        },
    }
}
</script>

<style lang="less" scoped>
.mineHome {
    background-color: #fff;
    width:100%;
    /* height:calc(100vh - 1.33rem); */
    height: calc(100vh - 50px);
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.body {
	width: 100vw;
	/* height: calc(100vh - 231px); */
    /* margin-bottom:30px; */
}
.tips {
	height: 32px;
    padding:10px 20px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
	align-items: center;
}
.user-info-wrapper {
	height: 120px;
	display: flex;
    align-items: center;
    justify-content: flex-end;
	background: url('data:image/png;base64,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') no-repeat center center;
	background-size: 100% 100%;
}
.avatar-wrapper {
	margin: 0 15px 0 15px;
	height: 100%;
	width: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.login-wrapper {
	flex: 1;
	height: 58px;
	display: flex;
	justify-content: flex-start;
}
.login {
	width: 220px !important;
	height: 100%;
	border-radius: 28px;
	background-color: rgb(80, 127, 248);
	color: white;
	font-family: SourceHanSansCN-Regular;
	margin: 0 !important;
	font-size: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.user-wrapper{
	flex: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}
.user-name{
	font-family: SourceHanSansCN-Regular;
	font-size: 16px;
	color: black;
	margin-left: 8px;
}
/* 订单按钮 */
.goods-guide {
    display: flex;
	justify-content: center;
	align-items: center;
    margin: 10px 0;
}
.guide-box {
    flex:0 0 25%;
}
.guide-icon {
    width:30px;
    height: 30px;
}
.guide-text {
    font-size: 12px;
}
/* 信联卡 */
.card-box{
    /* margin-bottom:10px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 20px;
}
.van-cell {
    padding:7px;
}
.card-left {
    flex:0 0 1;
}
.card-middle {
    flex:0 0 1;
    font-size: 12px;
}
.card-right {
    flex:0 0 1;
    /* display: flex;
    justify-content: space-between;
    align-items: center; */
}
.add-card {
    background-color: #efb336;
    width:60px;
    height: 30px;
    line-height: 30px;
    border-radius: 20px;
}
.van-field__label {
    width:50px !important;
}
.card-input {
    display: inline-block;
    /* width:250px; */
}
.default{
    font-size: 12px;
    color:#ccc;
    display: inline-block;
    /* margin-left: 40px; */
    /* margin-right: 20px; */
}
.delete {
    width:20px;
    height: 20px;
    line-height:20px ;
    display: inline-block;
}
.van-field__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: #ccc !important;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
}
.service-guide {
    display: flex;
	justify-content: flex-start;
	align-items: center;
    /* padding: 0 20px; */
    margin:10px 0 30px;
}
.service-box {
    flex:0 0 25%;
}
.service-text {
    font-size: 14px;
    color:black;
}

[class*=van-hairline]::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    border: none;
    -webkit-transform: scale(.5);
    transform: scale(.5);
}
</style>