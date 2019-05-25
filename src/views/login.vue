<template>
  <div style="width: 500px;margin: 10vh auto">
    <h2 style="text-align: center;color: #409EFF">系统登陆</h2>
    <el-form ref="loginForm" :model="loginForm" :rules="myrule" label-width="80px" @submit.native.prevent="doLogin('loginForm')">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" :autofocus="true" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" show-password clearable placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label="验证码">
        <el-input v-model="loginForm.captcha" clearable :maxlength="4" :minlength="4" placeholder="请输入验证码">
          <template slot="append"><img src="http://localhost:8881/authcode" @click="getCaptcha" style="cursor:pointer;"/></template>
        </el-input>
        <!--<img src="http://localhost:8881/authcode"/>-->
      </el-form-item>

      <!--<el-form-item>-->
      <!--<el-switch v-model="remember" active-text="记住用户名" ></el-switch>-->
      <el-switch v-model="loginForm.remember" active-text="下次自动登陆" ></el-switch>
      <!--</el-form-item>-->
      <div style="margin-top: 15px;margin-bottom: 15px;"></div>

      <!--<el-form-item>-->
      <el-button type="primary" style="width: 100%" native-type="submit">登陆</el-button>
      <!--</el-form-item>-->
    </el-form>
  </div>
</template>

<script>
  import StorageUtil from '@/common/StorageUtil'

  export default {
    data() {
      return {
        msg: 'vue模板页',

        loginForm:{
          remember:false,
          username:'',
          password:'',
          captcha:''
        },
        myrule:{
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
          ],
//          captcha: [
//            {required: true, message: '请输入验证码', trigger: 'blur'},
//            {min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur'}
//          ],
        }
      }
    },
    methods:{
      doLogin(formRef) {
        this.$refs[formRef].validate((valid) => {
          if (valid) {
//            if (this.remember) {
            StorageUtil.saveUsername(this.loginForm.username)
//            }
            this.$get('/doLogin', {params: this.loginForm}).then(resp => {
//          console.log(typeof(resp.data),"--resp.data-- ",resp.data);
              this.$store.state.tagsview.username = this.loginForm.username
              this.$commonFn.methods.hintResult(resp, 'msg', () => this.$router.push('/welcome'), this)
            })
          }
        })
      },
      getCaptcha($event) {
//        console.log($event.target);
        $event.target.src=$event.target.src+'?time='+new Date().getTime()
      }
    },
    mounted() {
      this.$get('/doLogin').then(resp=>{
        this.$store.state.tagsview.username = resp.data.data
        this.$commonFn.methods.hintResult(resp, 'msg', () => this.$router.push('/welcome'), this)
      })
      this.loginForm.username=StorageUtil.readUsername()
    }
  }
</script>

<style>
  /*.el-input-group__append{*/
  /*background-color: #111111;*/
  /*}*/
  .el-input-group__append, .el-input-group__prepend{
    /*height: 100px;*/
    padding: 0;
    border: none;
  }
</style>
