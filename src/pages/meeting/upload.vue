<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <uni-form-item v-if="oldFile" label="会议记录">
            <view> <uni-attachment v-model="oldFile" /></view>
          </uni-form-item>
          <uni-form-item class="file-item" label="上传会议记录" prop="meetingFileId">
            <uni-attachment v-model="form.meetingFileId" :limit="1" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button type="primary" @click="handleSave">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  name: 'TaskDetail',
  components: {},
  data() {
    return {
      form: {},
      id: '',
      userId: uni.getStorageSync('userId') || '',
      oldFile: null,
      rules: {
        meetingFileId: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    this.id = options.id
    this.init()
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
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = await Api.detail(this.id)
      this.oldFile = res.data.meetingFileId
      this.form = {
        ...res.data,
        ...{
          meetingFileId: null
        }
      }
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      await Api.update({ ...this.form, ...{ hardAdd: true, recorderId: this.userId } })
      this.$utils.showToast('成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail');
.btn-wrapper {
  button + button {
    margin-top: 20px;
  }
}
.card-title {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx 10rpx 40rpx;
  .btn {
    color: #1890ff;
  }
}
</style>
