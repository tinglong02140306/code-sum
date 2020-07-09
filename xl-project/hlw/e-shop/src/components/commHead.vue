<template>
    <div class="commHeadWrap">
        <span class="icon" @click="backEvt"></span>
        <span class="title">{{title}}</span>
        <i v-if="isShow" @click="deleteEvt"></i>
    </div>
</template>

<script>
export default {
    name: "commHead",
    props: {
        title: {
            type: String,
            default: ""
        },
        returnType: {
            type: String,
            default: ""
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        backEvt() {
            if(this.returnType) {
                this.$emit('handleClick');
            } else {
                this.$router.go(-1);
            } 
        },
        deleteEvt() {
            this.$emit('deleteEvt')
        }
    }
};
</script>
<style scoped lang="less">
@import "../assets/styles/color.less";
.commHeadWrap {
    width: 100%;
    height: 1rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    text-align: left;
    z-index:1000;
    span {
        display: inline-block;
        vertical-align: top;
    }
    .icon {
        width: 12%;
        height: 100%;
        background: url(../assets/images/icon-arrow-left.png) center center /
            0.43rem 0.43rem no-repeat;
    }
    .title {
        font-size: 0.4rem;
        width: 76%;
        text-align: center;
        line-height: 1rem;
    }
    i {
        display: inline-block;
        width: 12%;
        height: 100%;
        background: url(../assets/images/icon-del.png) left center /
            0.6rem 0.6rem no-repeat;
        
    }
}
</style>