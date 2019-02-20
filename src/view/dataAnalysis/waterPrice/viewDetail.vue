<template>
  <el-dialog title="查看详情" :close-on-click-modal="!dialogShow"  :visible.sync="dialogShow" width="800px"
             @open="dialogOpen" @closed="dialogClosed">
    <el-row class="row-line":gutter="10">
      <el-col class="line" :span="3" :offset="1">开始时间</el-col>
      <el-col :span="7">
        <el-input v-model="startTime" readonly></el-input>
      </el-col>
      <el-col class="line" :span="3"  :offset="1">截止时间</el-col>
      <el-col :span="7">
        <el-input v-model="endTime" readonly></el-input>
      </el-col>
    </el-row>
    <el-row class="row-line":gutter="10">
      <el-col class="line" :span="3" :offset="1">站点</el-col>
      <el-col :span="7">
        <el-input v-model="siteName" readonly></el-input>
      </el-col>
      <el-col class="line" :span="3"  :offset="1">用户</el-col>
      <el-col :span="7">
        <el-input v-model="waterMeterNumber" readonly></el-input>
      </el-col>
    </el-row>
    <el-row class="row-line":gutter="10">
      <el-col class="line" :span="3" :offset="1">单价</el-col>
      <el-col :span="7">
        <el-input v-model="price" readonly></el-input>
      </el-col>
      <el-col class="line" :span="3"  :offset="1">折扣</el-col>
      <el-col :span="7">
        <el-input readonly></el-input>
      </el-col>
    </el-row>
    <el-row class="row-line" :gutter="10">
      <el-col class="line" :span="3" :offset="1">用水量</el-col>
      <el-col :span="7">
        <el-input v-model="waterMeterValue" readonly></el-input>
      </el-col>
      <el-col class="line" :span="3"  :offset="1">总价</el-col>
      <el-col :span="7">
        <el-input v-model="cost" readonly></el-input>
      </el-col>
    </el-row>
    <el-row class="row-line" :gutter="10">
      <el-col class="line" :span="3" :offset="1">备注</el-col>
      <el-col :span="18">
        <el-input type="textarea" v-model="remark" readonly :rows="5"></el-input>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "viewDetail",
    data() {
      return {
        dialogShow: false,
        startTime: '',
        endTime: '',
        siteName: '',
        waterMeterNumber: '',
        price: '',
        waterMeterValue: '',
        cost: '',
        remark: ''
      }
    },
    methods: {
      dialogOpen() {

      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>
  .row-line{
    margin-bottom: 20px;
    line-height: 40px;
  }
</style>
