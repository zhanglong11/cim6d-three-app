<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
          <uni-card isForm>
            <uni-form-item label="任务内容">
              {{ taskContent }}
            </uni-form-item>
            <uni-form-item label="填报内容" prop="taskResult">
              <textarea v-model.trim="form.taskResult" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="备注" prop="remark">
              <textarea v-model.trim="form.remark" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item class="file-item" label="附件" prop="fileId">
              <uni-attachment v-model="form.fileId" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSave">保存</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from './api'
export default {
  components: {},
  data() {
    return {
      id: '',
      form: {},
      taskContent: '',
      rules: {
        taskResult: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    this.id = options.id
    this.refresh()
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
    //初始化页面参数
    async refresh() {
      let res = await Api.detail(this.id)
      this.taskContent = res.data?.taskContent || ''
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form)
      await Api.result({ ...cloneData, ...{ id: this.id } })
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.mt20 + .mt20 {
  margin-top: 50rpx;
}
.btn-wrapper {
  display: flex;
  .button {
    flex: 1;
    margin: 0 20rpx;
  }
}
</style>
