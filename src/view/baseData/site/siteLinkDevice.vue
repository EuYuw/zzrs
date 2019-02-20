<template>
  <el-dialog title="添加设备" :close-on-click-modal="!siteLDDialogShow" :show-close="!btnSubLoading" width="600px"
             :visible.sync="siteLDDialogShow" @open="searchDeviceRelated" @closed="closed">
    <el-transfer v-model="deviceLinkData" :titles="['可用设备', '已选设备']" :data="deviceListData" @change="transferChange"></el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="siteLDDialogShow = false" v-show="!btnSubLoading">取 消</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="subLinkDeviceForm">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {deviceAPI} from "@/api/api";

  export default {
    name: "siteLinkDevice",
    data() {
      return {
        siteId: null,
        deviceListData: [],// key label object array
        deviceLinkData: [],//key array
        siteLDDialogShow: false,
        btnSubLoading: false,
      };
    },
    methods: {
      searchDeviceRelated() {
        let vm = this;
        deviceAPI.searchNoLink().then(arrNL => {//查询未关联
          deviceAPI.searchSiteLinkDevice({siteId: vm.siteId}).then(arrLD => {//查询已关联
            let deviceArr = arrNL.concat(arrLD);
            for(let q = 0; q < deviceArr.length; q++){
              vm.deviceListData.push({key: deviceArr[q]['deviceId'], label: deviceArr[q]['deviceName']});
            }
            for(let o = 0; o < arrLD.length; o++){
              vm.deviceLinkData.push(arrLD[o]['deviceId']);
            }
          }).catch(error => {});
        }).catch(error => {});
      },
      transferChange(a, b, c) {//当前值、数据移动的方向（'left' / 'right'）、发生移动的数据 key 数组
        this.deviceLinkData = a;
      },
      subLinkDeviceForm() {
        let vm = this;
        let pm = {deviceIds: vm.deviceLinkData, siteId: vm.siteId};
        vm.btnSubLoading = true;
        deviceAPI.linkToSite(pm).then(res => {
          vm.btnSubLoading = false;
          if(res.msg == 'ok'){
            vm.$message({message: '添加设备成功', type: 'success'});
            vm.siteLDDialogShow = false;
          }else{
            vm.$message({message: res.msg, type: 'error'});
          }
        }).catch(error => {
          vm.btnSubLoading = false;
        });
      },
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
