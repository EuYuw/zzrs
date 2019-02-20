<template>
  <el-dialog title="PLC设计" :close-on-click-modal="!sitePlcDialogShow" width="70%"
             :visible.sync="sitePlcDialogShow" @open="searchPlcGroup" @closed="closed">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="plcGroupAdd">新增PLC组</el-button>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="plcGroupData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="groupName" label="组名称" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatSpace" label="空间类型" width="220" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatFunc" label="功能类型" width="180" :resizable="resizable"></el-table-column>
        <el-table-column prop="siteNumber" label="站号" width="160" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="360" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="plcGroupAddUnit(scope)">添加PLC单元</el-button>
            <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="plcGroupEdit(scope)">编辑</el-button>
            <el-button type="primary" size="mini" class="iconfont icon-browse fs-12" @click="plcGroupView(scope)">查看单元</el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="plcGroupDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--pagination row-->
 <!--   <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="plcGroupPSChange"
                     @current-change="plcGroupPCChange"
                     :current-page.sync="plcGroupPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="plcGroupPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="plcGroupCount">
      </el-pagination>
    </el-row>-->
    <!--add plc group dialog-->
    <el-row>
      <plcGroupAddEdit ref="refPlcGroupAEDialog" @refreshListTable="searchPlcGroup"></plcGroupAddEdit>
    </el-row>
    <!-- add plc unit dialog -->
    <el-row>
      <plcUnitAddEdit ref="refPlcUnitAEDialog"></plcUnitAddEdit>
    </el-row>
    <!--view plc unit-->
    <el-row>
      <plcUnitView ref="refPlcUnitViewDialog"></plcUnitView>
    </el-row>
  </el-dialog>
</template>

<script>
  import {plcAPI} from "@/api/api";
  import plcGroupAddEdit from "./plcGroupAddEdit";
  import plcUnitAddEdit from "./plcUnitAddEdit";
  import plcUnitView from "./plcUnitView";

  export default {
    name: "plc",
    data() {
      return {
        siteId: null,
        sitePlcDialogShow: false,
        tabLoading: false,
        resizable: false,
      /*  plcGroupPageCur: 1,
        plcGroupPageSize: 10,
        plcGroupCount: 0,*/
        plcGroupData: []
      };
    },
    components: {plcGroupAddEdit, plcUnitAddEdit, plcUnitView},
    methods: {
      searchPlcGroup() {//查询PLC组
        let vm = this, pm = {
          pageNum: 200,
          pageSize: 0,
          "site.siteId":  vm.siteId
        };
        vm.tabLoading = true;
        plcAPI.groupSearch(pm).then(res => {
          vm.plcGroupData = res.datas;
          //vm.plcGroupCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      plcGroupAdd() {//plc组新增
        this.$refs['refPlcGroupAEDialog'].siteId = this.siteId;
        this.$refs['refPlcGroupAEDialog'].dialogShow = true;
      },
      plcGroupEdit(scope) {//plc组编辑
        this.$refs['refPlcGroupAEDialog'].siteId = this.siteId;
        this.$refs['refPlcGroupAEDialog'].submitType = 2;
        this.$refs['refPlcGroupAEDialog'].plcGroupAEForm.id = scope.row.id;
        this.$refs['refPlcGroupAEDialog'].plcGroupAEForm.groupName = scope.row.groupName;
        this.$refs['refPlcGroupAEDialog'].plcGroupAEForm.type = scope.row.type;
        this.$refs['refPlcGroupAEDialog'].plcGroupAEForm.function = scope.row.function;
        this.$refs['refPlcGroupAEDialog'].plcGroupAEForm.siteNumber = scope.row.siteNumber;
        this.$refs['refPlcGroupAEDialog'].dialogShow = true;
      },
      plcGroupDelete(scope){//plc组删除
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              plcAPI.groupDel(pm).then(res => {
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
          vm.searchPlcGroup();
        }).catch(() => {//取消
        });
      },
      plcGroupView(scope) {//plcGroup查看
        this.$refs['refPlcUnitViewDialog'].plcGroupId = scope.row.id;//赋值plcUnitGroup id
        this.$refs['refPlcUnitViewDialog'].dialogShow = true;
      },
      plcGroupAddUnit(scope) {//添加PLC单元
        this.$refs['refPlcUnitAEDialog'].plcUnitAEForm.plcUnitGroup.id = scope.row.id;//赋值plcUnitGroup id
        this.$refs['refPlcUnitAEDialog'].dialogShow = true;
      },
      formatSpace(row) {//格式化空间类型
        let txt = '';
        if(row.type == "1"){
          txt = '线圈空间';
        }else if(row.type == "2"){
          txt = '输入线圈空间';
        }else if(row.type == "3"){
          txt = '寄存器空间';
        }else if(row.type == "4"){
          txt = '输入寄存器空间';
        }
        return txt;
      },
      formatFunc(row) {//格式化功能类型
        let txt = '';
        if(row.function == "1"){
          txt = '状态监测';
        }else if(row.function == "2"){
          txt = '故障报警';
        }else if(row.function == "3"){
          txt = '远程控制';
        }
        return txt;
      },
     /* plcGroupPSChange(ps){
        this.plcGroupPageSize = ps;
      },
      plcGroupPCChange(pc) {
        this.plcGroupPageCur = pc;
      },*/
      closed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
