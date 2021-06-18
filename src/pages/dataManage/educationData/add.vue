<template>
  <view class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="视频名称" prop="videoName" isRequired>
          <textarea v-model.trim="form.videoName" auto-height placeholder="请输入视频名称" />
        </uni-form-item>
        <uni-form-item label="是否默认：" prop="defaultFlag" isRequired>
          <uni-select v-model="form.defaultFlag" :options="norm"></uni-select>
        </uni-form-item>
        <uni-form-item class="file-item" label="视频上传：" prop="attachment">
          <uni-attachment v-model="form.attachment" uploadType="video" edit :limit="1"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </uni-form-custom>

    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleSave()">保存</button>
    </view>
  </view>
</template>

<script>
import Api from './api'
import norm from './lib/norm'
export default {
  data() {
    return {
      norm,
      form: {},
      id: '',
      rules: {
        videoName: { required: true },
        defaultFlag: { required: true },
        attachment: { required: true }
      },
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    let id = options.id
    if (!id) return
    this.init(options.id)
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
  methods: {
    // 编辑时，获取资料详情
    init(id) {
      this.id = id
    },
    onShow() {
      if (this.id) {
        this.getCheckSpecificDetail()
        this.$utils.setTitle('编辑安全教育视频')
      }
    },
    getCheckSpecificDetail() {
      Api.getEducationDetail(this.id).then(res => {
        this.form = res.data
      })
    },

    // 保存
    async handleSave() {
      await this.$refs.form.validate()
      this.isLoading = true
      let projectId = this.$store.state.project.projectId

      if (this.id) {
        Api.getEducationUpdate({
          ...this.form,
          projectId
        }).then(
          res => {
            this.$utils.showToast('保存成功')
            this.isSave = true
            setTimeout(() => {
              this.isLoading = false
              this.$utils.goBack(2)
            }, 1000)
          },
          err => {
            this.isLoading = false
          }
        )
      } else {
        Api.getEducationAdd({
          ...this.form,
          projectId
        }).then(
          res => {
            this.$utils.showToast('保存成功')
            this.isSave = true
            setTimeout(() => {
              this.isLoading = false
              this.$utils.goBack()
            }, 1000)
          },
          err => {
            this.isLoading = false
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
</style>
