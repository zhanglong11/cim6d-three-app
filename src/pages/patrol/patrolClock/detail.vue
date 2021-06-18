<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <uni-form-item label="巡更点名称">
          <view class="placeholder">{{ detailInfo.patrolLocationName }}</view>
        </uni-form-item>
        <uni-form-item label="打卡地点">
          <view class="placeholder">{{ detailInfo.clockInPlace }}</view>
        </uni-form-item>
        <uni-form-item class="file-item" label="打卡拍照">
          <uni-attachment v-model="detailInfo.attachment"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="备注">
          <view class="placeholder">{{ detailInfo.remark }}</view>
        </uni-form-item>
        <uni-form-item label="打卡人">
          <view class="placeholder">{{ detailInfo.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="打卡时间">
          <view class="placeholder">{{ detailInfo.clockTime }}</view>
        </uni-form-item>
      </uni-card>
    </view>

    <!-- <view class="btn-wrapper">
      <button class="button" type="primary" @click="handleEdit">编辑</button>
    </view> -->
  </view>
</template>

<script>
import Api from './api/index'
export default {
  data() {
    return {
      detailInfo: {}
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    if (this.id) {
      this.init()
    }
  },
  methods: {
    // 详情
    init() {
      Api.getClockDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 编辑
    handleEdit() {
      this.$utils.toUrl(`/pages/patrol/patrolClock/add?id=${this.id}`)
    },
    onNavigationBarButtonTap(obj) {
      if (obj.key === 'menu') {
        this.showMenu()
      }
    },
    // 展示更多操作：编辑
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑'],
        success: res => {
          let index = res.tapIndex
          if (index === 0) {
            this.$utils.toUrl(`/pages/patrol/patrolClock/add?id=${this.id}`)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
.placeholder {
  color: @placeholderColor;
}
.quality-data-delete {
  margin-top: 20px;
}
</style>
