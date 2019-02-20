<template>
  <div class="bs-wp">
    <!-- tab -->
    <el-tabs v-model="showType" type="border-card" @tab-click="tabChange" class="h100">
      <!-- list part -->
      <el-tab-pane label="列表" name="list">
        <!--oper row-->
        <el-row>
          <el-form :model="listSrhForm" class="fr">
            <!--<el-input v-model="waterUsedSrhForm.siteName" @keyup.native.enter="" size="small" maxlength="48"
                      prefix-icon="el-icon-search" autocomplete="off" placeholder="站点名称"
                      class="oper-right-search"></el-input>-->
            <el-input v-model="listSrhForm.siteNumber" @keyup.native=""
                      @keyup.native.enter="" size="small" maxlength="24"
                      prefix-icon="el-icon-search" autocomplete="off" placeholder="站点编号"
                      class="oper-right-search"></el-input>
          </el-form>
        </el-row>
        <!-- list table row -->
        <el-row class="mgtp-10">
          <el-table :data="waterUsedListData" v-loading="tabLoading" class="w100" max-height="580" border>
            <el-table-column prop="site.siteNumber" label="站点编号" width="200" :resizable="resizable"></el-table-column>
            <el-table-column prop="site.siteName" label="站点名称" width="500" :resizable="resizable"></el-table-column>
            <el-table-column prop="meterValue" label="用水量" width="220" :resizable="resizable"></el-table-column>
            <el-table-column prop="site.remark" label="备注" :resizable="resizable"></el-table-column>
          </el-table>
        </el-row>
        <!-- page row -->
        <el-row class="mgtp-10">
          <el-pagination class="fr"
                         @size-change="waterUsedPageSizeChange"
                         @current-change="waterUsedPageCurChange"
                         :current-page.sync="waterUsedPageCur"
                         :page-sizes="[10, 20, 50]"
                         :page-size="waterUsedPageSize"
                         layout="total, sizes, prev, pager, next"
                         :total="waterUsedCount">
          </el-pagination>
        </el-row>
      </el-tab-pane>
      <!-- chart part -->
      <el-tab-pane label="图表" name="chart">
        <el-row>
          <el-form :model="echartSrhForm">
            <el-input v-model="echartSrhForm.siteNumber" @keyup.native=""
                      @keyup.native.enter="" size="small" maxlength="24"
                      prefix-icon="el-icon-search" autocomplete="off" placeholder="站点编号"
                      class="oper-right-search"></el-input>
          </el-form>
        </el-row>
        <el-row class="bs-wp mgtp-10">
          <line-bar :echartsData="echartsData" ref="lineBarEchart"></line-bar>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {waterMeterCountAPI} from "@/api/api";
  import lineBar from "@/components/echarts/lineBar";

  export default {
    name: "waterUserIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        showType: 'list',
        chartDraw: false,
        waterUsedListData: [],
        waterUsedCount: 0,
        waterUsedPageCur: 1,
        waterUsedPageSize: 10,
        listSrhForm: {
          siteNumber: '',
          /*siteName: ''*/
        },
        echartSrhForm: {
          siteNumber: ''
        },
        echartsData: {
          legend: {
            data: ['降水量', '平均温度']
          },
          xAxis: {
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          },
          yAxis: [
            {
              type: 'value',
              name: '水量'
            },
            {
              type: 'value',
              name: '温度'
            }
          ],
          series: [
            {
              name: '降水量',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
              name: '平均温度',
              type: 'line',
              yAxisIndex: 1,
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        }
      }
    },
    components: {lineBar},
    watch: {
      waterUsedPageCur: 'searchWaterUserList',
      waterUsedPageSize: 'searchWaterUserList'
    },
    mounted() {
      this.searchWaterUserList();
    },
    methods: {
      searchWaterUserList() {
        let vm = this, pm = {
          pageSize: vm.waterUsedPageSize,
          pageNum: vm.waterUsedPageCur,
          siteNumber: vm.listSrhForm.siteNumber
        };
        vm.tabLoading = true;
        waterMeterCountAPI.searchCount(pm).then(res => {
          vm.waterUsedListData = res.datas;
          vm.waterUsedCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      waterUsedPageSizeChange(ps) {
        this.waterUsedPageSize = ps;
      },
      waterUsedPageCurChange(pc) {
        this.waterUsedPageCur = pc;
      },
      tabChange(vm) {
        if(vm.name == 'chart'){
          let vm = this;
          setTimeout(() => {//延迟是因为无法获取隐藏元素的宽高，会导致echarts初始化失败
            vm.$refs['lineBarEchart'].lineBarResize();
          }, 50);
        }
      }
    }
  }
</script>

<style scoped>

</style>
