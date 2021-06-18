<template>
  <view class="main">
    <scroll-view>
      <view class="main-body">
        <view class="main-headers">
          <view>
            <view>{{ this.$store.state.user.userName }}</view>
            <!-- <view style="font-size: 12px; color: #999">{{ list.identity }}</view> -->
          </view>
          <view>{{ moment(new Date()).format('YYYY-MM-DD') }}</view>
        </view>
        <div class="calendar-wrap">
          <span class="calendar-view-mode-control" @click="weekSwitch = !weekSwitch">
            <image src="@/static/images/log/calendar.png" alt="" /> {{ weekSwitch ? '展开日历' : '收起日历' }}</span
          >
          <!-- <uni-calendar 
            :insert="true"
            :lunar="true" 
            ref="calendar"
            @change="change" /> -->
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
            <uni-card>
              <view class="tody-clock">{{ dayDatalist.remark }}</view>
            </uni-card>
            <uni-card>
              <view class="desc-main">
                <view class="item">
                  <view class="one-title">上班打卡:</view>
                  <view>{{ dayDatalist.ruleWorkClockInTime ? dayDatalist.ruleWorkClockInTime : '' }}</view>
                  <view class="tag">
                    <!-- <span :class="`work-item-type work-type-${e.type}`"> -->
                    <span :class="`work-item-type work-type-${dayDatalist.workClockInStatus}`">
                      {{
                        dayDatalist.workClockInStatus
                          ? workClockInStatusList.filter(info => info.value === dayDatalist.workClockInStatus)[0].label
                          : ''
                      }}
                    </span>
                  </view>
                </view>
                <view class="desc">
                  <view class="time">打卡时间：{{ dayDatalist.workClockInTime }}</view>
                  <view class="address">地点：{{ dayDatalist.workClockInLocation }}</view>
                  <view>备注：{{ dayDatalist.lateRemark }}</view>
                </view>
              </view>
            </uni-card>
            <uni-card>
              <view class="desc-main">
                <view class="item">
                  <view class="one-title">下班打卡:</view>
                  <view>{{ dayDatalist.ruleOffDutyClockInTime }}</view>
                  <view class="tag">
                    <span :class="`work-item-type work-type-${dayDatalist.offDutyClockInStatus}`">
                      {{
                        dayDatalist.offDutyClockInStatus
                          ? offDutyClockInStatusList.filter(info => info.value === dayDatalist.offDutyClockInStatus)[0]
                              .label
                          : ''
                      }}
                    </span>
                  </view>
                </view>
                <view class="desc">
                  <view class="time">打卡时间：{{ dayDatalist.offDutyClockInTime }}</view>
                  <view class="address">地点：{{ dayDatalist.offDutyClockInLocation }}</view>
                  <view>备注：{{ dayDatalist.leaveEarlyRemark }}</view>
                </view>
              </view>
            </uni-card>
          </view>
        </view>
      </view>
    </scroll-view>
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
import { mapGetters } from 'vuex'
import moment from 'moment'
import arrowLeft from '@/static/images/log/arrow-left-o.png'
import arrowRight from '@/static/images/log/arrow-right.png'
import _ from 'lodash'
import Api from './api'
import readStatus from './lib/readStatus'
import { offDutyClockInStatusList, workClockInStatusList } from './lib/yeStatus'
export default {
  components: {
    Calendar
  },
  data() {
    return {
      // 日历参数
      calendarValue: [],
      weekSwitch: false,
      tileContent: [],
      tileContentWeixin: [],
      dateList: [], //有日志项的日期字符串组成的数组
      list: [],
      optionsList: [],
      dayDatalist: [],
      arrowLeft,
      arrowRight,
      filterForm: {
        time: moment().format('YYYY-MM'),
        userType: 1
      },
      total: 0,
      loading: false,
      isRealse: false, //标记日志列表是否为首次请求，用来避免全部数据加载完成后加载更多仍不停触发
      dateQuery: {
        //查询月中含有日至项的时间段
        queryTime: null
      },
      readStatus,
      offDutyClockInStatusList,
      workClockInStatusList
    }
  },
  computed: {},
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },

  onLoad() {},
  onShow() {
    this.setDefaultDateInfo()
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.list = []
      console.log()
      this.refresh(true)
    },
    // 设置请求含日志项请求的默认日期
    setDefaultDateInfo() {
      if (!this.filterForm.time) {
        this.filterForm.time = moment().format('YYYY-MM')
      }
      if (!this.dateQuery.queryTime) {
        this.dateQuery.queryTime = moment().format('YYYY-MM-DD')
      }
    },
    //请求列表
    refresh: _.debounce(async function () {
      this.isRealse = false
      this.loading = true
      let res = await Api.getAttendanceClockInyl(this.filterForm).finally(() => {
        this.loading = false
        this.isRealse = true
      })
      this.list = res.data || [] //原始数据
      //数据筛选
      this.dateList = this.list.map(item => moment(item.date).format('YYYY-MM-DD')) //所有日期
      this.getDataSelect()
      this.handleQueryDateList()
    }, 100),
    //数据筛选
    getDataSelect() {
      console.log('---进')
      this.dayDatalist = this.list.filter(item => {
        return moment(item.date).format('YYYY-MM-DD') === moment(this.dateQuery.queryTime).format('YYYY-MM-DD')
      })
      this.dayDatalist = this.dayDatalist[0] || []
    },
    // 请求指定月内含有日志项的时间
    async handleQueryDateList() {
      // let result = await Api.getAttendanceClockInyls(this.dateQuery)
      // let datas = result.data || []
      let datas = this.dateList
      if (datas.length === 0) return
      let currentData = _.map(datas, item => moment(item, ['YYYYMMDD']).format('YYYY-MM-DD')) //此次请求返回的含有日志项信息的日期
      this.dateList = _.uniq([...this.dateList, ...currentData])
      this.tileContent = []
      this.tileContentWeixin = []
      _.forEach(this.dateList, item => {
        let newItem = item.split('-')
        let allStatus = _.find(this.list, i => i.date === item).allStatus
        this.tileContent.push({
          date: `${parseInt(newItem[0])}-${parseInt(newItem[1])}-${parseInt(newItem[2])}`, // 修复日历bug
          className: allStatus === 1 ? 'pin' : 'pinred',
          content: '●'
        })

        this.tileContentWeixin.push({
          date: item
        })
      })
    },
    // 加载更多
    scrollToLower() {},
    handleCalendarSelect(value1, value2) {
      // 选中日期后，查询当天下的日志项
      this.dateQuery.queryTime = moment(value1.date, ['YYYYMMDD']).format('YYYY-MM-DD')
      this.dateQuery.queryTime = moment(value2.date, ['YYYYMMDD']).format('YYYY-MM-DD')
      this.getDataSelect()
    },
    handleMonthSelect(month, year) {
      this.dateQuery.queryTime = moment(`${year}-${month}`, ['YYYYMMDD']).format('YYYY-MM-DD')
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
    }
  }
}
</script>

