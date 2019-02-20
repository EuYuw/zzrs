<template>
  <div class="bs-wp">
    <!--list table row-->
    <el-row>
      <el-table :data="costListData" v-loading="tabLoading" class="w100"
                max-height="580" border>
        <el-table-column prop="cycle" label="计价周期" :resizable="resizable"></el-table-column>
        <el-table-column prop="waterMeterValue" label="用水量(顿/t)" :resizable="resizable"></el-table-column>
        <el-table-column prop="cost" label="扣费(元)" :resizable="resizable"></el-table-column>
        <el-table-column prop="balance" label="余额(元)" :resizable="resizable"></el-table-column>
        <!-- <el-table-column label="操作" fixed="right" align="center" width="200" :resizable="resizable">
           <template slot-scope="scope">
             <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="deviceEdit(scope)">编辑</el-button>
             <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="deviceDelete(scope)">删除</el-button>
           </template>
         </el-table-column>-->
      </el-table>
    </el-row>
    <!--page row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="costPageSizeChange"
                     @current-change="costPageCurChange"
                     :current-page.sync="costPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="costPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="costCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {waterMeterCountAPI} from "@/api/api";

  export default {
    name: "valuationIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        costListData: [],
        costCount: 0,
        costPageSize: 10,
        costPageCur: 1
      }
    },
    watch: {
      costPageSize: 'searchValuation',
      costPageCur: 'searchValuation'
    },
    mounted() {
      this.searchValuation();
    },
    methods: {
      searchValuation() {
        let vm = this, pm = {pageNum: vm.costPageCur - 1, pageSize: vm.costPageSize};
        vm.tabLoading = true;
        waterMeterCountAPI.searchCostByUser(pm).then(res => {
          vm.tabLoading = false;
          vm.costCount = res.totalNum;
          vm.costListData = res.datas;
        }).catch(error => {vm.tabLoading = false;});
      },
      costPageSizeChange(ps) {
        this.costPageSize = ps;
      },
      costPageCurChange(pc) {
        this.costPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
