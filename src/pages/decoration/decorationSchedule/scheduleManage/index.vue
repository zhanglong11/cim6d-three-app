<template>
  <view class="main">
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card
            v-for="item in list"
            :key="item.id"
            :className="item.resultState === 3 ? ' time-out-item' : ''"
            @click.native="toDetail(item)"
          >
            <view class="card-body">
              <view class="card-info">
                <view class="header">
                  <view class="room-name ellipsis">{{ item.roomDetailName }}</view>
                  <view class="group-name">{{ item.procedureGroupName }}</view>
                  <view class="decorate-state">
                    <view v-if="item.decorateState === 1">进行中</view>
                    <view v-if="item.decorateState === 2">未开始</view>
                    <view v-if="item.decorateState === 3">已完工</view>
                  </view>
                </view>
                <view class="duration">
                  <view class="plan-time">计划工期(天)：{{ item.forecastTime }}</view>
                  <view v-if="item.actualDays" class="real-time">实际工期(天)：{{ item.actualDays }}</view>
                  <view class="result">
                    <view v-if="item.resultState === 1">●&nbsp;提前</view>
                    <view v-if="item.resultState === 2">●&nbsp;按时</view>
                    <view v-if="item.resultState === 3" style="color: red">●&nbsp;超时</view>
                  </view>
                </view>
                <view v-if="item.actualStartTime">实际开始时间：{{ item.actualStartTime }}</view>
                <view v-if="item.actualEndTime">实际结束时间：{{ item.actualEndTime }}</view>
                <view class="operation">
                  <view>
                    <a
                      v-if="
                        (item.decorateState === 1 || item.decorateState === 3) && $hasPower('AppMaterialArtificial')
                      "
                      @click.stop="handleMaterialArtificial(item)"
                      >材料及人工清单</a
                    >
                  </view>
                  <view>
                    <a
                      v-if="item.decorateState === 1 && $hasPower('AppManageProcess')"
                      @click.stop="handleManageProcess(item)"
                      >管理工序</a
                    >
                    <a
                      v-if="item.decorateState === 2 && $hasPower('AppStartDecorate')"
                      @click.stop="handleStartFitment(item)"
                      >开始装修</a
                    >
                  </view>
                </view>
              </view>
            </view>
          </uni-card>
        </block>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" isConfirm @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6 class="label">房间号</h6>
      <uni-select-floor v-model="drawerForm.roomInfo" />
      <h6 class="label">使用工序组</h6>
      <uni-select-process-group v-model="drawerForm.procedureGroupId" />
      <h6 class="label">装修状态</h6>
      <uni-checkbox-button-group v-model="drawerForm.decorateState" :options="decorateStateList" hasAll />
      <h6 class="label">完成成果</h6>
      <uni-checkbox-button-group v-model="drawerForm.resultState" :options="resultStateList" hasAll />
      <h6 class="label">实际开始时间</h6>
      <view class="time-view">
        <view class="time-start">
          <uni-date-picker
            v-model="drawerForm.startTime"
            placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
        <view class="time-interval">
          <span> ~ </span>
        </view>
        <view class="time-end">
          <uni-date-picker
            v-model="drawerForm.endTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
      </view>
      <h6 class="label">实际结束时间</h6>
      <view class="time-view">
        <view class="time-start">
          <uni-date-picker
            v-model="drawerForm.beginTime"
            placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
        <view class="time-interval">
          <span> ~ </span>
        </view>
        <view class="time-end">
          <uni-date-picker
            v-model="drawerForm.finishTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
      </view>
    </uni-drawer-custom>
  </view>
</template>

