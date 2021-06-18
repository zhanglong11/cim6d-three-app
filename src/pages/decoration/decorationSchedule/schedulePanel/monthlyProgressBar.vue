<template>
  <view>
    <canvas id="canvasColumn" canvas-id="canvasColumn" class="charts"></canvas>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts'
let _self
let canvasColumn = null

export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      serverData: ''
    }
  },
  watch: {
    option: {
      deep: true,
      handler: function (val) {
        // console.log(val)
        if (canvasColumn === null) {
          this.drawColumn(val)
        } else {
          let data = [val.advanceNum, val.onTimeNum, val.timeoutNum, val.inProgressNum]
          let [max, splitNumber] = this.getMaxAndSplitNumber(data)

          // 要更新的图表参数和参数对应值
          let option = {
            yAxis: {
              max: max,
              splitNumber: splitNumber,
            },
            series: [
              {
                name: '',
                data: [
                  { value: val.advanceNum, color: '#b5f569' },
                  { value: val.onTimeNum, color: '#f6f870' },
                  { value: val.timeoutNum, color: '#ff9595' },
                  { value: val.inProgressNum, color: '#bdc6ff' }
                ]
              }
            ]
          }
          canvasColumn.updateData(option)
        }
      }
    }
  },
  destroyed() {
    canvasColumn = null
  },
  mounted() {
    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
  },
  methods: {
    getMaxAndSplitNumber(data) {
      let max = Math.max(...data)
      max = max % 2 === 0 ? max : max + 1
      let splitNumber = 5
      if (max <= 10) {
        max = max === 0 ? 1 : max
        splitNumber = max
      }
      return [max, splitNumber]
    },
    drawColumn(option) {
      // console.log(option)
      let data = [option.advanceNum, option.onTimeNum, option.timeoutNum, option.inProgressNum]
      let [max, splitNumber] = this.getMaxAndSplitNumber(data)
      let chartData = {
        categories: ['提前完成', '正常完成', '超期完成', '装修中房间'],
        series: [
          {
            name: '',
            data: [
              { value: option.advanceNum, color: '#b5f569' },
              { value: option.onTimeNum, color: '#f6f870' },
              { value: option.timeoutNum, color: '#ff9595' },
              { value: option.inProgressNum, color: '#bdc6ff' }
            ]
          }
        ]
      }
      // max、splitNumber动态计算，避免Y轴刻度值出现小数的情况
      _self.showColumn('canvasColumn', chartData, max, splitNumber)
    },
    showColumn(canvasId, chartData, max, splitNumber) {
      canvasColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        legend: { show: false },
        padding: [15, 15, 4, 15],
        fontSize: 12,
        background: 'transparent',
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          min: 0,
          max: max,
          splitNumber: splitNumber,
          disabled: false,
          format: val => {
            return val
          }
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.charts {
  width: 750px;
  height: 500px;
}
</style>
