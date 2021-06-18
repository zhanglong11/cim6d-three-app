<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y @scrolltolower="scrollToLower">
      <view class="main-body">
        <div class="calendar-wrap">
          <span class="calendar-view-mode-control" @click="weekSwitch = !weekSwitch">
            <image src="@/static/images/log/calendar.png" alt="" /> {{ weekSwitch ? '展开日历' : '收起日历' }}</span
          >
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
            <uni-card v-for="item in list" :key="item.id" @click.native="handleListItemClick(item)">
              <div class="item-body">
                <h2>{{ item.diaryDate|ymd }}</h2>
                <div class="flex-body">
                  <div class="content">
                    <p class="line">
                      <span>日志编号：</span><span>{{ item.code }}</span>
                    </p>
                    <p class="line">
                      <span>施工人员：</span>
                      <span>{{ _.map(item.employeeDTOList || [], i => i.name).join(',') }}</span>
                    </p>
                  </div>
                  <aside>
                    <uni-status :value="item.viewStatus" :options="readStatus"></uni-status>
                    <block v-if="item.viewStatus === 0 && item.creator === userId">
                      <p v-if="$hasPower('APPDecorationConstructionLogEdit')">
                        <span class="common-button" type="error" @click.stop="handleDelete(item.id)">删除</span>
                      </p>
                      <p v-if="$hasPower('APPDecorationConstructionLogDelete')">
                        <span class="common-button" type="primary" @click.stop="toEdit(item.id)">修改</span>
                      </p>
                    </block>
                  </aside>
                </div>
              </div>
              <view class="card-footer border-top">
                <text>记录人:{{ item.creatorName }}</text>
                <text>编制时间：{{ item.createTime | formatData }}</text>
              </view>
            </uni-card>
          </view>
          <!-- 无数据空载页 start -->
          <EmptyTemplate v-if="list.length === 0" />
          <!-- 无数据空载页 end -->
        </view>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <!-- 添加操作按钮开始 -->
    <uni-add v-if="$hasPower('APPDecorationConstructionLogAdd')" @click.native="handleAddLogItem" />
    <!-- 添加操作按钮结束 -->
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
              mode="base"
              type="warn"
              title="确认删除?"
              :before-close="true"
              @close="deleteClose"
              @confirm="deleteConfirm"
      ></uni-popup-dialog>
    </uni-popup>
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
import readStatus from './lib/readStatus'
import _ from 'lodash'
import Api from './api'
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
export default {
  components: {
    Calendar,
    UniPopupDialog
  },
  data() {
    return {
      // 日历参数
      calendarValue: [],
      weekSwitch: true,
      tileContent: [],
      tileContentWeixin: [],
      dateList: [], //有日志项的日期字符串组成的数组
      list: [],
      arrowLeft,
      arrowRight,
      filterForm: {
        page: 1,
        projectId: '',
        rows: 10
      },
      readStatus,
      total: 0,
      loading: false,
      isRealse: false, //标记日志列表是否为首次请求，用来避免全部数据加载完成后加载更多仍不停触发
      dateQuery: {
        //查询月中含有日至项的时间段
        diaryDateStr: null,
        projectId: ''
      },
      selectItemId:''//要删除的id
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userId'])
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  //上拉加载更多
  onReachBottom() {
    this.scrolltolower()
  },
  onLoad() {
    this.filterForm.projectId = this.projectId
    this.dateQuery.projectId = this.projectId
  },
  onShow() {
    this.setDefaultDateInfo()
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.handleQueryDateList()
      this.refresh(true)
    },
    // 设置请求含日志项请求的默认日期
    setDefaultDateInfo() {
      if (!this.filterForm.diaryStartTime) {
        this.filterForm.diaryStartTime = moment().format('YYYY-MM-DD 00:00:00')
        this.filterForm.diaryEndTime = moment().format('YYYY-MM-DD 23:59:59')
      }
      if (!this.dateQuery.diaryDateStr) {
        this.dateQuery.diaryDateStr = moment().format('YYYY-MM')
      }
    },
    //请求日志列表
    refresh: _.debounce(async function () {
      this.isRealse = false
      this.loading = true
      let res = await Api.getLogList(this.filterForm).finally(() => {
        this.loading = false
        this.isRealse = true
      })
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    }, 100),
    // 请求指定月内含有日志项的时间
    async handleQueryDateList() {
      let result = await Api.getMonthLogDayData(this.dateQuery)
      let datas = result.data || []
      if (datas.length === 0) return
      let currentData = _.map(datas, item => moment(item, ['YYYYMMDD']).format('YYYY-MM-DD')) //此次请求返回的含有日志项信息的日期
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
    },
    // 加载更多
    scrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    handleCalendarSelect(value1, value2) {
      // 选中日期后，查询当天下的日志项
      this.filterForm.diaryStartTime = moment(value2.date, ['YYYYMMDD']).format('YYYY-MM-DD 00:00:00')
      this.filterForm.diaryEndTime = moment(value2.date, ['YYYYMMDD']).format('YYYY-MM-DD 23:59:59')
      this.init()
    },
    handleMonthSelect(month, year) {
      // 月发生改变时，请求选中月的含有日志项的时间段及默认显示当月1号的日志项
      this.dateQuery.diaryDateStr = moment(`${year}-${month}`, ['YYYYMMDD']).format('YYYY-MM-DD')
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
    // 查看日志详情
    handleListItemClick({ id }) {
      this.$utils.toUrl(`/pages/decoration/decorationLog/construction/detail?id=${id}`)
    },
    //编辑
    toEdit(id) {
      this.$utils.toUrl(`/pages/decoration/decorationLog/construction/add?id=${id}`)
    },
    // 新建日志项
    handleAddLogItem() {
      this.$utils.toUrl(`/pages/decoration/decorationLog/construction/add`)
    },
    //删除
    async handleDelete(id) {
      this.selectItemId = id
      this.$refs.deletePopup.open()
    },
    //取消删除
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    //确认删除
    async deleteConfirm(done, value) {
      await Api.deleteLogById(this.selectItemId)
      done()
      this.$utils.showToast('删除成功')
      await this.init()
    },
  }
}
</script>

<style lang="less" scoped>
@import url('index.less');
</style>
