<template>
  <div>
    <!--省份-->
    <section class="wrapper" v-if="isProvince">
      <div class="province" v-for="(province,idx) in provinces" :key="province" @click.stop="selectProvince(idx)">
        {{province}}
      </div>
      <div class="wrong" @click.stop="backspace">
        <!-- <icon name="wrong" color="#666" style="border:none;"/> -->
        删除
      </div>
      <div class="confirm" @click.stop="confirm">
        <!--<icon name="right" size="lg" color="#666"/>-->
        确定
      </div>
    </section>
    <!--字母数字-->
    <section class="wrapper" v-if="!isProvince">
      <div :class="{'bg-grey':!tapNum,'bg-white':tapNum}" class="number" v-for="(number,idx) in numbers" :key="number"
           @click.stop="selectNumber(idx)">{{number}}
      </div>
      <div class="alpha" v-for="(alpha,idx) in alphas" :key="alpha" @click.stop="selectAlpha(idx)">{{alpha}}</div>
      <div class="wrong" @click.stop="backspace">
        <!-- <icon name="wrong" size="lg" color="#666" style="border:none;"/> -->
        删除
      </div>
      <div class="confirm" @click.stop="confirm">
        <!-- <icon name="right" size="lg" color="#666"/> -->
        确定
      </div>
    </section>
  </div>
</template>

<script>
	import {Icon} from 'mand-mobile';

	export default {
		props: {
			tapNum: {
				type: Boolean,
				default: false
			},
			isProvince: {
				type: Boolean,
				default: true
			}
		},
		components: {
			Icon
		},
		data() {
			return {
				provinces: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '苏', '琼', '新', '藏'],
				numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
				alphas: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']
			}
		},
		methods: {
			selectProvince(idx) {
				const province = this.provinces[idx];
				this.$emit('selectProvince', province);
			},
			selectNumber(idx) {
				if (!this.tapNum) {
					return;
				}
				const number = this.numbers[idx];
				this.$emit('selectNumber', number);
			},
			selectAlpha(idx) {
				const alpha = this.alphas[idx];
				this.$emit('selectAlpha', alpha);
			},
			backspace() {
				this.$emit('backspace');
			},
			confirm() {
				this.$emit('confirm');
			}
		}
	}
</script>

<style scoped lang="stylus">
  .wrapper
    box-sizing border-box
    padding 10px 15px
    width 750px
    min-height 80px
    display flex
    justify-content flex-start
    flex-wrap wrap
    margin 0
    background-color #dadada
    position relative
    .bg-grey
      background-color #ccc

    .bg-white
      background-color white
    .wrong
      margin 15px 4px
      // width 58px
      // height 60px
      width 88px
      height 60px
      display flex
      justify-content center
      align-items center
      font-size 30px
      border 1px solid #ccc
      background-color white
      border-radius 10px
      color: #272727;
      font-weight: 700;
    .province
      margin 15px 4px
      width 58px
      height 60px
      // width 137px
      // height 60px
      display flex
      justify-content center
      align-items center
      font-size 30px
      border 1px solid #ccc
      background-color white
      border-radius 10px
      color: #272727;
      font-weight: 700;
    .confirm
      margin 15px 4px
      position absolute
      bottom 10px
      right 40px
      // width 58px
      // height 60px
      width 137px
      height 60px
      display flex
      justify-content center
      align-items center
      font-size 30px
      border 1px solid #ccc
      background-color white
      border-radius 10px
      color: #272727;
      font-weight: 700;
    .number
      margin 15px 4px
      width 58px
      height 60px
      display flex
      justify-content center
      align-items center
      font-size 30px
      border 1px solid #ccc
      border-radius 10px

    .alpha
      margin 15px 4px
      width 58px
      height 60px
      display flex
      justify-content center
      align-items center
      font-size 30px
      border 1px solid #ccc
      border-radius 10px
      background-color white
</style>
