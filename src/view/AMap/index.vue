<template>
  <div class="bs-wp">
    <el-amap vid="amapDemo" :zoom="zoom" :center="center">
      <el-amap-marker v-for="(mark, index) in marks" :vid="index" :key="index" :position="mark.position"
                      :events="mark.events" :visible="mark.visible" :icon="mark.icon" :title="mark.title"></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
  export default {
    name: "AMapIndex",
    data() {
      return {
        zoom: 12,
        center: [121.5273285, 31.21515044],
        marks: [
          {
            position: [121.5273555, 31.23515555],
            visible: true,
            draggable: false,
            icon: '',
            title: '1',
            content: '111',
            events: {
              click: () => {
                alert(1);
              }
            }
          },
          {
            position: [121.5273966, 31.21515200],
            visible: true,
            draggable: false,
            icon: '',
            title: '2',
            content: '222',
            events: {
              click: () => {
                alert(2);
              }
            }
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
