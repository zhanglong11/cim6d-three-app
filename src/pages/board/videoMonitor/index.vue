<template>
  <view class="wrap">
    <video :src="videoUrl" :autoplay="true" controls></video>
    <section class="container">
      <ul class="collapse-wrap">
        <li v-for="item in list" class="section">
          <div class="title" @click="getChild(item, false)">
            <span>{{ item.name }}</span>
            <uni-icons color="#999999" class size="20" :type="openId.includes(item.id) ? 'arrowdown' : 'arrowup'" />
          </div>
          <ul v-if="openId.includes(item.id)" class="list">
            <li v-for="child in item.children" :key="child.id" class="item" @click="deviceClick(child)">
              <span>
                <radio class="radio" v-if="currentId === child.id" checked="true"></radio>
                {{ child.deviceName }}</span
              >
              <view class="status">
                <image
                  v-if="child.status === 'monitorStatus_1'"
                  class="img"
                  :src="require(`../images/monitor-success.png`)"
                />
                <image
                  v-if="child.status === 'monitorStatus_2'"
                  class="img"
                  :src="require(`../images/monitor-err.png`)"
                />
                <image
                  v-if="child.status === 'monitorStatus_4'"
                  class="img"
                  :src="require(`../images/monitor-warn.png`)"
                />
                {{ $getLabelFromArg('monitorStatus', child.status) }}
              </view>
            </li>
          </ul>
        </li>
      </ul>
      <!--      <Collapse :list="list">-->
      <!--        <template #title="{ info }">-->
      <!--          <span>{{ info.name }}</span>-->
      <!--        </template>-->
      <!--        <template #item="{ info }">-->
      <!--          <view class="item">-->
      <!--            <span>{{ info.name }}</span>-->
      <!--            <view class="status">-->
      <!--              <image class="img" :src="require('../images/monitor-err.png')"></image>-->
      <!--              {{ $getLabel(statusList, info.status) }}-->
      <!--            </view>-->
      <!--          </view>-->
      <!--        </template>-->
      <!--      </Collapse>-->
    </section>
  </view>
</template>
<script>
import Collapse from './collapse'
import Api from './api'
import treeForEach from '@/utils/treeForEach'
import { cloneDeep } from 'lodash'
export default {
  name: 'index',
  // import引入的组件
  components: {
    Collapse
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      videoUrl: '',
      list: [],
      currentId: null,
      openId: [],
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
      this.getData()
    },
    async getData() {
      let res = await Api.areaList({ page: 1, rows: 100 })
      let cloneData = cloneDeep(res.data.records)
      this.list = cloneData || []
      if (cloneData && cloneData.length) {
        this.getChild(cloneData[0], true)
      }
    },
    async getDeviceList(item, isPlay) {
      let res = await Api.getDeviceList({ page: 1, rows: 100, monitorAreaId: item.id })
      let deviceList = res.data.records || []
      let tree = cloneDeep(this.list)
      treeForEach(tree, t => {
        if (item.id === t.id) {
          t.children = deviceList
        }
      })
      this.list = tree
      if (deviceList && deviceList.length && isPlay) {
        this.deviceClick(deviceList[0])
      }
    },
    async getChild(item, isPlay) {
      if (!item.children) {
        await this.getDeviceList(item, isPlay)
      }
      this.showChild(item.id)
    },
    showChild(id) {
      let openId = this.openId
      this.openId = openId.includes(id) ? openId.filter(o => o !== id) : [...openId, id]
    },
    async deviceClick(item) {
      this.clearTimer()
      this.currentId = item.id
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
    }
  }
}
</script>

<style scoped lang="less">
@import url('./index.less');
.container {
  margin-top: 10px;
}
.collapse-wrap {
  .section {
    margin-bottom: 20px;
    box-shadow: 0 0 10px #eee;
    border-radius: 20px;
    background: #fff;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 20px;
    font-size: 16px;
    font-weight: 500;
  }
  .list {
    padding: 0 20px;
    overflow: hidden;
    &.show {
      height: 0;
      //max-height: 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 10px;
      font-size: 14px;
      color: #3d3838;
      border-bottom: 1px solid #eeeaea;
      .radio {
        display: inline-block;
        vertical-align: 2px;
      }
      .img {
        width: 25px;
        height: 30px;
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
