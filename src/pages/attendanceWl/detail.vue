<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y @scrolltolower="scrolltolower">
      <view class="main-body">
        <view class="main-headers">
          <view>考勤总览</view>
          <view>
            <uni-tabs v-model="mode">
              <uni-tab-pane name="1" label="日"></uni-tab-pane>
              <uni-tab-pane name="2" label="月"></uni-tab-pane>
            </uni-tabs>
          </view>
        </view>
        <view v-if="mode === '1'">
          <div class="calendar-wrap">
            <!-- <span class="calendar-view-mode-control" @click="weekSwitch = !weekSwitch">
            <image src="@/static/images/log/calendar.png" alt="" /> {{ weekSwitch ? '展开日历' : '收起日历' }}</span
          > -->
            <!-- #ifdef APP-PLUS -->
            <Calendar
              ref="calendar"
              :value="calendarValue"
              monFirst
              :weekSwitch="weekSwitch"
              :tileContent="tileContent"
              @select="handleCalendarSelect"
              @selectMonth="handleMonthSelect"
              @prev="handlePrevBtnClick"
              @next="handleNextBtnClick"
            ></Calendar>
            <!-- #endif -->
            <!-- #ifdef MP -->
            <uni-calendar
              :start-date="'1900-1-1'"
              :end-date="'2999-12-30'"
              :selected="tileContentWeixin"
              @monthSwitch="selectMonth"
              @change="selectDay"
            ></uni-calendar>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <Calendar
              ref="calendar"
              :value="calendarValue"
              monFirst
              :weekSwitch="weekSwitch"
              :tileContent="tileContent"
              :arrowLeft="arrowLeft"
              :arrowRight="arrowRight"
              @select="handleCalendarSelect"
              @selectMonth="handleMonthSelect"
              @prev="handlePrevBtnClick"
              @next="handleNextBtnClick"
            ></Calendar>
            <!-- #endif -->
          </div>

          <view class="cardWrapper">
            <view class="main-content">
              <view>考勤异常人员</view>
              <uni-card v-for="(item, index) of list" :key="index">
                <view class="card-body">
                  <view class="card-info">
                    <view class="title">
                      <view>{{ item.userName }}</view>
                      <view style="color: #999; font-size: 12px"></view>
                    </view>
                    <view class="flex-wrapper">
                      <uni-status :options="readStatus" :value="0"></uni-status>
                    </view>
                  </view>
                </view>
              </uni-card>
            </view>
            <!-- 无数据空载页 start -->
            <EmptyTemplate v-if="list.length === 0" />
            <!-- 无数据空载页 end -->
          </view>
        </view>
        <div v-else>
          <view class="dayStyle">
            <span v-if="dateList.length > 0">
              <span v-for="(item, index) of dateList" :key="index">
                <span class="day-item" @click="getNewMoney(item)" style="display: inline-block">{{
                  item.date ? item.date : ''
                }}</span>
              </span>
            </span>
            <span v-else>
              <span class="day-item" style="display: inline-block">暂无月份</span>
            </span>
          </view>
          <view style="margin: 20px">考勤异常人员</view>
          <view style="margin: 10px; font-size: 12px"> <uni-status :options="readStatus" :value="0"></uni-status></view>
          <view>
            <uni-card v-for="(items, index) of list" :key="index">
              <view class="card-body">
                <view class="card-info">
                  <view class="title">
                    <view>{{ items.userName }}</view>
                    <view style="color: #999; font-size: 12px"></view>
                  </view>
                  <view class="flex-wrapper">
                    <view>{{ items.missCount }}次</view>
                  </view>
                </view>
              </view>
            </uni-card>
          </view>
        </div>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <!-- 添加操作按钮开始 -->

    <!-- 添加操作按钮结束 -->
  </view>
</template>

