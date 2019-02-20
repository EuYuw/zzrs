<template>
  <el-dialog title="PLC组单元列表" :close-on-click-modal="!dialogShow"
             width="70%" :visible.sync="dialogShow" @open="searchPlcGroupUnit" @closed="closed" append-to-body>
    <el-row>
      <el-table :data="plcGroupUnitData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="unitName" label="单元名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="code" label="单元代码" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="spaceAddr" label="空间地址" width="240" :resizable="resizable"></el-table-column>
        <el-table-column prop="modbusAddr" label="modbus地址" width="240" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="220" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="plcUnitEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="plcUnitDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <plcUnitAddEdit ref="refPlcUnitAEDialog" @refreshListTable="searchPlcGroupUnit"></plcUnitAddEdit>
    </el-row>
  </el-dialog>
</template>

<script>
  import {plcAPI} from "@/api/api";
  import plcUnitAddEdit from "./plcUnitAddEdit"

  export default {
    name: "plcUnitView",
    data() {
      return {
        dialogShow: false,
        resizable: false,
        tabLoading: false,
        plcGroupId: null,
        plcGroupUnitData: []
      }
    },
    components: {plcUnitAddEdit},
    methods: {
      searchPlcGroupUnit() {
        let vm = this, pm = {pageSize: 200, pageNum: 0, "plcUnitGroup.id": vm.plcGroupId};
        vm.tabLoading = true;
        plcAPI.unitSearch(pm).then(res => {
          vm.plcGroupUnitData = res.datas;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      plcUnitEdit(scope) {
        this.$refs['refPlcUnitAEDialog'].submitType = 2;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.id = scope.row.id;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.plcUnitGroup.id =  this.plcGroupId;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.unitName =  scope.row.unitName;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.code =  scope.row.code;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.spaceAddr =  scope.row.spaceAddr;
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.modbusAddr =  scope.row.modbusAddr;
        this.$refs['refPlcUnitAEDialog'].dialogShow = true;
      },
      plcUnitDelete(scope) {
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              plcAPI.unitDel(pm).then(res => {
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
          vm.searchPlcGroupUnit();
        }).catch(error => {});//取消
      },
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
