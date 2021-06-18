<template>
  <view class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="监理实施细则名称" prop="name" isRequired>
          <textarea v-model.trim="form.name" auto-height placeholder="请输入监理实施细则名称" />
        </uni-form-item>
        <uni-form-item label="适用范围" prop="applyRange" isRequired>
          <textarea v-model.trim="form.applyRange" auto-height placeholder="请输入适用范围" />
        </uni-form-item>
        <uni-form-item label="编制人" prop="writer" isRequired>
          <textarea v-model.trim="form.writer" auto-height placeholder="请输入编制人" />
        </uni-form-item>
        <uni-form-item label="编制日期" prop="writerDateStr" isRequired>
          <uni-date-picker v-model="form.writerDateStr" fields="day" mode="date"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="监理实施细则备注" prop="remark">
          <textarea v-model.trim="form.remark" auto-height placeholder="请输入监理实施细则备注" />
        </uni-form-item>
        <uni-form-item class="file-item" label="附件" prop="fileIds">
          <uni-attachment v-model="form.fileIds" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
    </uni-form-custom>

    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="btnSaveLoading" :disabled="btnSaveDisabled" @click="handleSave()">
        保存
      </button>
      <!--<button
        class="button rule-save-submit"
        type="primary"
        :loading="btnSaveSubmitLoading"
        :disabled="btnSaveSubmitDisabled"
        @click="handleSaveSubmit()"
      >
        保存并提交
      </button>-->
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      btnSaveLoading: false,
      btnSaveSubmitLoading: false,
      btnSaveDisabled: false,
      btnSaveSubmitDisabled: false,
      form: {},
      rules: {
        name: { required: true },
        applyRange: { required: true },
        writer: { required: true },
        writerDateStr: { required: true }
        // fileIds: { required: true }
      },
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
    // 编辑时，获取监理规划登记详情
    init(id) {
      this.form.id = id
    },
    onShow() {
      if (this.form.id) {
        this.getImplementRulesDetail()
        this.$utils.setTitle('编辑监理实施细则')
      }
    },
    getImplementRulesDetail() {
      Api.getImplementRulesDetail(this.form.id).then(res => {
        this.form = res.data
      })
    },
    // 保存
    async handleSave() {
      await this.$refs.form.validate()
      this.btnSaveLoading = true
      this.btnSaveSubmitDisabled = true
      let projectId = this.$store.state.project.projectId
      Api.saveImplementRules({
        ...this.form,
        projectId
      }).then(
        res => {
          this.$utils.showToast('操作成功')
          this.isSave = true
          setTimeout(() => {
            this.btnSaveLoading = false
            this.btnSaveSubmitDisabled = false
            let delta = this.form.id ? 2 : 1
            this.$utils.goBack(delta)
          }, 1000)
        },
        err => {
          this.btnSaveLoading = false
          this.btnSaveSubmitDisabled = false
        }
      )
    },
    // 保存并提交
    async handleSaveSubmit() {
      await this.$refs.form.validate()
      this.btnSaveSubmitLoading = true
      this.btnSaveDisabled = true
      let projectId = this.$store.state.project.projectId
      Api.saveAndSubmitImplementRules({
        ...this.form,
        projectId
      }).then(
        res => {
          this.$utils.showToast('操作成功')
          this.isSave = true
          setTimeout(() => {
            this.btnSaveSubmitLoading = false
            this.btnSaveDisabled = false
            let delta = this.form.id ? 2 : 1
            this.$utils.goBack(delta)
          }, 1000)
        },
        err => {
          this.btnSaveSubmitLoading = false
          this.btnSaveDisabled = false
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
.rule-save-submit {
  margin-top: 20px;
}
</style>
