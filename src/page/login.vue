<template>
<div class="login_page">
  <section class="form_contianer" v-show="showLogin">
    <header>
      <i class="el-icon-tableware"></i>
      <span>外卖管理系统</span>
    </header>
    <el-form :model="loginForm" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
      </el-form-item>
    </el-form>
  </section>
</div>
</template>

<script>
    import api from "../api";
    import {mapActions, mapState} from 'vuex'
    export default {
        name: "login",
        data () {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                },
                showLogin: true
            }
        },
        mounted(){
            this.showLogin = true;
            if (!this.adminInfo.id) {
                this.getAdminData()
            }
        },
        computed: {
            ...mapState(['adminInfo']),
        },
        methods: {
            ...mapActions(['getAdminData']),
            submitForm (formName) {
                this.$refs[formName].validate(async (valid, obj) => {
                  if(valid) {
                      const res = await api.login({user_name: this.loginForm.username, password: this.loginForm.password})
                      if(res.data.status == 1){
                          this.$message({
                              type: 'success',
                              message: '登录成功'
                      })
                          this.$router.push('/layout/index')
                      }else {
                          this.$message({
                              type: 'error',
                              message: res.data.message
                          })
                      }
                }else {
                      if(obj.username){
                          this.$notify.error({
                              title: '错误',
                              message: obj.username[0].message,
                              offset: 100
                          });
                      }else {
                          this.$notify.error({
                              title: '错误',
                              message: obj.password[0].message,
                              offset: 100
                          });
                      }

                      return false;
                  }
            })
            }
        },
        watch: {
            adminInfo: function (newValue) {
                if (newValue.id) {
                    this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
                    this.$router.push('/layout/index')
                }
            }
        }
    }
</script>

<style scoped>
  .login_page{
    position: relative;
    background-image: url('../assets/image/bg.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;

  }
  header{
    font-size: 34px;
    color: #fff;
    text-shadow:5px 2px 6px #000;
    margin-bottom: 12px;
    /*mix-blend-mode: difference;*/
  }
  .form_contianer{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -160px;
    margin-top: -200px;
    width: 320px;
    height: 230px;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: rgba(241,241,241,0.4);

  }
  .submit_btn{
    width: 100%;
    font-size: 16px;
  }
  .el-input, .submit_btn{
    box-shadow: 5px 2px 6px #929292;
  }
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
