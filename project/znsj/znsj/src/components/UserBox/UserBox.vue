<template>
    <div :class="changeClass" @click="handleText">
        <div :class="changeClassBox">
            <slot name="textPeople"></slot>
        </div>
        <slot :class="changeClassImg" name="imgUrl"></slot>
    </div>
</template>

<script>
export default {
    name: "UserBox",
    data() {
        return {
            flag1: true,
            flag2: true
        }
    },
    props: {
        boxType: {//1为我的发问框样式，2是系统的回复框样式
            type: Number,
            default: 1
        }
    },
    computed: {
        changeClass() {
            return this.boxType == 1 ? 'UserBoxA' : 'UserBoxB';
        },
        changeClassBox() {
            return this.boxType == 1 ? 'dialogtypeA' : 'dialogtypeB';
        },
        changeClassImg() {
            return this.boxType == 1 ? 'img-sty-a' : 'img-sty-b';
        }
    },
    methods: {
        handleText(e) {
            let self = e.target || e.srcElement,
                handleText = self.closest('.handle-text'),
                handleNext = self.closest('.next'),
                nextTo = self.closest('.nextTo');
            if (handleNext) {
                this.$emit('handleText', 'next');
            } else if (nextTo) {
                this.$emit('handleText', 'nextTo');
            } else if (self.nodeName == 'INPUT') {
                this.$emit('handleText', 'go');
            } else if (handleText) {
                this.$emit('handleText', handleText.textContent);
            }
        }
    }
};
</script>

<style scoped>
/*用户对话框样式*/
.UserBoxA {
    text-align: right;
    margin: 16px 10px 16px 20%;
}

.UserBoxB {
    text-align: left;
    margin: 16px 20% 16px 10px;
}

.dialogtypeA {
    display: inline-block;
    background: #ffffff;
    border-radius: 20px 0 20px 20px;
    box-shadow: -8px 2px 16px #f5f5f5;
    min-height: 14px;
    min-width: 180px;
    max-width: 354px;
    font-size: 15px;
    text-align: center;
    padding: 14px;
    /* width: 80%; */
}

.dialogtypeB {
    display: inline-block;
    background: #f2f9ff;
    /* border-radius:0 60px 60px 60px; */
    border-radius: 0 20px 20px 20px;
    box-shadow: -8px 2px 16px #f5f5f5;
    min-height: 14px;
    min-width: 200px;
    max-width: 354px;
    font-size: 15px;
    text-align: center;
    padding: 14px;
    border: 1px solid #aad4f4;
}

.img-sty-a {
    border-radius: 60px;
    float: right;
    margin: 0 14px 0 9px;
    width: 50px;
    height: 50px;
}

.img-sty-b {
    border-radius: 60px;
    float: left;
    margin: 0 14px 0 9px;
    width: 50px;
    height: 50px;
}
</style>
