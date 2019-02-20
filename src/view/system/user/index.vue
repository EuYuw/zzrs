<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addUser">新增用户</el-button>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="userListData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="userName" label="用户名" :resizable="resizable"></el-table-column>
        <el-table-column prop="tel" width="200" label="手机号" :resizable="resizable"></el-table-column>
        <el-table-column prop="email" width="200" label="邮箱" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatType" width="140" label="类型" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatBalance" width="180" label="余额(元)" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatStatus" width="120" label="状态" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" width="180" label="创建时间" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="360" :resizable="resizable">
          <template slot-scope="scope">
            <el-row v-if="scope.row.id != 1"><!--admin no oper -->
              <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="userLinkRole(scope)">添加角色
              </el-button>
              <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="userEdit(scope)">编辑
              </el-button>
              <el-button type="danger" v-if="scope.row.status == '1'" size="mini" class="iconfont icon-lock fs-12"
                         @click="userDisable(scope)">挂起
              </el-button>
              <el-button type="primary" v-if="scope.row.status == '0'" size="mini" class="iconfont icon-unlock fs-12"
                         @click="userEnable(scope)">激活
              </el-button>
              <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="userDelete(scope)">删除
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--page row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="userPSChange"
                     @current-change="userPCChange"
                     :current-page.sync="userPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="userPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="userCount">
      </el-pagination>
    </el-row>
    <!--user add edit dialog-->
    <el-row>
      <user-add-edit ref="refUserAddEdit" @refreshList="searchUserList"></user-add-edit>
    </el-row>
  </div>
</template>

<script>
  import {userAPI} from "@/api/api";
  import userAddEdit from "./userAddEdit";

  export default {
    name: "userIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        userListData: [],
        userCount: 0,
        userPageSize: 10,
        userPageCur: 1
      }
    },
    components: {userAddEdit},
    mounted() {
      this.searchUserList();
    },
    methods: {
      searchUserList() {//查询列表
        let vm = this, pm = {
          pageSize: vm.userPageSize,
          pageNum: vm.userPageCur - 1
        };
        vm.tabLoading = true;
        userAPI.search(pm).then(res => {
          vm.userListData = res.datas;
          vm.userCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {
          vm.tabLoading = false;
        });
      },
      addUser() {
        this.$refs.refUserAddEdit.dialogShow = true;
      },
      userLinkRole(scope) {//添加角色

      },
      userEdit(scope) {//用户编辑
        let refObj = this.$refs.refUserAddEdit;
        refObj.submitType = 2;
        refObj.userAEForm.id = scope.row.id;
        refObj.userAEForm.userName = scope.row.userName;
        refObj.userAEForm.tel = scope.row.tel;
        refObj.userAEForm.email = scope.row.email;
        refObj.userAEForm.type = scope.row.type;
        refObj.dialogShow = true;
      },
      userDisable(scope) {//挂起
        let vm = this, pm = {userId: scope.row.id};
        vm.$confirm('确定挂起吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              userAPI.disable(pm).then(res => {
                if (res.msg == 'ok') {
                  instance.$message({message: '挂起成功', type: 'success'});
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
          vm.searchUserList();
        }).catch(() => {});//取消
      },
      userEnable(scope) {//激活
        let vm = this, pm = {userId: scope.row.id};
        userAPI.enable(pm).then(res => {
          if (res.msg == 'ok') {
            vm.$message({message: '激活成功', type: 'success'});
            vm.searchUserList();
          } else {
            vm.$message({message: res.msg, type: 'error'});
          }
        }).catch(() => {});
      },
      userDelete(scope) {//删除
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              userAPI.del(pm).then(res => {
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
          vm.searchUserList();
        }).catch(() => {});//取消
      },
      userPSChange(ps) {
        this.userPageSize = ps;
      },
      userPCChange(pc) {
        this.userPageCur = pc;
      },
      formatType(scope) {
        if (scope.type == 'portal') {
          return '用水用户';
        } else if (scope.type == 'manager') {
          return '管理用户  ';
        } else {
          return '';
        }
      },
      formatBalance(scope) {
        if (scope.type == 'manager' && scope.balance == 0) {
          return '';
        } else {
          return scope.balance;
        }
      },
      formatStatus(scope) {
        if (scope.status == '1') {
          return '激活';
        } else if (scope.status == '0') {
          return '禁用';
        } else {
          return '';
        }
      }
    }
  }


</script>

<style scoped>

</style>
