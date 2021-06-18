<template>
  <div :id="container" style="width: 100%; height: 100%"></div>
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
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      option: {}
    }
  },
  watch: {
    dataList() {
      this.initChart()
    }
  },
  // 方法集合
  methods: {
    // 初始化
    initChart() {
      const wrapColors = [
        'rgba(93,131,255,0.2)',
        'rgba(85,205,249,0.2)',
        'rgba(72,237,165,0.2)',
        'rgba(255,212,61,0.2)',
        'rgba(255,164,109,0.2)',
        'rgba(248,113,113,0.2)'
      ]
      const wrapList = []
      this.dataList.forEach((e, i) => {
        const item = Object.assign({}, e, {
          itemStyle: {
            color: wrapColors[i]
          }
        })
        wrapList.push(item)
      })
      let option = {
        tooltip: {
          trigger: 'item'
        },
        color: [
          'rgba(93,131,255,1)',
          'rgba(85,205,249,1)',
          'rgba(72,237,165,1)',
          'rgba(255,212,61,1)',
          'rgba(255,164,109,1)',
          'rgba(248,113,113,1)'
        ],
        legend: {
          bottom: '5%',
          left: 'center',
          icon: 'circle',
          itemGap: 10,
          padding: 0,
          itemWidth: 10,
          itemHeight: 10
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['35%', '55%'],
            label: {
              formatter: '{per|{d}%}',
              rich: {
                per: {
                  color: '#333'
                }
              }
            },
            data: this.dataList
          },
          {
            name: '',
            type: 'pie',
            radius: ['55%', '61%'],
            tooltip: {
              show: false
            },
            label: {
              show: false
            },
            data: wrapList
          },
          {
            name: '',
            type: 'pie',
            radius: ['25%', '35%'],
            tooltip: {
              show: false
            },
            label: {
              show: false
            },
            data: wrapList
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
