<template>
  <view class="main">
    <view class="titleText">录入验收结果</view>
    <uni-form-custom ref="form" :model="form" :rules="rules" class="form-card">
      <uni-form-item label="验收结果" isRequired prop="acceptanceResult">
        <uni-select v-model="form.acceptanceResult" :options="resultStatusList" />
      </uni-form-item>
      <uni-form-item v-if="form.acceptanceResult === 0" label="不通过原因" isRequired prop="rejectReason">
        <textarea v-model.trim="form.rejectReason" auto-height placeholder="请输入批注内容" />
      </uni-form-item>
      <uni-form-item v-if="form.acceptanceResult === 0" label="附件">
        <uni-attachment v-model="form.fileId" edit></uni-attachment>
      </uni-form-item>
      <view class="btn-wrapper">
        <view class="btn-item">
          <button class="button" @click="handleCancel">取消</button>
        </view>
        <view class="btn-item">
          <button class="button" type="primary" :loading="btnLoading" :disabled="btnLoading" @click="handleEnter">
            确定
          </button>
        </view>
      </view>
    </uni-form-custom>
  </view>
</template>

<script>
import Api from './api'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      rules: {
        acceptanceResult: [{ required: true, message: '请选择验收结果' }],
        rejectReason: [{ required: true, message: '请输入不通过原因' }]
      },
      resultStatusList: [
        { value: 1, label: '通过' },
        { value: 0, label: '不通过' }
      ],
      btnLoading: false
    }
  },
  mounted() {
    // console.log(this.id)
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('closeAcceptInput', false)
    },
    // 确定
    async handleEnter() {
      await this.$refs.form.validate()
      this.btnLoading = true
      Api.addAcceptanceResult({ id: this.id, ...this.form }).then(
        res => {
          this.btnLoading = false
          this.$utils.showToast('操作成功')
          this.$emit('closeAcceptInput', true)
        },
        err => {
          this.btnLoading = false
        }
      )
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

.titleText {
  font-weight: bold;
  color: #666666;
  border-bottom: solid 1px #e5e5e5;
  padding: 0px 0px 30px 30px
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
