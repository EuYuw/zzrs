<template>
  <el-container class="h100">
    <el-header class="headerFootBg">
      <topHeader @foldLeftNav="foldLeftNav"></topHeader>
    </el-header>
    <el-container class="el-con">
      <el-aside width="auto">
        <leftNav ref="leftNavCom"></leftNav>
      </el-aside>
      <el-main>
        <!--<transition name="el-fade-in">-->
        <router-view></router-view>
        <!--</transition>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import leftNav from "./leftNav";
  import topHeader from "./topHeader";

  export default {
    name: "layout",
    components: {topHeader, leftNav},
    methods: {
      foldLeftNav() {
        let obj = this.$refs['leftNavCom'].$refs['navMenu'];
        obj.updateActiveIndex(0);//取消active
        obj.closeMenu(obj.openedMenus[0]);//折叠nav
      }
    }
  }
</script>

<style scoped>
  .el-con {
    height: calc(100% - 60px);
  }
</style>
