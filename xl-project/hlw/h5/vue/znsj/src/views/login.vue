<template>
	<div class="login-box">
    <div class="login-img">
      <div class="login-icon"></div>
      <div class="login-name">展厅系统</div>
    </div>
    <div class="login-form">
      <div class="login-box-contain">
        <div class="login-head">欢迎使用vue框架</div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="" prop="userName">
            <el-input type="text" v-model="ruleForm.userName" auto-complete="off">
              <i slot="prefix" class="fa fa-user"></i>
            </el-input>
          </el-form-item>
          <div class="line"></div>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off">
              <i slot="prefix" class="fa fa-lock"></i>
            </el-input>
          </el-form-item>
          <div class="line"></div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-foot">版权所有 @ 科大讯飞股份有限公司</div>
	</div>
</template>

  <script>
  export default {
    data () {
      return {
        ruleForm: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$api.login(that.$qs.stringify({userName: that.ruleForm.userName, passwd: that.ruleForm.password})).then(function (data) {
              if (data.flag) {
                that.$store.commit('IS_LOGIN', data.data.userName) // 保存登录信息
                that.$router.push('/')
              } else {
                that.$message({ //
                  message: data.message,
                  type: 'warning',
                  duration: 1000
                })
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .login-box{
    height: 100%;
    min-width: 1000px;
    background:url("../assets/images/login/login_bg.png") no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .login-foot{
      position: absolute;
      bottom:50px;
      color: #fff;
      font-size: 14px;
      right: 0;
      left:0;
      text-align: center;
    }
    .login-img{
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      -webkit-align-items: center;
      position: absolute;
      top: 30px;
      padding-right: 712px;
      right: 0;
      left: 0;
      justify-content: center;
      .login-icon{
        height: 56px;
        width: 54px;
        margin-right: 10px;
        background: url("../assets/images/login/login_03.png") no-repeat;
      }
      .login-name{
        color: #fff;
        font-size: 32px;
        letter-spacing: 3px;
        width: 216px;
      }
    }
    .login-form{
      width:440px;
      padding: 0 50px;
      height: 420px;
      background: #fff;
      border-radius: 2px;
      display: flex;
      align-items: center;
      .login-box-contain {
        width: 100%;
      }
    }
    .login-head{
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 1px;
      line-height: 50px;
      height: 50px;
      text-align: center;
      position: relative;
      top: -25px;;
    }
    i{
      font-size: 24px;
      margin-top: 12px;
      margin-left: 4px;
    }
    .line{
      height: 15px;
    }
  }
</style>
