<template>
  <el-dialog :title="this.submitType === 1 ? '新增设备' : '编辑设备' " :close-on-click-modal="!deviceAEDialogShow"
             :show-close="!btnSubLoading" width="600px" :visible.sync="deviceAEDialogShow" @open="searchAllSite"
             @closed="closed">
    <el-form v-model="deviceAEForm" ref="deviceAEForm" :label-width="flw">
      <el-form-item label="设备编号">
        <el-input v-model="deviceAEForm.deviceNumber" @keyup.native="formatterNum" @blur="formatterNum" maxlength="24"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="deviceAEForm.deviceName" maxlength="48" autocomplete="off"></el-input>
      </el-form-item>
      <!--<el-form-item label="站点" :label-width="flw">
        <el-col class="line" align="center" :span="3">经度</el-col>
        <el-col :span="9">
          <el-input v-model="deviceAEForm.longitude" @keyup.native="formatterLong" @blur="formatterLong" maxlength="10" autocomplete="off"></el-input>
        </el-col>
        <el-col class="line" align="center" :span="3">纬度</el-col>
        <el-col :span="9">
          <el-input v-model="deviceAEForm.latitude" @keyup.native="formatterLat" @blur="formatterLat" maxlength="10" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>-->
      <el-form-item label="唯一标识">
        <el-input v-model="deviceAEForm.imei" @keyup.native="formatterImei" @blur="formatterImei" maxlength="24" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属站点">
        <el-select class="w100" v-model="deviceAEForm.site.siteId" placeholder="请选择">
          <el-option
            v-for="item in allSiteOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="类别" :label-width="flw">
         <el-select class="w100" v-model="deviceAEForm.deviceCatagory.id" placeholder="请选择">
           <el-option
             v-for="item in typeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
       </el-form-item>-->
      <el-form-item label="备注" :label-width="flw">
        <el-input type="textarea" v-model="deviceAEForm.remark" :rows="5" maxlength="200" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="deviceAEDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subDeviceAEForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {siteAPI, deviceAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "deviceAddEdit",
    data() {
      return {
        submitType: 1,
        deviceAEDialogShow: false,
        flw: '120px',
        btnSubLoading: false,
        allSiteOptions: [],
        deviceAEForm: {
          deviceId: '',
          deviceNumber: '',
          deviceName: '',
          site: {
            siteId: ''
          },
          deviceCatagory: {
            id: ''
          },
          imei: '',
          remark: ''
        }
      }
    },
    methods: {
      searchAllSite() {//search site data
        let vm = this;
        siteAPI.search({pageSize: 300, pageNum: 0}).then(res => {
          let siteArr = res.datas;
          for (let i = 0; i < siteArr.length; i++) {
            vm.allSiteOptions.push({value: siteArr[i]['siteId'], label: siteArr[i]['siteName']});
          }
        }).catch(error => {});
      },
      validateSubForm() {
        let res = 1;
        if (this.deviceAEForm.deviceNumber == '') {
          res = '设备编号不能为空';
        } else if (this.deviceAEForm.deviceName == '') {
          res = '设备名称不能为空';
        } else if (this.deviceAEForm.imei == '') {
          res = '唯一标识不能为空';
        } else {
          res = 1;//pass
        }
        return res;
      },
      subDeviceAEForm() {
        let vm = this, result = vm.validateSubForm();
        if (result === 1) {
          vm.btnSubLoading = true;
          //device add
          if(vm.submitType === 1){
            deviceAPI.add(vm.deviceAEForm).then(res => {
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.deviceAEDialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {
              vm.btnSubLoading = false;
            });
          }
          //device edit
          if(vm.submitType === 2){
            deviceAPI.update(vm.deviceAEForm).then(res => {
              if(res.msg == 'ok'){
                vm.$message({message: '编辑成功', type: 'success'});
                vm.deviceAEDialogShow = false;
                vm.$emit('refreshListTable', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {
              vm.btnSubLoading = false;
            });
          }
        } else {
          vm.$message({message: result, type: 'warning'});
        }
      },
      formatterNum() {
        this.deviceAEForm.deviceNumber = formatUtils.numPoint(this.deviceAEForm.deviceNumber);
      },
      formatterImei() {
        this.deviceAEForm.imei = formatUtils.noCHNAndSpec(this.deviceAEForm.imei);
      },
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
