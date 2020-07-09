<template>
    <div>
        <van-sticky class="orderWrap">
            <commHead :title="title"></commHead>
        </van-sticky>
        <van-address-edit
            :area-list="areaList"
            :address-info="addressInfo"
            :show-delete="type != '0'"
            show-set-default
            show-search-result
            :search-result="searchResult"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
            @change-area="onChange"
            :addressDetail="addressDetail"
        />
    </div>
</template>
<script>
    import { AddressEdit,Toast,Area,Dialog,Sticky} from 'vant';
    import commHead from "../../components/commHead";
    import AreaList from './area';
    import { mapState,mapMutations} from "vuex";
    import API from "@/api"
    export default {
    name:"editAddress",
    components: {
        [AddressEdit.name]: AddressEdit,
        [Toast.name]: Toast,
        [Area.name]: Area,
        [Dialog.name]: Dialog,
        [Sticky.name]: Sticky,
        commHead,
    },
    data() {
        return {
            title:"编辑收货地址",
            // 指定数据源
            areaList:AreaList,    
            searchResult: [], 
            addressDetail:"",
            type:"",
        }
    },
    computed: {
        ...mapState(["addressInfo","viewType"])
    },
    mounted() {
        if(this.viewType=='orderConfirm') {
            this.updateAddressInfo({})
        }
        if(!this.addressInfo.addressId) {
            this.type = 0
        }
    },
    methods:{
        ...mapMutations(["updateAddressInfo", ]),
        onSave(content) {
            console.log(this.addressInfo)
            console.log('保存content',content) 
            if(content.addressId) {
                // 编辑地址
                const params ={
                    address_id:content.addressId,
                    province:content.province,
                    city:content.city,
                    area:content.county,
                    address:content.addressDetail,
                    area_code:content.areaCode,
                    fullname:content.name,
                    link_phone:content.tel,
                    is_default:content.isDefault,
                }
                console.log('编辑传参',params)
                API.updateAddress(params).then(res => {
                    console.log("updateAddress：>>>>>>>>>>>>>>>>");
                    Toast.success('修改地址成功');
                    this.$router.push({
                        path:'/addressList',
                    })
                }).catch(error => {
                    console.log(error);
                    Toast.fail(error.message);
                });
            }else {
                // 新增地址
                const params ={
                    province:content.province,
                    city:content.city,
                    area:content.county,
                    address:content.addressDetail,
                    area_code:content.areaCode,
                    fullname:content.name,
                    link_phone:content.tel,
                    is_default:content.isDefault,
                }
                console.log('新增传参',params)
                API.addAddress(params).then(res => {
                    console.log("addAddress：>>>>>>>>>>>>>>>>");
                    Toast.success("新增地址成功");
                    if(this.viewType=='orderConfirm') {
                        this.$router.push({
                            name:'orderConfirm',
                            params:{
                                pageType:"editAddress",
                            }
                        })
                        return;
                    }
                    this.$router.push({
                        path:'/addressList',
                    }) 
                }).catch(error => {
                    console.log(error);
                    Toast.fail(error.message);
                });
            }
        },
        onDelete(content) {
            console.log('删除content',content)
            const params = {address_id:content.addressId}
            // 删除地址
            console.log('删除传参',params)
            API.deleteAddress(params).then(res => {
                console.log("deleteAddress：>>>>>>>>>>>>>>>>");
                this.updateAddressInfo({})
                this.$router.push("/addressList");
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
        onChange(e){
            console.log(e)

        },
    }
}
</script>
<style scoped>
.van-button--danger {
    color: #fff;
    background-color: rgb(243, 58, 34);
    border: 0.02667rem solid rgb(243, 58, 34);
}
</style>