<template>
    <div class="tag-wrap">
        <svg :width='width' :height='height' >
            <a :href="tag.href" v-for='tag in tags' :fill="tag.color">
                <text :x='tag.x' :y='tag.y' :font-size='20 * (600/(600-tag.z))' :fill-opacity='((400+tag.z)/600)'>
                    {{tag.text}}
                </text>
            </a>
        </svg>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // width: 700,  //宽度
            // height: 700,  //长度
            // tagsNum: 20,
            RADIUS: this.radius || 100,  //3D标签云的半径
            speedX: this.speed.x || Math.PI / 360,  //X方向角速度
            speedY: this.speed.y || Math.PI / 360,
            tags: []
        }
    },
    props: [
        "width",
        "height",
        "tagArr",
        "radius",
        "speed"
    ],
    computed: {
        CX() {
            return this.width / 3;
        },
        CY() {
            return this.height / 2;
        }
    },
    created() {//初始化标签位置
        let tags = [];
        let colors = ["#43b2de", "#004a83", "#93d2f4", "#0096d3", "#008cd6"];
        for (let i = 0; i < this.tagArr.length; i++) {
            let tag = this.tagArr[i];
            let k = -1 + (2 * (i + 1) - 1) / this.tagArr.length;
            let a = Math.acos(k);
            let b = a * Math.sqrt(this.tagArr.length * Math.PI);
            // tag.text = i + '测试';
            tag.x = this.CX + this.RADIUS * Math.sin(a) * Math.cos(b);
            tag.y = this.CY + this.RADIUS * Math.sin(a) * Math.sin(b);
            tag.z = this.RADIUS * Math.cos(a);
            //添加自定义颜色
            tag.color = this.tagArr[i].color ?  this.tagArr[i].color : colors[this.rnd(0, 4)];
            tag.href = "javascript:void(0)";
            tags.push(tag);
        }
        this.tags = tags;
    },
    mounted() {//使球开始旋转
        setInterval(() => {
            this.rotateX(this.speedX);
            this.rotateY(this.speedY);
        }, 50)
    },
    methods: {
        rnd(min, max) {  //随机在一个区间取个数字
            return min + Math.floor(Math.random() * (max - min + 1));
        },
        rotateX(angleX) {
            var cos = Math.cos(angleX);
            var sin = Math.sin(angleX);
            for (let tag of this.tags) {
                var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
                var z1 = tag.z * cos + (tag.y - this.CY) * sin;
                tag.y = y1;
                tag.z = z1;
            }
        },
        rotateY(angleY) {
            var cos = Math.cos(angleY);
            var sin = Math.sin(angleY);
            for (let tag of this.tags) {
                var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
                var z1 = tag.z * cos + (tag.x - this.CX) * sin;
                tag.x = x1;
                tag.z = z1;
            }
        },
        listener(event) {//响应鼠标移动
            var x = event.clientX - this.CX;
            var y = event.clientY - this.CY;
            this.speedX = x * 0.0001 > 0 ? Math.min(this.RADIUS * 0.00002, x * 0.0001) : Math.max(-this.RADIUS * 0.00002, x * 0.0001);
            this.speedY = y * 0.0001 > 0 ? Math.min(this.RADIUS * 0.00002, y * 0.0001) : Math.max(-this.RADIUS * 0.00002, y * 0.0001);
        }
    }
};
</script>
<style scoped>
.tag-wrap {
  text-align: center;
}
</style>

