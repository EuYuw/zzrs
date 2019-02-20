<template>
  <div class="bs-wp">
    <el-form v-model="rechargeForm" ref="rechargeForm" label-width="120px">
      <el-form-item label="余额：">
        <label>{{balance}}</label>
      </el-form-item>
      <el-form-item label="充值金额：">
        <!-- <el-radio v-model="rechargeForm.rechargeNum" label="10" border >10</el-radio>
         <el-radio v-model="rechargeForm.rechargeNum" label="20" border >20</el-radio>
         <el-radio v-model="rechargeForm.rechargeNum" label="30" border >30</el-radio>
         <el-radio v-model="rechargeForm.rechargeNum" label="50" border >50</el-radio>
         <el-radio v-model="rechargeForm.rechargeNum" label="100" border >100</el-radio>
         <el-radio v-model="rechargeForm.rechargeNum" label="200" border >200</el-radio>-->
        <el-radio v-model="rechargeForm.rechargeNum" label="0.01" border>0.01</el-radio>
      </el-form-item>
      <el-form-item label="充值方式：">
        <el-radio v-model="rechargeForm.rechargeWay" label="wx" border>微信</el-radio>
        <el-radio v-model="rechargeForm.rechargeWay" label="zfb" border>支付宝</el-radio>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :loading="btnLoading" @click="toRecharge">去支付</el-button>
      </el-form-item>
      <el-form-item label="" v-show="wxCodeShow && rechargeForm.rechargeWay == 'wx'">
        <div class="wxqrcode" id="wxqrcode"></div>
        <p>使用微信扫一扫</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {payAPI} from "@/api/api";
  import QRCode from 'qrcodejs2';  // 引入qrcode

  export default {
    name: "rechargeIndex",
    data() {
      return {
        balance: '0',
        btnLoading: false,
        wxCodeShow: false,
        rechargeForm: {
          rechargeNum: '0.01',
          rechargeWay: 'wx'
        }
      }
    },
    mounted() {
      this.balance = JSON.parse(this.$store.getters.userCurrent).balance;
    },
    methods: {
      toRecharge() {
        let vm = this;
        const vmLoading = vm.$loading({
          target: '#app',
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.6)'
        });
        if (vm.rechargeForm.rechargeWay == 'wx') {
          document.getElementById('wxqrcode').innerHTML = '';
          payAPI.wxPay({fee: vm.rechargeForm.rechargeNum}).then(res => {
            vmLoading.close();
            vm.wxCodeShow = true;
            vm.createQRCode(res);
          }).catch(error => {
            vmLoading.close();
          });
        }
        if (vm.rechargeForm.rechargeWay == 'zfb') {
          vm.wxCodeShow = false;
        }
      },
      createQRCode(pm) {//生成二维码
        let wxCode = new QRCode('wxqrcode', {
          width: 190,
          height: 190,
          text: pm,
          colorDark: "#000",
          colorLight: "#fff",
        });
      }
    }
  }
</script>

<style scoped>
   .wxqrcode{
    display: inline-block;
    padding: 5px 0 0 5px;
    width: 200px;
    height: 200px;
    background-color: #fff;
   }
</style>
