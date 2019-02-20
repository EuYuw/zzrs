<template>
  <div class="bs-wp">
    <!-- list table row -->
    <el-row>
      <el-table :data="waterHisListData" v-loading="tabLoading" class="w100"
                max-height="580" border>
        <el-table-column prop="date" label="月份" :resizable="resizable"></el-table-column>
        <el-table-column prop="meterValue" label="用水量" :resizable="resizable"></el-table-column>
        <el-table-column prop="cost" label="总余额" :resizable="resizable"></el-table-column>
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
                     @size-change="waterHisPageSizeChange"
                     @current-change="waterHisPageCurChange"
                     :current-page.sync="waterHisPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="waterHisPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="waterHisCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {waterMeterCountAPI} from "@/api/api";

  export default {
    name: "waterHistoryIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        waterHisListData: [],
        waterHisCount: 0,
        waterHisPageSize: 10,
        waterHisPageCur: 1
      }
    },
    watch: {
      waterHisPageSize: 'searchWaterHisotry',
      waterHisPageCur: 'searchWaterHisotry'
    },
    mounted() {
      this.searchWaterHisotry();
    },
    methods: {
      searchWaterHisotry() {
        let vm = this, pm = {pageSize: vm.waterHisPageSize, pageNum: vm.waterHisPageCur - 1};
        vm.tabLoading = true;
        waterMeterCountAPI.searchCountByUser(pm).then(res => {
          vm.tabLoading = false;
          vm.waterHisCount = res.totalNum;
          vm.waterHisListData = res.datas;
        }).catch(error => {vm.tabLoading = false;});
      },
      waterHisPageSizeChange(ps) {
        this.waterHisPageSize = ps;
      },
      waterHisPageCurChange(pc) {
        this.waterHisPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
