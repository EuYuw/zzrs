<template>
  <div class="bs-wp">
    <!-- list table row -->
    <el-row>
      <el-table :data="payHisListData" v-loading="tabLoading" class="w100"
                max-height="580" border>
        <el-table-column prop="fee" label="缴费金额" :resizable="resizable"></el-table-column>
        <el-table-column prop="type" label="缴费方式" :resizable="resizable"></el-table-column>
        <el-table-column prop="balance" label="余额" :resizable="resizable"></el-table-column>
        <el-table-column prop="payTime" label="缴费时间" :resizable="resizable"></el-table-column>
        <!-- <el-table-column label="操作" fixed="right" align="center" width="200" :resizable="resizable">
           <template slot-scope="scope">
             <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="deviceEdit(scope)">编辑</el-button>
             <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="deviceDelete(scope)">删除</el-button>
           </template>
         </el-table-column>-->
      </el-table>
    </el-row>
    <!-- page row -->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="payHisPageSizeChange"
                     @current-change="payHisPageCurChange"
                     :current-page.sync="payHisPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="payHisPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="payHisCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {payAPI} from "@/api/api";

  export default {
    name: "payHistoryIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        payHisListData: [],
        payHisCount: 0,
        payHisPageSize: 10,
        payHisPageCur: 1
      }
    },
    watch: {
      payHisPageCur: 'searchPayHistory',
      payHisPageSize: 'searchPayHistory'
    },
    mounted() {
      this.searchPayHistory();
    },
    methods: {
      searchPayHistory() {
        let vm = this, pm = {pageSize: vm.payHisPageSize, pageNum: vm.payHisPageCur - 1};
        vm.tabLoading = true;
        payAPI.logSearch(pm).then(res => {
          vm.tabLoading = false;
          vm.payHisListData = res.datas;
          vm.payHisCount = res.totalNum;
        }).catch(error => {vm.tabLoading = false;})
      },
      payHisPageSizeChange(ps) {
        this.payHisPageSize = ps;
      },
      payHisPageCurChange(pc) {
        this.payHisPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
