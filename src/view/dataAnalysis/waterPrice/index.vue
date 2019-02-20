<template>
  <div class="bs-wp">
    <!--oper search form-->
    <el-row>
      <el-form :model="wpSrhForm">
        <el-input v-model="wpSrhForm.siteNumber" @keyup.native=""
                  @keyup.native.enter="" size="small" maxlength="24"
                  prefix-icon="el-icon-search" autocomplete="off" placeholder="站点编号"
                  class="oper-right-search"></el-input>
      </el-form>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="wpListData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="cycle" label="计价周期" width="220" :resizable="resizable"></el-table-column>
        <el-table-column prop="site.siteNumber" label="站点编号" width="160" :resizable="resizable"></el-table-column>
        <el-table-column prop="site.siteName" label="站点名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="waterMeterNumber" label="用户" width="240" :resizable="resizable"></el-table-column>
        <el-table-column prop="waterMeterValue" label="用水数量" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="cost" label="计费" width="180" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-browse fs-12" @click="wpViewDetail(scope)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--page row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="wpPageSizeChange"
                     @current-change="wpPageCurChange"
                     :current-page.sync="wpPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="wpPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="wpCount"></el-pagination>
    </el-row>
    <!--view detail dialog-->
    <view-detail ref="viewDetail"></view-detail>
  </div>
</template>

<script>
  import {waterMeterCountAPI} from "@/api/api";
  import viewDetail from "./viewDetail";

  export default {
    name: "waterPriceIndex",
    data() {
      return {
        resizable: false,
        tabLoading: false,
        wpSrhForm: {
          siteNumber: ''
        },
        wpListData: [],
        wpPageCur: 1,
        wpPageSize: 10,
        wpCount: 0
      }
    },
    components: {viewDetail},
    watch: {
      wpPageCur: 'searchWPListData',
      wpPageSize: 'searchWPListData'
    },
    mounted() {
      this.searchWPListData();
    },
    methods: {
      searchWPListData() {
        let vm = this, pm = {
          pageSize: vm.wpPageSize,
          pageNum: vm.wpPageCur - 1
        };
        vm.tabLoading = true;
        waterMeterCountAPI.searchCost(pm).then(res => {
          vm.wpListData = res.datas;
          vm.wpCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      wpViewDetail(scope) {
        this.$refs.viewDetail.siteName = scope.row.site.siteName;
        this.$refs.viewDetail.waterMeterNumber = scope.row.waterMeterNumber;
        this.$refs.viewDetail.price = scope.row.site.price;
        this.$refs.viewDetail.waterMeterValue = scope.row.waterMeterValue;
        this.$refs.viewDetail.cost = scope.row.cost;
        this.$refs.viewDetail.remark = scope.row.site.remark;
        this.$refs.viewDetail.dialogShow = true;
      },
      wpPageSizeChange(ps) {
        this.wpPageSize = ps;
      },
      wpPageCurChange(pc) {
        this.wpPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
