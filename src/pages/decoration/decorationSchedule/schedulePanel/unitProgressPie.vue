<template>
  <view class="ring">
    <canvas :id="'inner-' + id" :canvas-id="'inner-' + id" class="charts inner-ring"></canvas>
    <canvas :id="'outer-' + id" :canvas-id="'outer-' + id" class="charts outer-ring"></canvas>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts'
let _self
let innerRing = null
let outerRing = null
export default {
  props: {
    unit: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cWidth: '',
      cHeight: '',
      pixelRatio: 1
    }
  },
  mounted() {
    // console.log(this.unit)
    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
    this.drawInnerRing()
    this.drawOuterRing()
  },
  methods: {
    drawInnerRing() {
      let unit = this.unit
      // noneLinePosition参数不显示标签指引线
      let chartData = {
        series: [
          {
            name: '装修中',
            data: unit.inProgressNum,
            noneLinePosition: true,
            color: '#bdc6ff',
            format: val => {
              return unit.inProgressNum || ''
            }
          },
          {
            name: '未开始',
            data: unit.notStartedNum,
            noneLinePosition: true,
            color: '#e3e3e3',
            format: val => {
              return unit.notStartedNum || ''
            }
          },
          {
            name: '完工提前',
            data: unit.advanceNum,
            noneLinePosition: true,
            color: '#b5f569',
            format: val => {
              return unit.advanceNum || ''
            }
          },
          {
            name: '完工按时',
            data: unit.onTimeNum,
            noneLinePosition: true,
            color: '#f6f870',
            format: val => {
              return unit.onTimeNum || ''
            }
          },
          {
            name: '完工超期',
            data: unit.timeoutNum,
            noneLinePosition: true,
            color: '#ff9595',
            format: val => {
              return unit.timeoutNum || ''
            }
          }
        ]
      }
      _self.showInnerRing('inner-' + _self.id, chartData)
    },
    showInnerRing(canvasId, chartData) {
      innerRing = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'ring',
        radius: 70,
        fontSize: 12,
        legend: {
          show: false
        },
        padding: [35, 15, 35, 15],
        title: {
          name: _self.unit.roomTotalNum + '个房间',
          color: '#333333',
          fontSize: 12 * _self.pixelRatio,
          offsetY: 0 * _self.pixelRatio
        },
        /*subtitle: {
          name: '收益率',
          color: '#666666',
          fontSize: 12 * _self.pixelRatio,
          offsetY: 0 * _self.pixelRatio
        },*/
        extra: {
          pie: {
            offsetAngle: -90,
            ringWidth: 30 * _self.pixelRatio
            // labelWidth: 15
          }
        },
        background: '#f9f9f9',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: true
      })
    },
    drawOuterRing() {
      let unit = this.unit
      let chartData = {
        series: [
          {
            name: '装修中',
            data: unit.inProgressNum,
            color: '#ffd09d',
            format: val => {
              if (val) {
                return '装修中' + (val * 100).toFixed(0) + '%'
              } else {
                return ''
              }
            }
          },
          {
            name: '未开始',
            data: unit.notStartedNum,
            color: '#f1f1f1',
            format: val => {
              if (val) {
                return '未开始' + (val * 100).toFixed(0) + '%'
              } else {
                return ''
              }
            }
          },
          {
            name: '已完工',
            data: unit.advanceNum + unit.onTimeNum + unit.timeoutNum,
            color: '#c9f1ff',
            format: val => {
              if (val) {
                return '已完工' + (val * 100).toFixed(0) + '%'
              } else {
                return ''
              }
            }
          }
        ]
      }
      _self.showOuterRing('outer-' + _self.id, chartData)
    },
    showOuterRing(canvasId, chartData) {
      innerRing = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'pie',
        radius: 100,
        fontSize: 12,
        legend: {
          show: false
        },
        padding: [5, 5, 5, 5],
        extra: {
          pie: {
            offsetAngle: -90,
            labelWidth: 5
          }
        },
        background: '#f9f9f9',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ring {
  position: relative;
  .inner-ring {
    position: absolute;
    z-index: 1;
  }
}
.charts {
  width: 750px;
  height: 500px;
}
</style>
