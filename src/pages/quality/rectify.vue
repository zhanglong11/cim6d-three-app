<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="整改方法" prop="rectifyContent">
            <textarea v-model.trim="form.rectifyContent" :maxlength="-1" placeholder="请输入整改方法" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片" prop="rectifyFileId">
            <uni-attachment v-model="form.rectifyFileId" uploadType="image" edit></uni-attachment>
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
import Api from '@/pages/quality/api'
export default {
  name: 'QualityIssueRectify',
  data() {
    return {
      id: null,
      rectifyPrincipal: '',
      isLoading: false,
      form: {
        rectifyContent: '',
        rectifyFileId: ''
      },
      rules: {
        rectifyContent: { required: true },
        rectifyFileId: { required: true }
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
    this.rectifyPrincipal = options.rectifyPrincipal
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
        rectifyPrincipal: this.rectifyPrincipal
      }
      this.isLoading = true
      await Api.handleRectify(params).finally(() => (this.isLoading = false))
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
@import url('./add.less');
</style>
