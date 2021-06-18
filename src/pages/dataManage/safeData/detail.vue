<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <uni-form-item label="资料名称">
          <view class="placeholder">{{ detailInfo.regimeName }}</view>
        </uni-form-item>
        <uni-form-item label="资料编号">
          <view class="placeholder">{{ detailInfo.regimeNumber }}</view>
        </uni-form-item>
        <uni-form-item label="资料内容">
          <view class="placeholder">{{ detailInfo.regimeContent }}</view>
        </uni-form-item>
        <uni-form-item label="创建人">
          <view class="placeholder">{{ detailInfo.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <view class="placeholder">{{ detailInfo.createTime }}</view>
        </uni-form-item>
        <uni-form-item label="备注信息">
          <view class="placeholder">{{ detailInfo.remark }}</view>
        </uni-form-item>
        <uni-form-item class="file-item" label="附件">
          <uni-attachment v-model="detailInfo.files"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </view>

    <view class="btn-wrapper">
      <button class="button" type="primary" @click="handleEdit">编辑</button>
      <button class="button safe-data-delete" type="primary" @click="handleDelete">删除</button>
    </view>
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
    // 获取安全管理制度详情
    init() {
      Api.getManageRegimeDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 编辑
    handleEdit() {
      this.$utils.toUrl(`/pages/dataManage/safeData/add?id=${this.id}`)
    },
    // 删除
    handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除该数据吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中' })
            Api.deleteManageRegime(this.id).then(res => {
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
.safe-data-delete {
  margin-top: 20px;
}
</style>
