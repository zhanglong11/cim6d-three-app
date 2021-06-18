<template>
  <view class="main">
    <view class="overall">
      <view class="titleText">整体进度</view>
      <view v-if="detailData.roomTotalNum !== 0">
        <view class="roomTotalNum">
          <view class="line"></view>
          <view class="text">共{{ detailData.roomTotalNum }}房间</view>
          <view class="line"></view>
        </view>
        <view class="schedule-bar">
          <view
            v-if="detailData.advanceNum"
            class="item advance-item"
            :style="`flex: 0 0 ${detailData.advancePercent}`"
          ></view>
          <view
            v-if="detailData.onTimeNum"
            class="item onTime-item"
            :style="`flex: 0 0 ${detailData.onTimePercent}`"
          ></view>
          <view
            v-if="detailData.timeoutNum"
            class="item timeout-item"
            :style="`flex: 0 0 ${detailData.timeoutPercent}`"
          ></view>
          <view
            v-if="detailData.inProgressNum"
            class="item inProgress-item"
            :style="`flex: 0 0 ${detailData.inProgressPercent}`"
          ></view>
          <view
            v-if="detailData.notStartedNum"
            class="item notStarted-item"
            :style="`flex: 0 0 ${detailData.notStartedPercent}`"
          ></view>
        </view>
        <view class="legend-con">
          <view class="legend-item">
            <view class="color-block"><view class="advance-item"></view></view>
            <view class="label">已完工房间(提前)</view>
            <view class="roomNum">共{{ detailData.advanceNum }}房间</view>
            <view class="percent">{{ detailData.advancePercent ? detailData.advancePercent : '0%' }}</view>
          </view>
          <view class="legend-item">
            <view class="color-block"><view class="onTime-item"></view></view>
            <view class="label">已完工房间(按时)</view>
            <view class="roomNum">共{{ detailData.onTimeNum }}房间</view>
            <view class="percent">{{ detailData.onTimePercent ? detailData.onTimePercent : '0%' }}</view>
          </view>
          <view class="legend-item">
            <view class="color-block"><view class="timeout-item"></view></view>
            <view class="label">已完工房间(超期)</view>
            <view class="roomNum">共{{ detailData.timeoutNum }}房间</view>
            <view class="percent">{{ detailData.timeoutPercent ? detailData.timeoutPercent : '0%' }}</view>
          </view>
          <view class="legend-item">
            <view class="color-block"><view class="inProgress-item"></view></view>
            <view class="label">装修中房间</view>
            <view class="roomNum">共{{ detailData.inProgressNum }}房间</view>
            <view class="percent">{{ detailData.inProgressPercent ? detailData.inProgressPercent : '0%' }}</view>
          </view>
          <view class="legend-item">
            <view class="color-block"><view class="notStarted-item"></view></view>
            <view class="label">未开始房间</view>
            <view class="roomNum">共{{ detailData.notStartedNum }}房间</view>
            <view class="percent">{{ detailData.notStartedPercent ? detailData.notStartedPercent : '0%' }}</view>
          </view>
        </view>
      </view>
      <view v-else class="no-data">暂无数据</view>
    </view>
    <view class="monthly" @click="toMonthlyProgress">
      <view class="textLabel">月度进度</view>
      <view class="arrows"></view>
    </view>
    <view class="unit" @click="toUnitProgress">
      <view class="textLabel">单元进度</view>
      <view class="arrows"></view>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      detailData: {
        advanceNum: 0, // 提前
        onTimeNum: 0, // 正常
        timeoutNum: 0, // 超期
        inProgressNum: 0, // 装修中
        notStartedNum: 0, // 未开始
        roomTotalNum: 0 // 房间总数
      }
    }
  },
  created() {
    this.getOverallSchedule()
  },
  methods: {
    // 获取整体进度信息
    getOverallSchedule() {
      Api.getOverallSchedule().then(res => {
        this.detailData = res.data
        this.initPercent()
      })
    },
    // 百分比计算
    initPercent() {
      if (this.detailData.roomTotalNum) {
        if (this.detailData.advanceNum) {
          this.detailData.advancePercent =
            ((this.detailData.advanceNum / this.detailData.roomTotalNum) * 100).toFixed(2) + '%'
        }
        if (this.detailData.onTimeNum) {
          this.detailData.onTimePercent =
            ((this.detailData.onTimeNum / this.detailData.roomTotalNum) * 100).toFixed(2) + '%'
        }
        if (this.detailData.timeoutNum) {
          this.detailData.timeoutPercent =
            ((this.detailData.timeoutNum / this.detailData.roomTotalNum) * 100).toFixed(2) + '%'
        }
        if (this.detailData.inProgressNum) {
          this.detailData.inProgressPercent =
            ((this.detailData.inProgressNum / this.detailData.roomTotalNum) * 100).toFixed(2) + '%'
        }
        if (this.detailData.notStartedNum) {
          this.detailData.notStartedPercent =
            ((this.detailData.notStartedNum / this.detailData.roomTotalNum) * 100).toFixed(2) + '%'
        }
        this.$forceUpdate()
      }
    },
    // 跳转月度进度界面
    toMonthlyProgress() {
      this.$utils.toUrl(`/pages/decoration/decorationSchedule/schedulePanel/monthlyProgress`)
    },
    // 跳转单元进度界面
    toUnitProgress() {
      this.$utils.toUrl(`/pages/decoration/decorationSchedule/schedulePanel/unitProgress`)
    }
  }
}
</script>

<style lang="less" scoped>
.overall,
.monthly,
.unit {
  background: #ffffff;
  border: solid 1px #e5e5e5;
  border-radius: 16px;
  margin: 0px 20px 30px;
  padding: 24px;
  color: #333333;
  .titleText {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: solid 1px #ebeef5;
  }
  .roomTotalNum {
    margin-bottom: 20px;
    font-size: 12px;
    border-left: solid 1px #d9d9d9;
    border-right: solid 1px #d9d9d9;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .line {
      flex: 1;
      height: 1px;
      background: #d9d9d9;
    }
    .text {
      margin: 0px 10px;
      flex: 0 0 auto;
    }
  }
  .schedule-bar {
    display: flex;
    .item {
      height: 50px;
    }
  }

  .legend-con {
    font-size: 12px;
    .legend-item {
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .color-block {
        flex: 0 0 10%;
        > view {
          width: 30px;
          height: 30px;
        }
      }
      .label {
        flex: 0 0 44%;
      }
      .roomNum {
        flex: 0 0 30%;
      }
      .percent {
        flex: 0 0 16%;
      }
    }
  }

  .no-data {
    font-size: 14px;
    color: #666666;
    text-align: center;
  }

  .advance-item {
    background: #b5f569;
  }
  .onTime-item {
    background: #f6f870;
  }
  .timeout-item {
    background: #ff9595;
  }
  .inProgress-item {
    background: #bdc6ff;
  }
  .notStarted-item {
    background: #e3e3e3;
  }
}

.monthly,
.unit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .textLabel {
    font-size: 14px;
    font-weight: bold;
  }
  .arrows {
    width: 20px;
    height: 20px;
    border-right: solid 1px #cccccc;
    border-bottom: solid 1px #cccccc;
    transform: rotate(-45deg);
  }
}
</style>
