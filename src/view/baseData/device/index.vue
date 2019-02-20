<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addDevice">新增设备</el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" @click="deviceMuchDel">批量删除</el-button>
      <el-form :model="deviceSrhForm" class="fr">
        <el-input v-model="deviceSrhForm.deviceName" @keyup.native.enter="searchDeviceList" size="small" maxlength="48"
                  prefix-icon="el-icon-search" autocomplete="off" placeholder="设备名称"
                  class="oper-right-search"></el-input>
        <el-input v-model="deviceSrhForm.deviceNumber" @keyup.native="deviceNumFormat"
                  @keyup.native.enter="searchDeviceList" size="small" maxlength="24"
                  prefix-icon="el-icon-search" autocomplete="off" placeholder="设备编号"
                  class="oper-right-search"></el-input>
      </el-form>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="deviceListData" @selection-change="selectChange" v-loading="tabLoading" class="w100"
                max-height="580" border>
        <el-table-column prop="deviceId" type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="deviceNumber" label="设备编号" width="160" :resizable="resizable"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="300" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatterCatalogType" label="设备类型" width="180"
                         :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatterSizeName" label="所属站点" width="180"
                         :resizable="resizable"></el-table-column>
        <el-table-column prop="remark" label="备注" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="deviceEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="deviceDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="devicePageSizeChange"
                     @current-change="devicePageCurChange"
                     :current-page.sync="devicePageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="devicePageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="deviceCount">
      </el-pagination>
    </el-row>
    <!--device add dialog row-->
    <el-row>
      <device-add-edit ref="refDeviceAEDialog" @refreshListTable="searchDeviceList"></device-add-edit>
    </el-row>
  </div>
</template>

<script>
  import deviceAddEdit from "./deviceAddEdit";
  import {deviceAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "deviceIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        deviceListData: [],
        selectListData: [],
        devicePageCur: 1,
        devicePageSize: 10,
        deviceCount: 0,
        deviceSrhForm: {
          deviceName: '',
          deviceNumber: ''
        }
      }
    },
    components: {deviceAddEdit},
    mounted() {
      this.searchDeviceList();
    },
    watch: {
      devicePageCur: 'searchDeviceList',
      devicePageSize: 'searchDeviceList'
    },
    methods: {
      searchDeviceList() {
        let vm = this, pm = {
          pageSize: vm.devicePageSize,
          pageNum: vm.devicePageCur - 1,
          deviceName: vm.deviceSrhForm.deviceName,
          deviceNumber: vm.deviceSrhForm.deviceNumber
        }
        vm.tabLoading = true;
        deviceAPI.search(pm).then(res => {
          vm.deviceListData = res.datas;
          vm.deviceCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(err => {vm.tabLoading = false;});
      },
      devicePageSizeChange(ps) {
        this.devicePageSize = ps;
      },
      devicePageCurChange(pc) {
        this.devicePageCur = pc;
      },
      selectChange(sv) {
        this.selectListData = sv;
      },
      addDevice() {
        this.$refs['refDeviceAEDialog'].deviceAEDialogShow = true;
      },
      deviceEdit(scope) {
        this.$refs['refDeviceAEDialog'].submitType = 2;
        this.$refs['refDeviceAEDialog'].deviceAEForm.deviceId = scope.row.deviceId;
        this.$refs['refDeviceAEDialog'].deviceAEForm.deviceNumber = scope.row.deviceNumber;
        this.$refs['refDeviceAEDialog'].deviceAEForm.deviceName = scope.row.deviceName;
        this.$refs['refDeviceAEDialog'].deviceAEForm.imei = scope.row.imei;
        this.$refs['refDeviceAEDialog'].deviceAEForm.remark = scope.row.remark;
        let srs = scope.row.site;
        if(srs){
          this.$refs['refDeviceAEDialog'].deviceAEForm.site.siteId = scope.row.site.siteId;
        }else{
          this.$refs['refDeviceAEDialog'].deviceAEForm.site.siteId = '';
        }
        this.$refs['refDeviceAEDialog'].deviceAEForm.deviceCatagory.id = scope.row.deviceCatagory.id;
        this.$refs['refDeviceAEDialog'].deviceAEDialogShow = true;
      },
      deviceDelete(scope) {
        let vm = this, pm = {deviceId: scope.row.deviceId};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              deviceAPI.del(pm).then(res => {
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
          vm.searchDeviceList();
        }).catch(() => {//取消
        });
      },
      deviceMuchDel() {
        let vm = this;
        if (vm.selectListData.length === 0) {
          vm.$message({message: '请至少选择一条数据', type: 'warning'});
        } else {
          let pm = [];
          for (let q = 0; q < vm.selectListData.length; q++) {
            pm.push(vm.selectListData[q].deviceId);
          }
          vm.$confirm('确定删除吗？', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonLoading: false,
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                instance.confirmButtonLoading = true;
                deviceAPI.muchDel(pm).then(res => {
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
            vm.searchDeviceList();
          }).catch(() => {//取消
          });
        }
      },
      formatterCatalogType(row) {
        return row.deviceCatagory.catagoryName;
      },
      formatterSizeName(row) {
        if(row.site){
          return row.site.siteName;
        }else{
          return '';
        }
      },
      deviceNumFormat() {
        this.deviceSrhForm.deviceNumber = formatUtils.num(this.deviceSrhForm.deviceNumber);
      }
    }
  }
</script>

<style scoped>

</style>
