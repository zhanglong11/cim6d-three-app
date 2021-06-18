<template>
  <view class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="资料名称" prop="regimeName" isRequired>
          <textarea v-model.trim="form.regimeName" auto-height placeholder="请输入资料名称" />
        </uni-form-item>
        <uni-form-item label="资料内容" prop="regimeContent" isRequired>
          <textarea v-model.trim="form.regimeContent" auto-height placeholder="请输入资料内容" />
        </uni-form-item>
        <uni-form-item label="资料备注" prop="remark">
          <textarea v-model.trim="form.remark" auto-height placeholder="请输入资料备注" />
        </uni-form-item>
        <uni-form-item class="file-item" label="附件">
          <uni-attachment v-model="form.files" edit></uni-attachment>
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
export default {
  data() {
    return {
      form: {},
      rules: {
        regimeName: { required: true },
        regimeContent: { required: true }
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
      this.form.id = id
    },
    onShow() {
      if (this.form.id) {
        this.getManageRegimeDetail()
        this.$utils.setTitle('编辑安全资料')
      }
    },
    getManageRegimeDetail() {
      Api.getManageRegimeDetail(this.form.id).then(res => {
        this.form = res.data
      })
    },
    // 保存
    async handleSave() {
      await this.$refs.form.validate()
      this.isLoading = true
      let projectId = this.$store.state.project.projectId
      if (this.form.id) {
        Api.updateManageRegime({
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
        Api.addManageRegime({
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
