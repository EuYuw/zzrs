<template>
  <el-dialog :title="this.submitType === 1 ? '添加PLC单元' : '编辑PLC单元' " :close-on-click-modal="!dialogShow"
             :show-close="!btnSubLoading" width="600px" :visible.sync="dialogShow" @closed="closed" append-to-body>
    <el-form v-model="plcUnitAEForm" ref="plcUnitAEForm" :label-width="flw">
      <el-form-item label="单元名称">
        <el-input v-model="plcUnitAEForm.unitName" maxlength="100" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="单元编码">
        <el-input v-model="plcUnitAEForm.code" maxlength="32" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="空间地址">
        <el-input v-model="plcUnitAEForm.spaceAddr" maxlength="100" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="modbus地址">
        <el-input v-model="plcUnitAEForm.modbusAddr" maxlength="100" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subPlcUnitAEForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {plcAPI} from "@/api/api";

  export default {
    name: "plcUnitAddEdit",
    data() {
      return {
        submitType: 1,
        dialogShow: false,
        btnSubLoading: false,
        flw: '120px',
        plcUnitAEForm: {
          id: '',
          plcUnitGroup: {
            id: ''
          },
          unitName: '',
          code: '',
          spaceAddr: '',
          modbusAddr: ''
        }
      }
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.plcUnitAEForm.unitName == ''){
          res = '单元名称不能为空';
        }else if(this.plcUnitAEForm.code == ''){
          res = '单元代码不能为空';
        }else if(this.plcUnitAEForm.spaceAddr == ''){
          res = '空间地址不能为空';
        }else if(this.plcUnitAEForm.modbusAddr == ''){
          res = 'modbus地址不能为空';
        }else{
          res = 1;
        }
        return res;
      },
      subPlcUnitAEForm() {
        let vm = this, result = vm.validateSubForm();
        if(result === 1){
          vm.btnSubLoading = true;
          let pm = vm.plcUnitAEForm;
          if(vm.submitType === 1){
            delete pm['id'];
            plcAPI.unitAdd(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                //vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
          if(vm.submitType === 2){
            plcAPI.unitUpdate(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '编辑成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
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
