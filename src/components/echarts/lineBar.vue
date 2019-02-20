<template>
  <div :id="id" :style="{width: width + 'px', height: height + 'px'}"></div>
</template>

<script>
  // 引入 ECharts 主模块
  const echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  require('echarts/lib/chart/bar');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');

  export default {
    name: "lineBar",
    props: {
      id: {
        type: String,
        default: 'line-bar'
      },
      width: {
        type: String
      },
      height: {
        type: String,
        default: '550'
      },
      echartsData: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        lineBar: null
      };
    },
    watch: {
      echartsData: 'setEchartsOption'
    },
    mounted() {
      this.operEchartsDom();
      this.initLineBarEcharts();
    },
    methods: {
      operEchartsDom() {
        let ppwidth = document.getElementById(this.id).parentNode.offsetWidth;
        if(!this.width){
          document.getElementById(this.id).style.width =   ppwidth + 'px';
        }else{
          if(this.width.indexOf('%') !== -1){
            let tw = parseInt(this.width) / 100;
            document.getElementById(this.id).style.width =   parseInt(tw * ppwidth) + 'px';
          }
        }
      },
      initLineBarEcharts() {
        this.lineBar = echarts.init(document.getElementById(this.id));
        this.setEchartsOption();
      },
      setEchartsOption() {
        let eoption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: [
            {
              type: 'category',
              axisPointer: {
                type: 'shadow'
              }
            }
          ]
        };
        eoption.legend = this.echartsData.legend;
        eoption.xAxis[0].data = this.echartsData.xAxis.data;
        eoption.xAxis[0].name = this.echartsData.xAxis.name;
        eoption.yAxis = this.echartsData.yAxis;
        eoption.series = this.echartsData.series;
        this.lineBar.setOption(eoption);
      },
      lineBarResize() {
        this.operEchartsDom();
        this.lineBar.resize();
      }
    },
    beforeDestroy() {
      this.lineBar = null;
    }
  }
</script>

<style scoped>

</style>
