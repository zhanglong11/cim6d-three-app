<template>
  <view class="main">
    <view class="info-view">房间号：{{ detailData.roomDetailName }}</view>
    <view class="info-view">使用工序组：{{ detailData.procedureGroupName }}</view>
    <view class="info-view">计划工期(天)：{{ detailData.forecastTime }}</view>
    <view class="info-view">实际工期(天)：{{ detailData.actualDays }}</view>
    <view class="info-view">
      <span>完成效果：</span>
      <span v-if="detailData.resultState === 1">提前</span>
      <span v-if="detailData.resultState === 2">按时</span>
      <span v-if="detailData.resultState === 3">超时</span>
    </view>
    <view class="info-view">实际开始时间：{{ detailData.actualStartTime }}</view>
    <view class="info-view">实际结束时间：{{ detailData.actualEndTime }}</view>
    <view class="info-view">工序组详情：</view>
    <view class="table-con">
      <view class="table-head">
        <view class="column1">序号</view>
        <view class="column2">工序名称</view>
        <view class="column3">是否验收</view>
        <view class="column4">操作</view>
      </view>
      <view v-for="(item, index) in tableData" :key="index" class="table-item">
        <view class="column1">{{ index + 1 }}</view>
        <view class="column2">{{ item.procedureName }}</view>
        <view class="column3">
          <span v-if="item.acceptanceFlag" style="color: red">是</span>
          <span v-else>否</span>
        </view>
        <view class="column4">
          <a v-if="$hasPower('AppFinishProcessDetail')" @click="handleDetail(item)">查看完成详情</a>
          <a v-if="$hasPower('AppUpdateFinishProcess')" @click="handleUpdate(item)">修改</a>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'

export default {
  data() {
    return {
      tableData: [],
      detailData: {}
    }
  },
  onLoad(options) {
    this.scheduleId = options.id || ''
  },
  created() {
    if (this.scheduleId) {
      this.getScheduleDetail(this.scheduleId)
    }
  },
  methods: {
    // 获取进度详情，scheduleProcedureState(1：全部 2未完成 3：已完成)
    getScheduleDetail(id) {
      uni.showLoading()
      Api.getScheduleDetail(id).then(res => {
        // console.log(res)
        this.detailData = res.data
        this.tableData = res.data.procedureList
        uni.hideLoading()
      })
    },
    // 查看完成详情
    handleDetail(item) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSchedule/scheduleManage/finishProcessDetail?scheduleId=${item.scheduleId}&scheduleProcedureId=${item.scheduleProcedureId}`
      )
    },
    // 修改
    handleUpdate(item) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSchedule/scheduleManage/updateFinishProcess?scheduleId=${item.scheduleId}&scheduleProcedureId=${item.scheduleProcedureId}`
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import './detail.less';
.column4 {
  justify-content: center;
  > a:nth-child(1) {
    margin-right: 14px;
  }
}
</style>
