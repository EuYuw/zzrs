<template>
  <el-dialog :title="submitType == 1 ? '新增角色' : '编辑角色' " :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="600px" @closed="dialogClosed">
    <el-form :model="roleSubForm" label-width="120px">
      <el-form-item label="角色编码">
        <el-input v-model="roleSubForm.code" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="roleSubForm.name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="roleSubForm.description" maxlength="200"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subRoleOperForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {roleAPI} from "@/api/api";

  export default {
    name: "roleOper",
    data() {
      return {
        submitType: 1,
        dialogShow: false,
        btnSubLoading: false,
        roleSubForm: {
          id: '',
          code: '',
          name: '',
          description: ''
        }
      }
    },
    mounted() {

    },
    methods: {
      validateSubForm() {
        let res = 1;
        if (this.roleSubForm.code == '') {
          res = '请输入角色编码';
        } else if (this.roleSubForm.name == '') {
          res = '请输入角色名称';
        } else {
          res = 1;
        }
        return res;
      },
      subRoleOperForm() {
        let vm = this, flag = vm.validateSubForm();
        if (flag === 1) {
          vm.btnSubLoading = true;
          if(vm.submitType == 1){//add
            roleAPI.checkRoleCode({code: vm.roleSubForm.code}).then(res => {
              if(res){
                vm.btnSubLoading = false;
                vm.$message({message: '当前角色编码已存在', type: 'warning'});
              }else{
                roleAPI.add(vm.roleSubForm).then(res => {
                  vm.btnSubLoading = false;
                  if(res.msg == 'ok'){
                    vm.$message({message: '新增成功', type: 'warning'});
                    vm.dialogShow = false;
                    vm.$emit('refreshList', '');
                  }else{
                    vm.$message({message: res.msg, type: 'warning'});
                  }
                }).catch(error => {vm.btnSubLoading = false;});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
          if(vm.submitType == 2){//edit

          }
        } else {
          vm.$message({message: flag, type: 'warning'});
        }
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
