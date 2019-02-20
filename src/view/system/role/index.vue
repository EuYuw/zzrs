<template>
  <div class="bs-wp">
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
    </el-row>
    <el-row class="mgtp-10">
      <el-table :data="roleListData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="code" label="角色编码" :resizable="resizable"></el-table-column>
        <el-table-column prop="name" label="角色名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="角色描述" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="260" :resizable="resizable">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="roleLinkFunc(scope)">添加功能
              </el-button>
              <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="roleEdit(scope)">编辑
              </el-button>
              <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="roleDelete(scope)">删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="rolePSChange"
                     @current-change="rolePCChange"
                     :current-page.sync="rolePageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="rolePageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="roleCount">
      </el-pagination>
    </el-row>
    <el-row class="mgtp-10">
      <role-oper ref="refRoleOper" @refreshList="searchRoleList"></role-oper>
    </el-row>
  </div>
</template>

<script>
  import {roleAPI} from "@/api/api";
  import roleOper from "./roleOper";

  export default {
    name: "roleIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        rolePageCur: 1,
        rolePageSize: 10,
        roleCount: 0,
        roleListData: []
      }
    },
    components: {roleOper},
    watch: {},
    mounted() {
      this.searchRoleList();
    },
    methods: {
      searchRoleList() {
        let vm = this, pm = {
          pageSize: vm.rolePageSize,
          pageNum: vm.rolePageCur - 1
        };
        vm.tabLoading = true;
        roleAPI.search(pm).then(res => {
          vm.roleListData = res.datas;
          vm.roleCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      addRole() {
        this.$refs.refRoleOper.submitType = 1;
        this.$refs.refRoleOper.dialogShow = true;
      },
      roleLinkFunc(scope) {

      },
      roleEdit(scope) {
        let refObj = this.$refs.refRoleOper;
        refObj.submitType = 2;
        refObj.roleSubForm.id = scope.row.id;
        refObj.roleSubForm.code = scope.row.code;
        refObj.roleSubForm.name = scope.row.name;
        refObj.roleSubForm.description = scope.row.description;
        refObj.dialogShow = true;
      },
      roleDelete(scope) {

      },
      rolePSChange(ps) {
        this.rolePageSize = ps;
      },
      rolePCChange(pc) {
        this.rolePageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
