<template>
  <el-dialog :title="this.submitType === 1 ? '新增站点' : '编辑站点' " :close-on-click-modal="!siteAEDialogShow" :show-close="!btnSubLoading" width="600px" :visible.sync="siteAEDialogShow" @closed="closed">
    <el-form v-model="siteAEForm" ref="siteAEForm" :label-width="flw">
      <el-form-item label="站点编号">
        <el-input v-model="siteAEForm.siteNumber" @keyup.native="formatterNum" @blur="formatterNum" maxlength="24" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="站点名称">
        <el-input v-model="siteAEForm.siteName" maxlength="48" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="站点位置">
        <el-col class="line" align="center" :span="3">经度</el-col>
        <el-col :span="9">
          <el-input v-model="siteAEForm.longitude" @keyup.native="formatterLong" @blur="formatterLong" maxlength="10" autocomplete="off"></el-input>
        </el-col>
        <el-col class="line" align="center" :span="3">纬度</el-col>
        <el-col :span="9">
          <el-input v-model="siteAEForm.latitude" @keyup.native="formatterLat" @blur="formatterLat" maxlength="10" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="水费单价">
        <el-input  v-model="siteAEForm.price" @keyup.native="formatterPrice" @blur="formatterPrice" maxlength="8" autocomplete="off"><template slot="append">元/立方米</template></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="siteAEForm.remark" :rows="5" maxlength="200" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="siteAEDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subSiteAEForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {formatUtils} from "@/utils/utils";
  import {siteAPI} from "@/api/api";

  export default {
    name: "siteAddEdit",
    data() {
      return {
        btnSubLoading: false,
        siteAEDialogShow: false,
        submitType: 1,//1 add 2 edit
        flw: '120px',
        siteAEForm: {
          siteId: '',
          siteNumber: '',
          siteName: '',
          longitude: '',
          latitude: '',
          price: '',
          area: '',
          remark: ''
        }
      }
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.siteAEForm.siteNumber == ''){
          res = '站点编号不能为空';
        }else if(this.siteAEForm.siteName == ''){
          res = '站点名称不能为空';
        }else if(this.siteAEForm.longitude == ''){
          res = '经度不能为空';
        }else if(this.siteAEForm.latitude == ''){
          res = '纬度不能为空';
        }else if(this.siteAEForm.price == ''){
          res = '水费单价不能为空';
        }else{
          res = 1;//pass
        }
        return res;
      },
      subSiteAEForm() {
        let vm = this, result = vm.validateSubForm();
        if(result === 1){
          vm.btnSubLoading = true;
          //add site
          if(vm.submitType === 1){
            siteAPI.add(vm.siteAEForm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.siteAEDialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(err => {
              vm.btnSubLoading = false;
            });
          }
          //edit site
          if(vm.submitType === 2){
            siteAPI.update(vm.siteAEForm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '编辑成功', type: 'success'});
                vm.siteAEDialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(err => {
              vm.btnSubLoading = false;
            });
          }
        }else{
          vm.$message({message: result, type: 'warning'});
        }
      },
      formatterNum() {
        this.siteAEForm.siteNumber = formatUtils.numPoint(this.siteAEForm.siteNumber);
      },
      formatterLong() {
        this.siteAEForm.longitude = formatUtils.numPoint(this.siteAEForm.longitude);
      },
      formatterLat(){
        this.siteAEForm.latitude = formatUtils.numPoint(this.siteAEForm.latitude);
      },
      formatterPrice() {
        this.siteAEForm.price = formatUtils.numPoint(this.siteAEForm.price);
      },
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
