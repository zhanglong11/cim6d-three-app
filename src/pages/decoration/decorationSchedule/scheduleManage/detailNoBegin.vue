<template>
  <view class="main">
    <view class="info-view">房间号：{{ detailData.roomDetailName }}</view>
    <view class="info-view">使用工序组：{{ detailData.procedureGroupName }}</view>
    <view class="info-view">计划工期(天)：{{ detailData.forecastTime }}</view>
    <view class="info-view">工序组详情：</view>
    <view class="table-con">
      <view class="table-head">
        <view class="column1">序号</view>
        <view class="column2">工序名称</view>
        <view class="column3">是否验收</view>
        <view class="column4">工序标准</view>
      </view>
      <view v-for="(item, index) in tableData" :key="index" class="table-item">
        <view class="column1">{{ index + 1 }}</view>
        <view class="column2">{{ item.procedureName }}</view>
        <view class="column3">
          <span v-if="item.acceptanceFlag" style="color: red">是</span>
          <span v-else>否</span>
        </view>
        <view class="column4">{{ item.procedureStandard }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      detailData: {},
      tableData: []
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
    }
  }
}
</script>

<style lang="less" scoped>
@import './detail.less';
</style>
