<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <uni-form-item label="消息标题" prop="title">
            <textarea v-model.trim="form.title" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="内容" prop="content">
            <textarea v-model.trim="form.content" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="接收人" isLink prop="receiverIds">
            <uni-select-user v-model="form.receiverIds" multiple />
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
      rules: {
        title: { required: true },
        content: { required: true },
        receiverIds: { required: true }
      },
      isSave: false // 是否保存
    }
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
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form)
      cloneData.receiverIds = cloneData.receiverIds.split(',')
      await Api.add(cloneData)
      this.isSave = true
      this.$utils.showToast('成功')
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
