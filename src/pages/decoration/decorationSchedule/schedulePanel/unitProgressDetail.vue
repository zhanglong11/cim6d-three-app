<template>
  <view class="main">
    <view class="floors-con">
      <view v-for="(floor, fIndex) in detailData.floorList" :key="fIndex" class="floor-item">
        <view class="floor-name">{{ floor.floorName }}</view>
        <view class="rooms-con">
          <view class="rooms-con-items">
            <view
              v-for="(room, rIndex) in floor.roomList"
              :key="rIndex"
              :class="[
                'room-item',
                room.decorateState !== 3
                  ? room.decorateState === 2
                    ? 'notStarted'
                    : 'inProgress'
                  : room.resultState === 1
                  ? 'advance'
                  : room.resultState === 2
                  ? 'onTime '
                  : 'timeout'
              ]"
              :title="room.roomName"
              @click="handleRoomClick(room)"
            >
              {{ room.roomName }}
            </view>
          </view>
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
      detailData: {
        buildingName: '',
        unitName: ''
      }
    }
  },
  onLoad(options) {
    this.unitId = options.id || ''
  },
  async mounted() {
    if (this.unitId) {
      // console.log(this.unitId)
      uni.showLoading()
      await this.getUnitScheduleDetail(this.unitId)
      uni.hideLoading()
      uni.setNavigationBarTitle({
        title: this.detailData.buildingName + this.detailData.unitName + '进度详情'
      })
    }
  },
  methods: {
    // 获取单元进度详情
    async getUnitScheduleDetail(id) {
      let res = await Api.getUnitScheduleDetail(id)
      // console.log(res)
      res.data.floorList.reverse() // 楼层反转
      this.detailData = res.data
    },
    // 房间点击
    handleRoomClick(room) {
      // 处理路由跳转
      // console.log(room)
      if (room.decorateState === 2 && this.$hasPower('AppDetailNoBegin')) {
        // 未开始
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/detailNoBegin?id=${room.scheduleId}`)
      } else if (room.decorateState === 3 && this.$hasPower('AppDetailFinish')) {
        // 已完工
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/detailFinish?id=${room.scheduleId}`)
      } else if (room.decorateState === 1 && this.$hasPower('AppManageProcess')) {
        // 进行中
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/scheduleManage/manageProcess?id=${room.scheduleId}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.floors-con {
  margin-top: -20px;
  font-size: 14px;
  .floor-item {
    display: flex;
    align-items: center;
    margin: 24px 0px;
    .floor-name {
      width: 100px;
      padding-left: 15px;
    }
    .rooms-con {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      .rooms-con-items {
        display: flex;
        flex-wrap: wrap;
        .room-item {
          border: solid 1px #cbcbcb;
          width: 120px;
          padding: 8px;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 8px 0px 8px -1px;
        }
        /*.room-item-active {
            background: #d3def6;
            color: #666666;
          }*/
      }
    }
  }
}
.inProgress {
  background: #bdc6ff;
  color: #666666;
}
.notStarted {
  background: #e3e3e3;
  color: #666666;
}
.advance {
  background: #b5f569;
  color: #666666;
}
.onTime {
  background: #f6f870;
  color: #666666;
}
.timeout {
  background: #ff9595;
  color: #666666;
}
</style>
