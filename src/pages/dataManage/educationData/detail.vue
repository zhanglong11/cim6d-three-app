<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <uni-form-item label="视频名称">
          <view class="placeholder">{{ detailInfo.videoName }}</view>
        </uni-form-item>
        <uni-form-item label="是否默认">
          <view class="placeholder">{{ detailInfo.defaultFlag === true ? '是' : '否' }}</view>
        </uni-form-item>
        <uni-form-item class="file-item" label="视频上传">
          <uni-attachment v-model="detailInfo.attachment"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="创建人">
          <view class="placeholder">{{ detailInfo.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <view class="placeholder">{{ detailInfo.createTime }}</view>
        </uni-form-item>
      </uni-card>
    </view>

    <view class="btn-wrapper">
      <button class="button" type="primary" @click="handleEdit">编辑</button>
      <button class="button quality-data-delete" type="primary" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
import Api from './api/index'
import norm from './lib/norm'
export default {
  data() {
    return {
      norm,
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
      Api.getEducationDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 编辑
    handleEdit() {
      this.$utils.toUrl(`/pages/dataManage/educationData/add?id=${this.id}`)
    },
    // 删除
    handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除该数据吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中' })
            Api.getEducationDelete(this.id).then(res => {
              uni.hideLoading()
              this.$utils.goBack()
            })
          } else if (res.cancel) {
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
