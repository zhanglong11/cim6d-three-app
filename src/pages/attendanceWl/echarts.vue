<template>
  <div :id="container" :style="{ width: '100%', height: cHeight + 'px' }"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  props: {
    container: {
      type: String,
      default: ''
    },
    dataList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      //图标宽度
      type: Number,
      default: 750
    },
    height: {
      //图标高度
      type: Number,
      default: 500
    }
  },
  data() {
    // 这里存放数据
    return {
      option: {}
    }
  },
  computed: {
    cWidth() {
      return uni.upx2px(this.width)
    },
    cHeight() {
      return uni.upx2px(this.height)
    }
  },
  watch: {
    dataList: {
      handler: function () {
        this.initChart()
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
    }
  },

  methods: {
    // 初始化
    initChart() {
      // console.log('--jin')
      // console.log(this.dataList)
      var colors = ['#7495fd', '#c366ff', '#ff7676', '#ffaea0', '#ffd988', '#58c799', '#84e3ee']
      let option = {
        title: {},
        grid: {
          left: '4%',
          right: '15%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          show: false //不显示x轴相关信息
        },
        yAxis: [
          {
            type: 'category',
            data: this.dataList.ydataText,
            axisTick: { show: false }, //不显示刻度线
            axisLabel: {
              color: '#000'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            inverse: true
          },
          {
            type: 'category',
            axisTick: { show: true }, //不显示刻度线
            axisLabel: {
              color: '#000'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            inverse: true
          }
        ],
        series: [
          {
            name: '条',
            yAxisIndex: 0,
            type: 'bar',
            data: this.dataList.xdata,
            // 修改第一条柱子的圆角
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                // color: '#1890ff'
                color: function (params) {
                  //params 传递过来的柱子对象
                  // dataIndex 是当前柱子的索引
                  var num = colors.length
                  return colors[params.dataIndex % num]
                }
              }
              // color 可以修改柱子的颜色
              // color: ''
            },
            // 柱子之间的间距
            barCategoryGap: 5,
            // 柱子之间的宽度
            barWidth: 15,
            // 显示柱子内的文字
            label: {
              show: true,
              position: 'right',
              formatter: function (e) {
                return e.value + '人'
              }
              // {c} 会自动解析为data中的数据
            }
          }
        ]
      }
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById(this.container))
        this.myChart.setOption(option)
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
      })
    }
  }
}
</script>
<style scoped></style>
