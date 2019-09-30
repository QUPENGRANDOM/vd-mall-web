<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">写代码不一定让我快乐</h3>
      </div>

      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginForm.username">
          <i slot="prefix" class="el-input__icon el-icon-user"></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input placeholder="请输入密码" v-model="loginForm.password" show-password>
          <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="18">
          <el-form-item prop="validateCode">
            <el-input placeholder="请输入验证码" v-model="loginForm.validateCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="color: #f4f4f5;text-align: center">
          <div style="line-height: 1;font-size: 18px;padding: 15px;background: radial-gradient(black, transparent);">
            <img :src="validateCodeUrl" v-on:click="refreshValidateCode"/>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-checkbox v-model="loginForm.remember" class="remember-me">记住我</el-checkbox>
        </el-col>
        <el-col :span="12" class="forget-pwd-container"><a>忘记密码?</a></el-col>
      </el-row>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
  </div>
</template>
<script>
import {login} from '@/api/login'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'tongtong',
        password: 'admin',
        validateCode: '',
        remember: true
      },
      loginRules: {
        username: [{required: true, trigger: 'blur'}],
        password: [{required: true, trigger: 'blur'}]
      },
      loading: false,
      validateCodeUrl: '/refresh',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin () {
      this.loading = true
      login(this.loginForm).then((res) => {
        if (res && res.data.code === '200') {
          this.$router.push({path: '/home' || '/'})
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    refreshValidateCode () {
      this.validateCodeUrl = `/refresh?code=${new Date().getTime()}`
    }
  }
}
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  .login-container {
    .el-input {
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #C0C4CC;
    }
  }

</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .remember-me {
      margin-bottom: 5px;
      color: #C0C4CC;
    }

    .forget-pwd-container {
      text-align: right;
      font-size: 12px;
      color: #C0C4CC;

      a {
        cursor: pointer;
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  }
</style>
