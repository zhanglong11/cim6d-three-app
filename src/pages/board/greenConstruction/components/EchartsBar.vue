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
    value: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    // 这里存放数据
    return {
      option: {}
    }
  },
  watch: {
    value() {
      this.initChart()
    }
  },
  // 方法集合
  methods: {
    // 初始化
    initChart() {
      let levelColors = ['#84ca40', '#a5db0e', '#feda30', '#fe8c53', '#ef5746']
      let levelList = ['良好', '轻度', '中度', '重度', '严重']
      let numColor = levelColors[0]
      let barColor = [levelColors[0], levelColors[1]]
      let newValue = parseInt(this.value)
      let percentage = newValue > 500 ? (500 / 500) * 100 : (newValue / 500) * 100
      let levelText = levelList[0]
      if (newValue > 100) {
        levelText = levelList[1]
        numColor = levelColors[1]
        barColor = [levelColors[1], levelColors[2]]
      }
      if (newValue > 150) {
        levelText = levelList[2]
        numColor = levelColors[2]
        barColor = [levelColors[2], levelColors[3]]
      }
      if (newValue > 200) {
        levelText = levelList[3]
        numColor = levelColors[3]
        barColor = [levelColors[3], levelColors[4]]
      }
      if (newValue > 300) {
        levelText = levelList[4]
        numColor = levelColors[4]
        barColor = [levelColors[3], levelColors[4]]
      }
      let option = {
        angleAxis: {
          show: false,
          max: (100 * 360) / 270, //-45度到225度，二者偏移值是270度除360度
          type: 'value',
          startAngle: 225, //极坐标初始角度
          splitLine: {
            show: false
          }
        },
        barMaxWidth: 8, //圆环宽度
        radiusAxis: {
          show: false,
          type: 'category'
        },
        //圆环位置和大小
        polar: {
          center: ['50%', '50%'],
          radius: '180'
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                //上层圆环，显示数据
                value: percentage,
                itemStyle: {
                  color: {
                    //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1, //从左到右 0-1
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: barColor[0]
                      },
                      {
                        offset: 1,
                        color: barColor[1]
                      }
                    ]
                  }
                }
              }
            ],
            barGap: '-100%', //柱间距离,上下两层圆环重合
            coordinateSystem: 'polar',
            roundCap: true, //顶端圆角
            z: 2 //圆环层级，同zindex
          },
          {
            //下层圆环，显示最大值
            type: 'bar',
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e9edf8'
                }
              }
            ],
            barGap: '-100%',
            coordinateSystem: 'polar',
            roundCap: true,
            z: 1
          },
          //仪表盘
          {
            name: 'AQI',
            type: 'gauge',
            startAngle: 225, //起始角度，同极坐标
            endAngle: -45, //终止角度，同极坐标
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            detail: {
              offsetCenter: [0, 0], //相对于仪表盘中心的偏移位置
              textStyle: {
                fontSize: 14,
                color: '#494949',
                fontWeight: 'normal'
              },
              formatter: `{a|AQI} \n {b|{value}} \n {c|${levelText}}`,
              rich: {
                a: {
                  fontSize: 14,
                  color: '#494949',
                  lineHeight: 40
                },
                b: {
                  fontSize: 60,
                  lineHeight: 60,
                  color: numColor,
                  fontWeight: 'normal'
                },
                c: {
                  color: numColor
                }
              }
            },
            data: [
              {
                value: newValue
              }
            ]
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
