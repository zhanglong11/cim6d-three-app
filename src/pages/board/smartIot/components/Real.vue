<template>
  <view class="wrap">
    <video v-if="list.length" :src="videoUrl" autoplay controls></video>
    <uni-card v-if="list.length" class="list">
      <view v-for="item in list" :key="item.id" class="item" @click="playCurrent(item)">
        <span>{{ item.deviceName }}</span>
        <view>
          <image
            v-if="item.status === 'monitorStatus_1'"
            class="img"
            :src="require('../../images/monitor-success.png')"
          />
          <image v-if="item.status === 'monitorStatus_2'" class="img" :src="require('../../images/monitor-err.png')" />
          <image v-if="item.status === 'monitorStatus_4'" class="img" :src="require('../../images/monitor-warn.png')" />
          <span>{{ $getLabelFromArg('monitorStatus', item.status) }}</span>
        </view>
      </view>
    </uni-card>
    <uni-card class="list">
      <h5 class="title">设备信息</h5>
      <!--      升降机-->
      <template v-if="type === '67'">
        <view class="item">
          <span>设备编号</span>
          <span>{{ info.devsn }}</span>
        </view>
        <view class="item">
          <span>载重重量</span>
          <span>{{ info.weight }} kg</span>
        </view>
        <view class="item">
          <span>运行速度</span>
          <span>{{ info.speed }} 米</span>
        </view>
        <view class="item">
          <span>发送时间</span>
          <span>{{ info.sendtime }}</span>
        </view>
        <view class="item">
          <span>运行高度</span>
          <span>{{ info.height }} 米</span>
        </view>
        <view class="item">
          <span>前门状态</span>
          <span>{{ info.foreDoorStatus === '1' ? '打开' : '关闭' }}</span>
        </view>
        <view class="item">
          <span>后门状态</span>
          <span>{{ info.behindDoorStatus === '1' ? '打开' : '关闭' }}</span>
        </view>
        <view class="item">
          <span>风速</span>
          <span>{{ info.windSpeed }} m/s</span>
        </view>
        <view class="item">
          <span>重量百分比</span>
          <span>{{ info.weightPercent }} %</span>
        </view>
        <view class="item">
          <span>高度百分比</span>
          <span>{{ info.heightPercent }} %</span>
        </view>
        <view class="item">
          <span>实时倾斜度1</span>
          <span>{{ info.tilt1 }} 度</span>
        </view>
        <view class="item">
          <span>倾斜百分比1</span>
          <span>{{ info.tiltPercent1 }} %</span>
        </view>
        <view class="item">
          <span>实时倾斜度2</span>
          <span>{{ info.tilt2 }} 度</span>
        </view>
        <view class="item">
          <span>倾斜百分比2</span>
          <span>{{ info.tiltPercent2 }} %</span>
        </view>
      </template>
      <template v-else>
        <view class="item">
          <span>设备编号</span>
          <span>{{ info.devNo }}</span>
        </view>
        <view class="item">
          <span>风速</span>
          <span>{{ info.wind }} m/s</span>
        </view>
        <view class="item">
          <span>载重</span>
          <span>{{ info.weight }} t</span>
        </view>
        <view class="item">
          <span>回转</span>
          <span>{{ info.rotation }} °</span>
        </view>
        <view class="item">
          <span>幅度</span>
          <span>{{ info.radius }} m</span>
        </view>
        <view class="item">
          <span>风速</span>
          <span>{{ info.wind }}</span>
        </view>
        <view class="item">
          <span>高度</span>
          <span>{{ info.height }} m</span>
        </view>
        <view class="item">
          <span>力矩百分比</span>
          <span>{{ info.torquePercent }} %</span>
        </view>
        <view class="item">
          <span>力矩</span>
          <span>{{ info.torque }} t*m</span>
        </view>
        <view class="item">
          <span>倾角X</span>
          <span>{{ info.angleX }} °</span>
        </view>
        <view class="item">
          <span>倾角Y</span>
          <span>{{ info.angleY }} °</span>
        </view>
        <view class="item">
          <span>当前倍率</span>
          <span>{{ info.multipRate }}</span>
        </view>
        <view class="item">
          <span>定幅变码</span>
          <span>{{ info.fixedCodeAmplitude }}</span>
        </view>
        <view class="item">
          <span>定码变幅</span>
          <span>{{ info.fixedAmplitudeVariableCode }}</span>
        </view>
        <view class="item">
          <span>实时额定载重</span>
          <span>{{ info.rated_weight }} t</span>
        </view>
        <view class="item">
          <span>风级</span>
          <span>{{ info.windLevel }}</span>
        </view>
        <view class="item">
          <span>时间</span>
          <span>{{ info.time }}</span>
        </view>
      </template>
    </uni-card>
  </view>
</template>

<script>
import Api from '../api'
export default {
  name: 'Real',
  // import引入的组件
  components: {},
  props: {
    id: {},
    type: {}
  },
  data() {
    // 这里存放数据
    return {
      videoUrl: '',
      list: [],
      info: {},
      projectId: localStorage.getItem('projectId'),
      timer: null
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getEquipmentInfo()
    },
    async playCurrent(item) {
      this.clearTimer()
      let res = await Api.getVideoUrl({
        factoryNum: item.factoryNum,
        deviceNum: item.deviceNum,
        projectId: this.projectId
      })
      let datas = res.data
      let videoUrl = datas ? datas.HLS : ''
      this.videoUrl = videoUrl
      if (!videoUrl) {
        return
      }
      this.timer = setInterval(() => {
        Api.touch({ factoryNum: item.factoryNum, deviceNum: item.deviceNum, projectId: this.projectId })
      }, 9000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    async getEquipmentInfo() {
      let res
      if (this.type === '67') {
        res = await Api.getElevatorInfo({ devId: this.id })
        this.info = res.data.lifterDataList || {}
      } else {
        res = await Api.getEquipmentInfo({ devId: this.id })
        this.info = res.data.towerDataList || {}
      }
      let videoList = res.data.monitorCameraQueryDTOS || []
      this.list = videoList
      if (videoList && videoList.length) {
        this.playCurrent(videoList[0])
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 750rpx;
  padding: 0 25rpx;
  background-color: #f9f9f9;
  video {
    width: 100%;
  }
  .list {
    padding: 0 20px;
    .title {
      padding: 20px 10px;
      font-size: 16px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 20px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
      .img {
        display: inline-block;
        width: 30px;
        height: 35px;
        margin-right: 20px;
        vertical-align: -1px;
      }
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
