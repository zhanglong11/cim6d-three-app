<template>
  <view class="main">
    <uni-form-custom ref="form" :model="comment" :rules="rules" class="form-card">
      <uni-form-item label="批注内容" isRequired prop="content">
        <textarea v-model.trim="comment.content" auto-height placeholder="请输入批注内容" />
      </uni-form-item>
      <uni-form-item label="附件">
        <uni-attachment v-model="comment.fileId" :limit="1" edit></uni-attachment>
      </uni-form-item>
    </uni-form-custom>

    <view class="btn-wrapper">
      <view class="btn-item">
        <button class="button" @click="handleCancel">取消</button>
      </view>
      <view class="btn-item">
        <button class="button" type="primary" @click="handleEnter">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        content: [{required: true, message: '请输入批注内容'}]
      }
    }
  },
  methods: {
    // 确定
    async handleEnter() {
      await this.$refs.form.validate()
      this.$emit('closeCommentModal', this.comment)
    },
    // 取消
    handleCancel() {
      this.$emit('closeCommentModal', null)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  border-radius: 0;
  height: 100vh;
  background: #ffffff;
}

.btn-wrapper {
  position: absolute;
  bottom: 0px;
  display: flex;
  .btn-item {
    flex: 0 0 50%;
  }
  .btn-item:nth-child(1) {
    padding-left: 20px;
    padding-right: 10px;
  }
  .btn-item:nth-child(2) {
    padding-left: 10px;
    padding-right: 20px;
  }
}
</style>
