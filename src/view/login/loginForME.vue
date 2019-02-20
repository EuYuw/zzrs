<template>
  <el-container class="h100">
    <el-header class="lh60"><label>郑州热水管理端</label></el-header>
    <el-main>
      <el-form class="loginForm" :model="loginForm" ref="loginForm" label-width="100px"
               label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" type="text" maxlength="32" autocomplete="off"><i slot="prefix" class="iconfont icon-people ml5"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" maxlength="18" autocomplete="off"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w100" type="primary" :loading="btnLoginLoading" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer clas="lh60"></el-footer>
  </el-container>
</template>

<script>
  import {userAPI} from "@/api/api";
  export default {
    name: 'login',
    data() {
      return {
        btnLoginLoading: false,
        loginForm: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.loginForm.username == ''){
          res = '请输入用户名';
        }else if(this.loginForm.password == ''){
          res = '请输入密码';
        }else{
          res = 1;
        }
        return res;
      },
      submitForm() {
        let vm = this, result = vm.validateSubForm();
        if (result === 1) {
          let pm = vm.loginForm;
          pm.type = 'manager';
          vm.btnLoginLoading = true;
          setTimeout(() => {vm.btnLoginLoading = false;}, 1500);
          userAPI.login(pm).then(res => {
            if (res) {
              sessionStorage.removeItem('routerAuth');//router历史表
              vm.$store.commit("user/saveLogin", res);
              vm.$router.push({path: '/home'});
            }
          }).catch(error =>{
            vm.$message({message: '用户名或密码错误', type: 'error'});
          });
        } else {
          vm.$message({message: result, type: 'warning'});
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .loginForm{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    width: 400px;
    height: 200px;
  }
  .ml5{
    margin-left: 5px;
  }
  .lh60{
    line-height: 60px
  }
</style>
