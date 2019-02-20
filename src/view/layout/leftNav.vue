<template>
  <el-row class="bs-wp">
    <!-- portal left nav -->
    <el-row v-if="$store.getters.userType == 'portal' ">
      <el-menu class="el-menu-vertical" ref="navMenu" :default-active="$route.path" :router="navRouter"
               :unique-opened="uniOpened" @open="handleOpen" @select="select"
               @close="handleClose" :collapse="isCollapse">
        <template v-for="(route, index) in permissionRouters">
          <el-menu-item v-if="!route.children" v-show="route.show" :index="index + ''"
                        :key="index">
            <i :class="route.icon"></i>
            <span slot="title">{{ route.name }}</span>
          </el-menu-item>
          <el-menu-item v-else-if="route.children.length == 1" v-show="route.show" v-for="child in route.children"
                        :index="route.path + '/' + child.path"
                        :key="route.path + '/' + child.path">
            <i :class="child.icon"></i>
            <span slot="title">{{ child.name }}</span>
          </el-menu-item>
          <el-submenu v-else :index="index + ''" :key="index" v-show="route.show">
            <template slot="title">
              <i :class="route.icon"></i>
              <span slot="title">{{ route.name}}</span>
            </template>
            <el-menu-item v-for="child in route.children" :index="route.path + '/' + child.path"
                          :key="route.path + '/' + child.path">
              <i :class="child.icon"></i>
              <span slot="title">{{ child.name }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-row>
    <!-- manager left nav -->
    <el-row v-if="$store.getters.userType == 'manager' ">
      <el-menu class="el-menu-vertical" ref="navMenu" :default-active="$route.path" :router="navRouter"
               :unique-opened="uniOpened" @open="handleOpen" @select="select"
               @close="handleClose" :collapse="isCollapse">
        <template v-for="(route, index) in permissionRouters">
          <el-menu-item v-if="!route.children" v-show="route.show" :index="index + ''"
                        :key="index">
            <i :class="route.icon"></i>
            <span slot="title">{{ route.name }}</span>
          </el-menu-item>
          <el-submenu v-else :index="index + ''" :key="index" v-show="route.show">
            <template slot="title">
              <i :class="route.icon"></i>
              <span slot="title">{{ route.name}}</span>
            </template>
            <el-menu-item v-for="child in route.children" :index="route.path + '/' + child.path"
                          :key="route.path + '/' + child.path">
              <i :class="child.icon"></i>
              <span slot="title">{{ child.name }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-row>
    <div class="nav-toggle" @click="collapseNav"><i :class="toggleIcon"></i></div>
  </el-row>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "leftNav",
    data() {
      return {
        uniOpened: true,
        navRouter: true,
        isCollapse: false,
        toggleIcon: 'el-icon-d-arrow-left'
      };
    },
    computed: {
      ...mapGetters([
        'permissionRouters'
      ])
    },
    methods: {
      collapseNav() {
        this.isCollapse = !this.isCollapse;
        this.toggleIcon = this.isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left';
      },
      handleOpen(key, keyPath) {//open method
      },
      handleClose(key, keyPath) {//close method
      },
      select(index, indexPath) {
      }
    }
  }
</script>

<style scoped>
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
  }

  .nav-toggle {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
</style>
