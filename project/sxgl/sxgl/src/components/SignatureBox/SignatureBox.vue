<template>
  <div class="signatureBox">
    <div class="visaDetailTop">
      <p class="visaTitle">请签名</p>
    </div>
    <div class="canvasBox" ref="canvasHW">
      <canvas @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' ref="canvasF" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas>
      <ul class="cavansR">
        <li>
          <span class="ope1"></span>
        </li>
        <li>
          <span class="ope2"></span>
        </li>
        <li>
          <span class="ope3"></span>
        </li>
        <li>
          <span class="ope4"></span>
        </li>
        <li>
          <span class="ope5"></span>
        </li>
        <li>
          <span class="ope6"></span>
        </li>
        <li>
          <span class="ope7"></span>
        </li>
      </ul>
    </div>
    <div class="btnBox">
      <button @click="okBtn" class="operateBtn">确定</button>
      <button @click="overwrite" class="operateBtn">重签</button>
      <button @click="cancelBtn" class="operateBtn">取消</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SignatureBox",
  props: {

  },
  data() {
    return {
      points: [],
      context: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false
    }
  },
  created() {

  },
  mounted() {
    let canvas = this.$refs.canvasF;
    canvas.height = this.$refs.canvasHW.offsetHeight;
    canvas.width = this.$refs.canvasHW.offsetWidth - 280;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#fff";
  },
  components: {

  },
  methods: {
    okBtn() {  //确定按钮，保存图片，返回
      let dataUrl = this.context.canvas.toDataURL('image/png');
      localStorage.setItem('signName', dataUrl);
      this.$parent.$emit('close');//
    },
    cancelBtn() {  //取消按钮，保存图片，返回
      this.$parent.$emit('close');//
    },
    //电脑设备事件
    mouseDown(ev) {
      ev = ev || event;
      ev.preventDefault();
      console.log(ev);
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        console.log(obj);
        this.startX = obj.x;
        this.startY = obj.y;
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.points.push(obj);
        this.isDown = true;
      }
    },
    //移动设备事件
    touchStart(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.points.push(obj);
      }
    },
    //电脑设备事件
    mouseMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    //移动设备事件
    touchMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    //电脑设备事件
    mouseUp(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.points.push(obj);
        this.points.push({ x: -1, y: -1 });
        this.isDown = false;
      }
    },
    //移动设备事件
    touchEnd(ev) {
      ev = ev || event;
      ev.preventDefault();
      console.log(ev);
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        };
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(obj.x, obj.y);
        this.context.stroke();
        this.context.closePath();
        this.points.push(obj);
        this.points.push({ x: -1, y: -1 });
      }
    },
    //重写
    overwrite() {
      this.context.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height);
      this.points = [];
    }
  }
}
</script>

<style scoped>
.signatureBox {
  position: absolute;
  top: 0px;
  left: 0px;
  /* width: 1204px; */
  /* height: 800px; */
  box-sizing: border-box;
  overflow: auto;
  background: url(bg.png) 100% 100% no-repeat;
  background-size: 100% 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.visaDetailTop {
  height: 70px;
  line-height: 70px;
  padding: 5px;
  box-sizing: border-box;
  z-index: 2;
  color: #fff;
}
.visaDetailTop p {
  margin: 0px;
  text-align: center;
  color: #fff;
  font-size: 1em;
  position: relative;
}
p.visaTitle {
  width: 100%;
  position: absolute;
  top: 5px;
  left: 0px;
  text-align: center;
  font-size: 1.2em;
}
.btnBack {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: transparent;
  border-color: transparent;
  outline: none;
}
.btnDaoHang {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 2.2em;
  width: 2em;
  z-index: 1;
  background: transparent;
  border-color: transparent;
  outline: none;
}
.visaDetailTop p span {
  color: #fff;
  font-size: 1.2em;
}
.visaDetailTop p:first-of-type {
  float: left;
}
.visaDetailTop p:nth-of-type(2) {
  float: right;
}
.canvasBox {
  padding: 0px 0 0 50px;
  box-sizing: border-box;
  /* width: 1200px; */
  height: 520px;
  flex: 1;
}
canvas {
  border: none;
}
.cavansR {
  float: right;
  margin-right: 42px;
  width: 76px;
  height: 534px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cavansR li {
  list-style: none;
  margin: 15px;
  width: 46px;
  height: 76px;
}
.cavansR li span {
  display: block;
  height: 46px;
}
.cavansR li:hover {
  background: #f3f7fc;
  border: 1px solid #d8d8d8;
}
.cavansR span.ope1 {
  background: url(refresh.png) 50% 50% no-repeat;
}
.cavansR span.ope2 {
  background: url(ope1.png) 50% 50% no-repeat;
}
.cavansR span.ope3 {
  background: url(ope2.png) 50% 50% no-repeat;
}
.cavansR span.ope4 {
  background: url(ope3.png) 50% 50% no-repeat;
}
.cavansR span.ope5 {
  background: url(ope4.png) 50% 50% no-repeat;
}
.cavansR span.ope6 {
  background: url(ope5.png) 50% 50% no-repeat;
}
.cavansR span.ope7 {
  background: url(ope6.png) 50% 50% no-repeat;
}
.btnBox {
  height: 180px;
  padding: 60px;
  text-align: center;
  line-height: 30px;
}
.operateBtn {
  float: left;
  width: 148px;
  height: 48px;
  margin: 0 84px;
  background: transparent;
  cursor: pointer;
  border: none;
  color: #fff;
  border: 2px solid #ffffff;
  line-height: 44px;
  font-size: 20px;
}
.btnBox button:first-of-type {
  background: url(ok.png) 100% 100% no-repeat;
  text-align: center;
  font-size: 20px;
  line-height: 48px;
  color: #00b4ff;
  border: none;
}
.btnBox button:last-of-type {
  background: url(cancel.png) 0 0 no-repeat;
  background-size: 100% 100%;
  text-align: center;
  line-height: 44px;
  font-size: 20px;
  border: none;
}

@media only screen and (min-width: 750px) {
  .signatureBox {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    overflow: visible;
  }
}
</style>