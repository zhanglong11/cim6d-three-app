<template>
  <view class="main">
    <view class="search-bar">
      <view class="year">
        <view class="label">年份：</view>
        <view class="value">
          <uni-select v-model="yearVal" :options="yearList" placeholder="选择年份" @input="handleYearChange" />
        </view>
      </view>
      <view class="month">
        <view class="label">月份：</view>
        <view class="value">
          <uni-select v-model="monthVal" :options="monthList" placeholder="选择月份" @input="handleMonthChange" />
        </view>
      </view>
    </view>
    <view class="charts" v-if="yearMonthData.length">
      <view class="titleText">
        <span>房间数量</span>
        <span>当前月累计完工房间：{{ completedNumByMonth }}</span>
      </view>
      <MonthlyProgressBar :option="barData" />
    </view>
    <view class="charts-no-data" v-else>暂无数据</view>
  </view>
</template>

<script>
import Api from './api'
import MonthlyProgressBar from './monthlyProgressBar'
export default {
  components: { MonthlyProgressBar },
  data() {
    return {
      yearVal: '',
      yearList: [],
      monthVal: '',
      monthList: [],
      yearMonthData: [],
      barData: {},
      completedNumByMonth: 0 // 指定月份房间完成总数
    }
  },
  async mounted() {
    await this.getScheduleTimeLine()
  },
  methods: {
    // 获取年份、月份信息
    async getScheduleTimeLine() {
      let res = await Api.getScheduleTimeLine()
      // console.log(res)
      // 初始年份列表
      this.yearMonthData = res.data ? res.data : []
      // this.yearMonthData = []
      // this.yearMonthData = ['2021-03', '2021-02', '2021-01', '2020-11', '2020-10', '2020-9', '2020-7', '2019-10'] // 模拟假数据
      let yearArr = _.uniq(this.yearMonthData.map(item => item.substr(0, 4))) // 年份去重
      // console.log(yearArr)
      yearArr.map(item => {
        this.yearList.push({ value: item, label: item })
      })
      // 初始月份列表
      if (this.yearList.length) {
        this.yearVal = this.yearList[0].value // 初始年份信息
        this.monthList = this.getMonthList(this.yearVal)
        this.monthVal = this.monthList[0].value // 初始月份信息

        await this.getMonthSchedule()
      }
    },
    // 获取月份列表
    getMonthList(yearVal) {
      let monthList = []
      this.yearMonthData.map(item => {
        if (item.indexOf(yearVal) !== -1) {
          monthList.push({
            label: item.split('-')[1],
            value: item
          })
        }
      })
      return monthList
    },
    // 年份变更
    handleYearChange(e) {
      // console.log(e)
      this.monthList = []
      this.monthVal = ''
      this.monthList = this.getMonthList(e)
      this.monthVal = this.monthList[0].value // 默认显示第一个月份
      this.getMonthSchedule()
    },
    // 月份变更
    handleMonthChange(e) {
      // console.log(e)
      this.monthVal = e
      this.getMonthSchedule()
    },
    // 图表数据调取
    async getMonthSchedule() {
      // console.log(this.monthVal)
      let res = await Api.getMonthSchedule({ month: this.monthVal })
      // console.log(res)
      this.barData = res.data
      this.completedNumByMonth = res.data.completedNumByMonth
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  border-radius: 0;
}
.search-bar {
  display: flex;
  font-size: 14px;
  padding: 0px 30px;
  .year,
  .month {
    flex: 1;
    display: flex;
    padding-right: 10px;
    align-items: center;
  }
  .label {
    color: #666666;
  }
  .value {
    border: solid 2px #cccccc;
    flex: 1;
    padding: 6px 10px;
    color: #333333;
  }
}
.charts {
  margin-top: 30px;
  .titleText {
    font-size: 12px;
    color: #666666;
    padding-left: 30px;
    > span:nth-child(1) {
      margin-right: 40px;
    }
    > span:nth-child(2) {
      color: red;
    }
  }
}
.charts-no-data {
  font-size: 14px;
  color: #666666;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