<script>
import Api from './api'
import UniSelectFloor from '@/components/uni-select-floor/uni-select-floor'
import UniSelectProcessGroup from '@/components/uni-select-process-group/uni-select-process-group'
import utils from '@/utils/utils'
import moment from 'moment'
export default {
  components: { UniSelectFloor, UniSelectProcessGroup },
  data() {
    return {
      filterForm: {
        roomInfo: ['', '', '', ''],
        buildingId: '',
        unitsId: '',
        floorId: '',
        roomId: '',
        procedureGroupId: '',
        decorateState: '',
        resultState: '',
        startTime: '',
        endTime: '',
        beginTime: '',
        finishTime: '',
        page: 1,
        rows: 10
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: [],
      decorateStateList: [
        { value: 1, label: '进行中' },
        { value: 2, label: '未开始' },
        { value: 3, label: '已完工' }
      ],
      resultStateList: [
        { value: 1, label: '提前' },
        { value: 2, label: '按时' },
        { value: 3, label: '超时' }
      ]
    }
  },
  onShow() {
    this.init()
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  // 标题栏点击
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    // 刷新
    async refresh() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getScheduleList(data).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    },
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 加载更多--无数据时scrollView不存在，滚动底部时，不会触发请求
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    // 筛选查询
    handleDrawerFormChange() {
      if (this.drawerForm.startTime || this.drawerForm.endTime) {
        if (!this.drawerForm.startTime) {
          utils.showToast('请选择实际开始-开始时间')
          return
        } else if (!this.drawerForm.endTime) {
          utils.showToast('请选择实际开始-结束时间')
          return
        } else if (moment(this.drawerForm.endTime).isBefore(this.drawerForm.startTime)) {
          utils.showToast('实际开始-开始时间不能大于实际开始-结束时间')
          return
        } else if (this.drawerForm.endTime === this.drawerForm.startTime) {
          utils.showToast('实际开始-开始时间不能等于实际开始-结束时间')
          return
        }
      }
      if (this.drawerForm.beginTime || this.drawerForm.finishTime) {
        if (!this.drawerForm.beginTime) {
          utils.showToast('请选择实际结束-开始时间')
          return
        } else if (!this.drawerForm.finishTime) {
          utils.showToast('请选择实际结束-结束时间')
          return
        } else if (moment(this.drawerForm.finishTime).isBefore(this.drawerForm.beginTime)) {
          utils.showToast('实际结束-开始时间不能大于实际结束-结束时间')
          return
        } else if (this.drawerForm.finishTime === this.drawerForm.beginTime) {
          utils.showToast('实际结束-开始时间不能等于实际结束-结束时间')
          return
        }
      }
      this.$refs.filterRef.close()
      this.drawerForm.buildingId = this.drawerForm.roomInfo[0]
      this.drawerForm.unitsId = this.drawerForm.roomInfo[1]
      this.drawerForm.floorId = this.drawerForm.roomInfo[2]
      this.drawerForm.roomId = this.drawerForm.roomInfo[3]
      this.filterForm = this.drawerForm
      this.init()
    },
    // 重置筛选条件
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    // 开始装修
    handleStartFitment(item) {
      uni.showModal({
        title: '开始装修',
        content: '一旦开始装修，将会以当前时间作为实际开始时间来计算实际工期，确定开始吗？',
        success: res => {
          if (res.confirm) {
            Api.startDecorate(item.scheduleId).then(res => {
              this.$utils.showToast('操作成功')
              this.init()
            })
          }
        }
      })
    },
    // 管理工序
    handleManageProcess(item) {
      this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/manageProcess?id=${item.scheduleId}`)
    },
    // 查看详情(未开始、已完工)
    toDetail(item) {
      if (item.decorateState === 2 && this.$hasPower('AppDetailNoBegin')) {
        // 未开始
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/detailNoBegin?id=${item.scheduleId}`)
      } else if (item.decorateState === 3 && this.$hasPower('AppDetailFinish')) {
        // 已完工
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/detailFinish?id=${item.scheduleId}`)
      }
    },
    // 材料及人工清单
    handleMaterialArtificial(item) {
      this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/materialArtificial?id=${item.scheduleId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/list.less';
/deep/ .time-out-item {
  background: #fff6f6;
  border-radius: 20px;
}
.card-info {
  width: 100%;
  .header {
    display: flex;
    .room-name {
      font-weight: bold;
      font-size: 14px;
      color: #000000;
      flex: 44%;
    }
    .group-name {
      flex: 44%;
    }
    .decorate-state {
      flex: 12%;
      text-align: right;
    }
  }
  .duration {
    display: flex;
    justify-content: space-between;
    .plan-time {
      flex: 0 0 44%;
    }
    .real-time {
      flex: 0 0 44%;
    }
    .result {
      flex: 0 0 12%;
    }
  }
  .operation {
    margin-top: 8px;
    padding-top: 4px;
    border-top: solid 1px #e5e5e5;
    display: flex;
    justify-content: space-between;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-view {
  display: flex;
  .time-start {
    flex: 40%;
    display: flex;
    justify-content: center;
    /deep/ .placeholder {
      color: #bbb;
    }
  }
  .time-interval {
    flex: 20%;
    display: flex;
    justify-content: center;
    color: #757575;
  }
  .time-end {
    flex: 40%;
    display: flex;
    justify-content: center;
    /deep/ .placeholder {
      color: #bbb;
    }
  }
}
</style>
