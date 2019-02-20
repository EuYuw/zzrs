<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addSite">新增站点</el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" @click="siteMuchDel">批量删除</el-button>
      <el-form :model="siteSrhForm" class="fr">
        <el-input v-model="siteSrhForm.siteName" @keyup.native.enter="searchSiteList" size="small" maxlength="20"
                  prefix-icon="el-icon-search" autocomplete="off" placeholder="站点名称"
                  class="oper-right-search"></el-input>
        <el-input v-model="siteSrhForm.siteNumber" @keyup.native="siteNumFormat" @keyup.native.enter="searchSiteList" size="small" maxlength="20"
                  prefix-icon="el-icon-search" autocomplete="off" placeholder="站点编号"
                  class="oper-right-search"></el-input>
      </el-form>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="siteListData" @selection-change="selectChange" v-loading="tabLoading" class="w100"
                max-height="580" border>
        <el-table-column prop="siteId" type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="siteNumber" label="站点编号" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="siteName" label="站点名称" width="300" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatterSitePos" label="站点位置" width="240"
                         :resizable="resizable"></el-table-column>
        <el-table-column prop="price" label="水费单价(米/立方米)" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="remark" label="备注" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="360" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="siteLinkDevice(scope)">添加设备</el-button>
            <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="siteLinkPLC(scope)">PLC设计</el-button>
            <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="siteEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="siteDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="sitePageSizeChange"
                     @current-change="sitePageCurChange"
                     :current-page.sync="sitePageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="sitePageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="siteCount">
      </el-pagination>
    </el-row>
    <!--site add edit dialog row-->
    <el-row>
      <site-add-edit ref="refSiteAEDialog" @refreshListTable="searchSiteList"></site-add-edit>
    </el-row>
    <!--site link device dialog row-->
    <el-row>
      <site-link-device ref="refSiteLinkDeviceDialog"></site-link-device>
    </el-row>
    <!--site PLC dialog row-->
    <el-row>
      <plc ref="refPlcDialog"></plc>
    </el-row>
  </div>
</template>

<script>
  import {siteAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";
  import siteAddEdit from "./siteAddEdit";
  import siteLinkDevice from "./siteLinkDevice";
  import plc from "./plc";

  export default {
    name: "siteIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        siteListData: [],
        selectListData: [],
        sitePageCur: 1,
        sitePageSize: 10,
        siteCount: 0,
        siteSrhForm: {
          siteNumber: '',
          siteName: ''
        }
      }
    },
    components: {siteAddEdit, siteLinkDevice, plc},
    watch: {
      sitePageCur: 'searchSiteList',
      sitePageSize: 'searchSiteList'
    },
    mounted() {
      this.searchSiteList();
    },
    methods: {
      searchSiteList() {//列表查询
        let vm = this, pm = {
          pageSize: vm.sitePageSize,
          pageNum: vm.sitePageCur - 1,
          siteName: vm.siteSrhForm.siteName,
          siteNumber: vm.siteSrhForm.siteNumber,
        }
        vm.tabLoading = true;
        siteAPI.search(pm).then(res => {
          vm.siteListData = res.datas;
          vm.siteCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      addSite() {
        this.$refs['refSiteAEDialog'].siteAEDialogShow = true;
      },
      siteEdit(scope) {
        this.$refs['refSiteAEDialog'].submitType = 2;
        this.$refs['refSiteAEDialog'].siteAEForm.siteId = scope.row.siteId;
        this.$refs['refSiteAEDialog'].siteAEForm.siteNumber = scope.row.siteNumber;
        this.$refs['refSiteAEDialog'].siteAEForm.siteName = scope.row.siteName;
        this.$refs['refSiteAEDialog'].siteAEForm.longitude = scope.row.longitude;
        this.$refs['refSiteAEDialog'].siteAEForm.latitude = scope.row.latitude;
        this.$refs['refSiteAEDialog'].siteAEForm.price = scope.row.price;
        this.$refs['refSiteAEDialog'].siteAEForm.area = scope.row.area;
        this.$refs['refSiteAEDialog'].siteAEForm.remark = scope.row.remark;
        this.$refs['refSiteAEDialog'].siteAEDialogShow = true;
      },
      siteLinkDevice(scope) {//添加设备
        this.$refs['refSiteLinkDeviceDialog'].siteId = scope.row.siteId;
        this.$refs['refSiteLinkDeviceDialog'].siteLDDialogShow = true;
      },
      siteLinkPLC(scope) {//添加plc
        this.$refs['refPlcDialog'].siteId = scope.row.siteId;
        this.$refs['refPlcDialog'].sitePlcDialogShow = true;
      },
      siteDelete(scope) {//删除
        let vm = this;
        let pm = {siteId: scope.row.siteId};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              siteAPI.del(pm).then(res => {
                if (res.msg == 'ok') {
                  instance.$message({message: '删除成功', type: 'success'});
                  done();
                } else {
                  instance.$message({message: res.msg, type: 'error'});
                }
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          }
        }).then(() => {//确定
          vm.searchSiteList();
        }).catch(() => {});//取消
      },
      siteMuchDel() {//批量删除
        let vm = this;
        if (vm.selectListData.length === 0) {
          vm.$message({message: '请至少选择一条数据', type: 'warning'});
        } else {
          let pm = [];
          for (let q = 0; q < vm.selectListData.length; q++) {
            pm.push(vm.selectListData[q].siteId);
          }
          vm.$confirm('确定删除吗？', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonLoading: false,
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                instance.confirmButtonLoading = true;
                siteAPI.muchDel(pm).then(res => {
                  if (res.msg == 'ok') {
                    instance.$message({message: '删除成功', type: 'success'});
                    done();
                  } else {
                    instance.$message({message: res.msg, type: 'error'});
                  }
                }).catch(() => {
                  instance.confirmButtonLoading = false;
                });
              } else {
                done();
              }
            }
          }).then(() => {//确定
            vm.searchSiteList();
          }).catch(() => {});//取消
        }
      },
      selectChange(sv) {//check box
        this.selectListData = sv;
      },
      sitePageSizeChange(ps) {
        this.sitePageSize = ps;
      },
      sitePageCurChange(pc) {
        this.sitePageCur = pc;
      },
      formatterSitePos(row) {
        return '经度：' + row.longitude + ' 纬度：' + row.latitude;
      },
      siteNumFormat(){
        this.siteSrhForm.siteNumber = formatUtils.num(this.siteSrhForm.siteNumber);
      }
    }
  }
</script>

<style scoped>
</style>