<script>
// #ifdef APP-PLUS
import Calendar from '@/components/mpvue-calendar/mpvue-calendar.vue'
// #endif
// #ifdef H5
import Calendar from '@/components/mpvue-calendar/mpvue-calendar.vue'
// #endif
// #ifdef MP
import Calendar from '@/components/uni-calendar/uni-calendar.vue'
// #endif
import api from './api'
import { mapGetters } from 'vuex'
import moment from 'moment'
import arrowLeft from '@/static/images/log/arrow-left-o.png'
import arrowRight from '@/static/images/log/arrow-right.png'
import readStatus from './lib/readStatus'
import uniTabs from '@/components/uni-tabs/uni-tabs.vue'
import _ from 'lodash'
export default {
  components: {
    Calendar,
    uniTabs
  },
  data() {
    return {
      mode: '1',
      // 日历参数
      calendarValue: [],
      weekSwitch: false,
      tileContent: [],
      tileContentWeixin: [],
      dateList: [], //有日志项的日期字符串组成的数组
      list: [],
      arrowLeft,
      arrowRight,
      logQuery: {
        time: moment(new Date()).format('YYYY-MM-DD'),
        timeSpan: 1 ///默认日
      },
      readStatus,
      total: 0,
      loading: false,
      isRealse: false, //标记日志列表是否为首次请求，用来避免全部数据加载完成后加载更多仍不停触发
      dateQuery: {
        //查询月中含有日至项的时间段
        time: null,
        timeSpan: 1 ///默认日
      }
    }
  },
  watch: {
    mode(e) {
      this.dateQuery.timeSpan = e
      this.logQuery.timeSpan = e
      this.init()
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.dateList = []
      this.list = []
      this.setDefaultDateInfo()
      this.handleQueryLogList()
      this.handleQueryDateList()
    },
    //
    getNewMoney(item) {
      this.logQuery.time = moment(item.yearMonth).format('YYYY-MM-DD')
      this.handleQueryLogList()
    },
    // 设置请求日志的请求参数的默认日期
    // 设置请求含日志项请求的默认日期
    setDefaultDateInfo() {
      if (!this.logQuery.time) {
        this.logQuery.time = moment().format('YYYY-MM-DD')
      }
      if (!this.dateQuery.time) {
        this.dateQuery.time = moment().format('YYYY-MM-DD')
      }
    },
    // 请求日志项列表信息
    async handleQueryLogList(loadMore) {
      this.isRealse = false
      this.loading = true
      let result = await api.getCheckSpecificdetaildl(this.logQuery)
      this.list = result.data
    },
    // 请求指定月内含有日志项的时间
    async handleQueryDateList() {
      let result = await api.getCheckSpecificListdel(this.dateQuery)
      let datas = result.data || []
      if (datas.length === 0) return
      if (this.dateQuery.timeSpan === '2') {
        this.dateList = datas
      } else {
        let currentData = _.map(datas, item => moment(item.date, ['YYYYMMDD']).format('YYYY-MM-DD')) //此次请求返回的含有日志项信息的日期
        this.dateList = _.uniq([...this.dateList, ...currentData])
        this.tileContent = []
        this.tileContentWeixin = []
        _.forEach(this.dateList, item => {
          let newItem = item.split('-')
          this.tileContent.push({
            date: `${parseInt(newItem[0])}-${parseInt(newItem[1])}-${parseInt(newItem[2])}`, // 修复日历bug
            className: 'pin',
            content: '●'
          })
          this.tileContentWeixin.push({
            date: item
          })
        })
      }
    },
    // 加载更多
    scrolltolower() {
      if (this.total === this.list.length) return
      this.logQuery.page++
      this.handleQueryLogList(true)
    },
    handleCalendarSelect(value1, value2) {
      // this.$utils.showToast(`${value1}`)
      // 选中日期后，查询当天下的日志项
      this.logQuery.time = moment(value2.date, ['YYYYMMDD']).format('YYYY-MM-DD')
      this.handleInitCurrentLogInfo()
      this.handleQueryLogList()
    },
    handleMonthSelect(month, year) {
      // 月发生改变时，请求选中月的含有日志项的时间段及默认显示当月1号的日志项
      this.dateQuery.time = moment(`${year}-${month}`, ['YYYYMMDD']).format('YYYY-MM-DD')
      this.handleQueryDateList()
    },
    // 选择月份
    selectMonth(e) {
      this.handleMonthSelect(e.month, e.year)
    },
    // 选择天
    selectDay(e) {
      let date = e.fulldate
      this.handleCalendarSelect('', {
        date
      })
    },
    // 通过箭头图片选择上个月/上一周时
    handlePrevBtnClick(year, month) {
      this.handleMonthSelect(month, year)
    },
    // 通过箭头图片选择下个月/下一周时
    handleNextBtnClick(year, month) {
      this.handleMonthSelect(month, year)
    },
    //切换日期时清空当前页的日志数据
    handleInitCurrentLogInfo() {
      this.list = []
      this.total = 0
      this.logQuery.page = 1
      this.isRealse = false
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
