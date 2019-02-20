<template>
  <el-dialog title="重置密码" :close-on-click-modal="!resetPsdDialogShow"
             :show-close="!btnSubLoading" width="600px" :visible.sync="resetPsdDialogShow" @closed="closed">
    <el-form :model="resetPsdForm" ref="resetPsdForm" label-width="120px">
      <el-form-item label="新密码">
        <el-input type="password" v-model="resetPsdForm.password" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="resetPsdForm.passwordConfirm" maxlength="18"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetPsdDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subResetPsdForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {userAPI} from "@/api/api";

  export default {
    name: "resetPassword",
    data() {
      return {
        resetPsdDialogShow: false,
        btnSubLoading: false,
        resetPsdForm: {
          password: '',
          passwordConfirm: ''
        }
      }
    },
    methods: {
      validateSubForm(){
        let res = 1;
        if(this.resetPsdForm.password == ''){
          res = '新密码不能为空';
        }else if(this.resetPsdForm.password.length < 6 || this.resetPsdForm.password.length > 18){
          res = '新密码长度为6-18位';
        }else if(this.resetPsdForm.password  != this.resetPsdForm.passwordConfirm){
          res = '新密码与确认密码不一致';
        }else{
          res = 1;
        }
        return res;
      },
      subResetPsdForm() {
        let vm = this, result = vm.validateSubForm();
        if(result === 1){
          vm.btnSubLoading = true;
          let pm = vm.resetPsdForm;
          pm.userId = JSON.parse(vm.$store.getters.userCurrent).id;
          userAPI.resetPassword(pm).then(res => {
            vm.btnSubLoading = false;
            if(res.msg == 'ok'){
              vm.$message({message: '重置密码成功', type: 'warning'});
              vm.resetPsdDialogShow = false;
            }else{
              vm.$message({message: res.msg, type: 'warning'});
            }
          }).catch(error => {vm.btnSubLoading = false;});
        }else{
          vm.$message({message: result, type: 'warning'});
        }
      },
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
