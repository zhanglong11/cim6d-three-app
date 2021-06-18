<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <uni-form-item label="规范名称">
          <view class="placeholder">{{ detailInfo.specificationName }}</view>
        </uni-form-item>
        <uni-form-item label="规范编号">
          <view class="placeholder">{{ detailInfo.specificationNumber }}</view>
        </uni-form-item>
        <uni-form-item label="类别">
          <view class="placeholder">{{ $getLabel(norm, detailInfo.category) }}</view>
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
          <uni-attachment v-model="detailInfo.contentFileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </view>

    <view class="btn-wrapper">
      <button v-if="$hasPower('AppQualityDataUpdate')" class="button" type="primary" @click="handleEdit">编辑</button>
      <button
        v-if="$hasPower('AppQualityDataDelete')"
        class="button quality-data-delete"
        type="primary"
        @click="handleDelete"
      >
        删除
      </button>
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
    // 获取验收规范详情
    init() {
      Api.getCheckSpecificDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 编辑
    handleEdit() {
      this.$utils.toUrl(`/pages/decoration/decorationData/qualityData/add?id=${this.id}`)
    },
    // 删除
    handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除该数据吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中' })
            Api.deleteCheckSpecific(this.id).then(res => {
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
@import url('add.less');
.placeholder {
  color: @placeholderColor;
}
.quality-data-delete {
  margin-top: 20px;
}
</style>
