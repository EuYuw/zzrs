<template>
  <el-dialog :title="this.submitType === 1 ? '新增PLC组' : '编辑PLC组' " :close-on-click-modal="!dialogShow"
             :show-close="!btnSubLoading" width="600px" :visible.sync="dialogShow" @closed="closed" append-to-body>
    <el-form v-model="plcGroupAEForm" ref="plcGroupAEForm" :label-width="flw">
      <el-form-item label="组名称">
        <el-input v-model="plcGroupAEForm.groupName" maxlength="64" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="空间类型">
        <el-select class="w100" v-model="plcGroupAEForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能类型">
        <el-select class="w100" v-model="plcGroupAEForm.function" placeholder="请选择">
          <el-option
            v-for="item in funcOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站号">
        <el-input v-model="plcGroupAEForm.siteNumber" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subPlcGroupAEForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {plcAPI} from "@/api/api";

  export default {
    name: "plcGroupAddEdit",
    data() {
      return {
        submitType: 1,
        siteId: null,
        dialogShow: false,
        btnSubLoading: false,
        flw: '120px',
        plcGroupAEForm: {
          id: '',
          groupName: '',
          type: '',
          function: '',
          siteNumber: ''
        },
        typeOptions: [
          {label: '线圈空间',value: "1"},
          {label: '输入线圈空间',value: "2"},
          {label: '寄存器空间',value: "3"},
          {label: '输入寄存器空间',value: "4"}
        ],
        funcOptions: [
          {label: '状态监测',value: "1"},
          {label: '故障报警',value: "2"},
          {label: '远程控制',value: "3"}
        ],
      }
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.plcGroupAEForm.groupName == ''){
          res = '组名称不能为空';
        }else if(this.plcGroupAEForm.type == ''){
          res = '空间类型不能为空';
        }else if(this.plcGroupAEForm.function == ''){
          res = '功能类型不能为空';
        }else if(this.plcGroupAEForm.siteNumber == ''){
          res = '站点不能为空';
        }else{
          res = 1;
        }
        return res;
      },
      subPlcGroupAEForm() {
        let vm = this, result = vm.validateSubForm();
        if(result === 1){
          vm.btnSubLoading = true;
          let pm = vm.plcGroupAEForm;
          pm.site = {siteId: vm.siteId};
          if(vm.submitType === 1){
            delete pm['id'];
            plcAPI.groupAdd(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
          if(vm.submitType === 2){
            plcAPI.groupUpdate(pm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '编辑成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;})
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
