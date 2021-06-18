<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="复查结果" isLink prop="reviewResult">
            <uni-select v-model="form.reviewResult" :options="reviewOptionList"></uni-select>
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片" prop="reviewFileId">
            <uni-attachment v-model="form.reviewFileId" uploadType="image" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item v-if="form.reviewResult === 0" label="复查意见" prop="reviewOpinion">
            <textarea v-model.trim="form.reviewOpinion" :maxlength="-1" placeholder="请输入复查意见" auto-height />
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleSubmit">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Api from '@/pages/safety/api'
export default {
  name: 'SafetyIssueReview',
  data() {
    return {
      id: null,
      rectifyReviewId: '',
      isLoading: false,
      reviewOptionList: [
        { label: '不合格', value: 0 },
        { label: '合格', value: 1 }
      ],
      form: {
        reviewResult: '',
        reviewFileId: '',
        reviewOpinion: ''
      },
      rules: {
        reviewResult: { required: true },
        reviewFileId: { required: true },
        reviewOpinion: { required: true }
      },
      uUid: this.$utils.getUuid() || '', // 接收选择的构件或其他服务使用
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id
    this.rectifyReviewId = options.rectifyReviewId
  },
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        inspectRecordId: this.id,
        id: this.rectifyReviewId
      }
      this.isLoading = true
      await Api.handleReview(params).finally(() => (this.isLoading = false))
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/add.less');
</style>