<style lang="less" scoped>
@import url('clock.less');
.desc-main {
  .item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    color: #000;
    .one-title {
      padding: 0 15px;
      font-size: 14px;
      color: #000;
      font-weight: bold;
    }
    .one-title:before {
      content: '';
      width: 10px;
      height: 10px;
      margin-right: 10px;
      display: inline-block;
      background: url(@/static/images/clock/clock-9.png) no-repeat center;
      background-size: 100% 100%;
      vertical-align: middle;
    }
    .tag {
      margin-left: 20px;
      .work-item-type {
        flex: inherit;
        padding: 3px 6px;
        border-radius: 6px;
        margin-right: 14px;
        font-weight: normal;
        font-size: 12px;
        line-height: 1;
        margin-top: 6px;
      }
      .work-type-1 {
        color: #1890ff;
        background: #e6f7ff;
        border: solid 1px #9edaff;
      }
      .work-type-2 {
        color: #722ed1;
        background: #f9f0ff;
        border: solid 1px #d9b8f8;
      }
      .work-type-3 {
        color: #13c2c2;
        background: #e6fffb;
        border: solid 1px #96ebe2;
      }
      .work-type-4 {
        color: #52c41a;
        background: #f6ffed;
        border: solid 1px #c1ee9d;
      }
      .work-type-5 {
        color: #f5317f;
        background: #fff0f6;
        border: solid 1px #f5317f;
      }
      .work-type-6 {
        color: #c41aa8;
        background: #f6ffed;
        border: solid 1px #c1ee9d;
      }
      .work-type-7 {
        color: #f5313b;
        background: #fff0f6;
        border: solid 1px #f5317f;
      }
    }
  }
  .desc {
    padding: 10px 30px;
    color: #999;
    .time:before {
      content: '';
      width: 15px;
      height: 15px;
      margin-right: 10px;
      display: inline-block;
      background: url(@/static/images/clock/clock-4.png) no-repeat center;
      background-size: 100% 100%;
    }
    .address:before {
      content: '';
      width: 15px;
      height: 15px;
      margin-right: 10px;
      display: inline-block;
      background: url(@/static/images/clock/clock-6.png) no-repeat center;
      background-size: 100% 100%;
    }
  }
}
</style>
