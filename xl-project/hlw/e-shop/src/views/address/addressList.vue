<template>
    <div>
        <van-sticky class="orderWrap">
            <commHead :title="title" :returnType="returnType" @handleClick="handleClick"></commHead>
        </van-sticky>
        <van-address-list
            v-model="chosenAddressId"
            :list="addressList"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select	="onSelect"
        /> 
    </div>
</template>
<script>
    import { AddressList,Toast,Sticky} from 'vant';
    import { mapState,mapMutations } from "vuex";
    import commHead from "../../components/commHead";
    import API from "@/api"
export default {
    name:"addressList",
    components: {
        [AddressList.name]: AddressList,
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        commHead,
    },
    data() {
        return {
            title:"我的收货地址",
            chosenAddressId:'',
            addressList:[],
            pageType:"",
            returnType: 'addressList'
        }
    },
    computed: {
        ...mapState(["viewType"])
    },
    mounted () {
        this.getAddressList()
    },
    methods:{
        ...mapMutations(["updateAddressInfo", ]),
        handleClick() {
            if(this.viewType=='addressList') {
                this.$router.push({name:'orderConfirm'});
            }else {
                this.$router.push({name:'mineHome'});
            }
        },
        // 获取地址列表
        getAddressList() {
            API.addressList().then(res => {
                console.log("addressList：>>>>>>>>>>>>>>>>");
                console.log(res);
                if(res.data) {
                    this.addressList = (res.data);
                    this.addressList.forEach(item => {
                        item.id = item.address_id
                        item.name = item.fullname
                        item.tel = item.link_phone
                        item.addressDetail =  item.address
                        item.address = item.province + item.city + item.area + item.address
                        item.isDefault = item.is_default
                        item.addressId = item.address_id
                        item.areaCode = item.area_code
                    })
                }else {
                    Toast.fail("暂无任何地址,请您新增地址")
                }
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
        onAdd() {
            this.$router.push({
                name:'editAddress',
            })
            this.updateAddressInfo({})
        },
        onEdit(item, index) {
            console.log('点击编辑item',item)
            const addressInfo = item
            this.updateAddressInfo(addressInfo)
            this.addressList=[]
            this.$nextTick(() => {
                this.$router.push("/editAddress");
            });
        },
        onSelect(item, index) {
            console.log('选中item',item)
            console.log('选中index',index)
            const addressInfo = item 
            this.updateAddressInfo(addressInfo)
            if(this.viewType=='addressList') {
                this.$router.push({
                    name:'orderConfirm',
                    params:{
                        pageType:"addressList",
                        id:item.id
                    }
                })
            }
        }
    }
}
</script>
<style scoped>
.van-address-list {
    padding-left: 0;
    padding-right: 0;
}
.van-tag--danger {
    background-color: rgb(243, 58, 34);
}
.van-button--danger {
    color: #fff;
    background-color: rgb(243, 58, 34);
    border: 0.02667rem solid rgb(243, 58, 34);
}
</style>