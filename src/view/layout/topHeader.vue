<template>
  <div class="bs-wp">
    <!-- portal header -->
    <el-row class="portal-header" v-if="headerType == 'portal'">
      <el-row>
        <label class="pointer" @click="toHome">郑州热水用水端</label>
        <el-dropdown class="fr" @command="handleCommand" :show-timeout="150" :hide-timeout="250">
            <span class="el-dropdown-link">
              {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="resetPasswrod">重置密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <label class="el-dropdown-link fr" style="margin-right: 10px">余额(元)：<span>{{balance}}</span></label>
      </el-row>
    </el-row>
    <!--reset password dialog-->
    <el-row  v-if="headerType == 'portal'">
      <resetPassword ref="resetPsdDialog"></resetPassword>
    </el-row>
    <!-- manager header -->
    <el-row class="manager-header" v-if="headerType == 'manager'">
      <label class="pointer" @click="toHome">郑州热水管理端</label>
      <el-dropdown class="fr" @command="handleCommand" :show-timeout="150" :hide-timeout="250">
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personMsg">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </div>
</template>

<script>
  import resetPassword from "./resetPassword";

  export default {
    name: "topHeader",
    data() {
      return {
        userName: '',
        headerType: 'portal',
        balance: 0,
      }
    },
    components: {resetPassword},
    beforeMount() {
      this.headerType = this.$store.getters.userType;
    },
    mounted() {
      if(this.headerType == 'portal'){
        this.userName = JSON.parse(this.$store.getters.userCurrent).tel;
        this.balance = JSON.parse(this.$store.getters.userCurrent).balance;
      }
      if(this.headerType == 'manager'){
        this.userName = JSON.parse(this.$store.getters.userCurrent).userName;
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout();
        }
        if (command === 'resetPasswrod') {
          this.resetPsd();
        }
      },
      logout() {//退出
        this.$store.dispatch('user/logout').then(() => {
          location.reload();
        });
      },
      resetPsd() {//重置密码
        this.$refs['resetPsdDialog'].resetPsdDialogShow = true;
      },
      toHome() {
        this.$router.push({path: '/home'});
        this.$emit('foldLeftNav', {});
      }
    }
  }
</script>

<style scoped>
  .el-dropdown-link {
    color: #000;
    cursor: pointer;
    font-size: 15px;
  }
  .portal-header,
  .manager-header{
    line-height: 60px;
  }
</style>
