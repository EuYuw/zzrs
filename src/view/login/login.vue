<template>
  <el-container class="h100">
    <el-header class="lh60"><label>郑州热水</label></el-header>
    <el-main>
      <el-form class="baseForm" :model="loginForm" v-if="lor === 1" label-width="100px" label-position="right">
        <el-form-item label="手机号">
          <el-input v-model="loginForm.tel" maxlength="11" @keyup.native="formatTelPhone" @blur="formatTelPhone" autocomplete="off"><i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w100" type="primary" :loading="btnSubLoading" @click="submitLoginForm">登录</el-button>
          <a href="javascript:void(0)" @click.prevent="lor = 2">注册</a><a href="javascript:void(0)" class="fr">忘记密码?</a>
        </el-form-item>
      </el-form>

      <el-form class="baseForm registerForm" :model="registerForm" v-if="lor === 2" label-width="100px" label-position="right">
        <el-form-item label="手机号">
          <el-input v-model="registerForm.tel" maxlength="11" @keyup.native="formatResTelPhone" @blur="formatResTelPhone" autocomplete="off"><i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="registerForm.surePassword" type="password" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
        </el-form-item>
        <el-form-item label="水表号">
          <el-input v-model="registerForm.meterNumber" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-people ml5"></i></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="registerForm.verifyCode" class="codeInput" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
          <el-button type="primary" @click="getVerifyCode" id="getCodeBtn" class="getCodeBtn" :disabled="codeBtnDisabled" plain>{{codeBtnText}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="w100" type="primary" :loading="btnSubLoading" @click="submitResgisterForm">注册</el-button>
          <a href="javascript:void(0)" @click.prevent="resToLogin('1')">去登录</a>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="lh60"></el-footer>
  </el-container>
</template>

<script>
  import {userAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: 'login',
    data() {
      return {
        btnSubLoading: false,
        codeBtnDisabled: false,
        codeBtnText: '获取验证码',
        countDown: null,
        lor: 1,// 1 login  2 register
        loginForm: {
          tel: '',
          password: '',
        },
        registerForm: {
          tel: '',
          password: '',
          surePassword: '',
          meterNumber: '',
          verifyCode: ''
        }
      };
    },
    watch: {
      lor: 'resetData'
    },
    methods: {
      validateLoginForm() {//验证登录表单
        let res = 1;
        if(this.loginForm.tel == ''){
          res = '请输入手机号';
        }else if(this.loginForm.tel.length != 11){
          res = '请输入11位手机号';
        }else if(this.loginForm.password == ''){
          res = '请输入密码';
        }else{
          res = 1;
        }
        return res;
      },
      submitLoginForm() {//登录
        let vm = this, result = vm.validateLoginForm();
        if (result === 1) {
          let pm = vm.loginForm;
          pm.type = 'portal';
          vm.btnSubLoading = true;
          setTimeout(() => {vm.btnSubLoading = false;}, 1500);
          userAPI.login(pm).then(res => {
            if (res) {
              sessionStorage.removeItem('routerAuth');//router历史表
              vm.$store.commit("user/saveLogin", res);
              vm.$router.push({path: '/home'});
            }
          }).catch(error =>{
            vm.$message({message: '手机号或密码错误', type: 'error'});
          });
        } else {
          vm.$message({message: result, type: 'warning'});
        }
      },
      validateResgisterForm() {//验证注册表单
        let res = 1;
        if(this.registerForm.tel == '' || this.registerForm.tel.length != 11 || !/^1\d{10}$/.test(this.registerForm.tel)){
          res = '请输入正确格式的手机号';
        }else if(this.registerForm.password == ''){
          res = '请输入密码';
        }else if(this.registerForm.password.length < 6 || this.registerForm.password.length > 18){
          res = '密码长度至少6位最多18位';
        }else if(this.registerForm.password != this.registerForm.surePassword){
          res = '密码与确认密码不一致';
        }else if(this.registerForm.meterNumber == ''){
          res = '请输入水表号';
        }else if(this.registerForm.verifyCode == ''){
          res = '请获取并输入验证码';
        }else{
          res = 1;
        }
        return res;
      },
      submitResgisterForm() {//注册
        let vm = this, result = vm.validateResgisterForm();
        if(result === 1){
          vm.btnSubLoading = true;
          userAPI.register(vm.registerForm).then(res => {
            vm.btnSubLoading = false;
            if(res.msg == 'ok'){
              vm.$message({message: '注册成功', type: 'success'});
              vm.resToLogin(1);
            }else{
              vm.$message({message: res.msg, type: 'error'});
            }
          }).catch(error => {
            vm.btnSubLoading = false;
            if(error.response.data){
              vm.$message({message: error.response.data.msg, type: 'error'});
            }
          });
        }else{
          vm.$message({message: result, type: 'warning'});
        }
      },
      getVerifyCode() {//获取验证码
        let vm = this, second = 60;
        if(vm.registerForm.tel.length != 11 || !/^1\d{10}$/.test(vm.registerForm.tel)){
          vm.$message({message: '请输入正确格式的手机号', type: 'warning'});
        }else{
          vm.codeBtnDisabled = true;
          vm.codeBtnText = '60s后可获取';
          vm.countDown = setInterval(() => {
            second--;
            if(second > 0){
              vm.codeBtnText = second + 's后可获取';
            }else{
              vm.resToLogin();
            }
          }, 1000);
          userAPI.getCode({mobileTel: vm.registerForm.tel}).then(res => {//获取验证码
            vm.$message({message: '验证码发送成功', type: 'success'});
          }).catch(error => {
            vm.resToLogin();
          });
        }
      },
      resToLogin(flag) {//清除定时 是否跳转
        clearInterval(this.countDown);
        this.countDown = null;
        this.codeBtnDisabled = false;
        this.codeBtnText = '获取验证码';
        if(flag){
          this.lor = 1;
        }
      },
      resetData() {
        this.btnSubLoading = false;
        Object.assign(this.$data.loginForm, this.$options.data().loginForm);
        Object.assign(this.$data.registerForm, this.$options.data().registerForm);
      },
      formatTelPhone() {
        this.loginForm.tel = formatUtils.num(this.loginForm.tel);
      },
      formatResTelPhone() {
        this.registerForm.tel = formatUtils.num(this.registerForm.tel);
      }
    }
  }
</script>
<style scoped lang="scss">
  .baseForm{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    width: 400px;
    height: 200px;
    &.registerForm{
      margin-top: -210px;
      height: 420px;
    }
  }
  .codeInput{
    width: 65%;
  }
  .getCodeBtn{
    position: absolute;
    right: 0;
    top: 0;
    padding: 12px 0;
    width: 34%;
  }
  .ml5{
    margin-left: 5px;
  }
  .lh60{
    line-height: 60px
  }
</style>
