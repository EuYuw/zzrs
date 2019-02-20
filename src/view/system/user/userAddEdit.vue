<template>
  <el-dialog :title="this.submitType == 1 ? '新增用户' : '编辑用户'" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="600px" @closed="dialogClosed">
    <el-form :model="userAEForm" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="userAEForm.userName" maxlength="32" :readonly="this.submitType == 2"></el-input>
      </el-form-item>
      <el-form-item label="密码"  v-if="this.submitType == 1">
        <el-input type="password" v-model="userAEForm.password" autocomplete="off" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userAEForm.tel" @keyup.native="formatTel" @blur="formatTel" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userAEForm.email" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="userAEForm.type" class="w100">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subUserAEForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {userAPI} from "@/api/api";
  import {formatUtils, regUtils} from "@/utils/utils";

  export default {
    name: "userAddEdit",
    data() {
      return {
        submitType: 1,
        dialogShow: false,
        btnSubLoading: false,
        userAEForm: {
          userName: '',
          password: '',
          tel: '',
          email: '',
          type: 'portal',
          id: ''
        },
        typeOptions: [
          {label: '用水用户', value: 'portal'},
          {label: '管理用户', value: 'manager'}
        ]
      }
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.userAEForm.userName == ''){
          res = '请输入用户名';
        }else if(this.submitType == 1 && (this.userAEForm.password.length < 6 || this.userAEForm.password.length > 18)){
          res = '请输入6-18位密码';
        }else if(this.userAEForm.tel.length != 11){
          res = '请输入11位手机号码';
        }else if(this.userAEForm.email == '' || !regUtils.email(this.userAEForm.email)){
          res = '请输入正确格式的邮箱';
        }else{
          res = 1;
        }
        return res;
      },
      subUserAEForm() {
        let vm = this, result = vm.validateSubForm();
        if(result === 1){
          let pm = vm.userAEForm;
          //user add
          if(vm.submitType === 1){
            delete pm['id'];
            vm.btnSubLoading = true;
            userAPI.add(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              }else{
                vm.$message({message: res.msg, type: 'warning'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
          //user edit
          if(vm.submitType === 2){
            delete pm['password'];
            vm.btnSubLoading = true;
            userAPI.update(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '编辑成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              }else{
                vm.$message({message: res.msg, type: 'warning'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
        }else{
          vm.$message({message: result, type: 'warning'});
        }
      },
      formatTel() {
        this.userAEForm.tel = formatUtils.num(this.userAEForm.tel);
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
