<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view>
          <view class="card">
            <uni-form-item label="会议主题">
              <view>{{ info.meetingSubject }}</view>
            </uni-form-item>
            <uni-form-item label="发起人">
              <view>{{ info.initiatorName }}</view>
            </uni-form-item>
            <uni-form-item label="会议地点">
              <view>{{ info.meetingAddress }}</view>
            </uni-form-item>
            <uni-form-item label="会议开始时间">
              <view>{{ info.startTime }}</view>
            </uni-form-item>
            <uni-form-item label="会议结束时间">
              <view>{{ info.endTime }}</view>
            </uni-form-item>
            <uni-form-item label="会议类型">
              <view>{{ $getLabelFromArg('workMeetingType', info.meetingType) }}</view>
            </uni-form-item>
            <uni-form-item label="参与人">
              <view>{{ info.participantName && info.participantName.join(',') }}</view>
            </uni-form-item>
            <uni-form-item label="创建人">
              <view>{{ info.creatorName }}</view>
            </uni-form-item>
            <uni-form-item label="创建时间">
              <view>{{ info.createTime }}</view>
            </uni-form-item>
            <uni-form-item label="会议状态">
              <view>{{ $getLabel(statusList, info.status) }}</view>
            </uni-form-item>
            <template v-if="info.meetingFileId">
              <uni-form-item label="记录上传人">
                <view>{{ info.recorderName }}</view>
              </uni-form-item>
              <uni-form-item label="会议记录">
                <view><uni-attachment v-model="info.meetingFileId" /></view>
              </uni-form-item>
            </template>
          </view>
        </view>
        <view class="btn-wrapper">
          <template v-if="info.status === 0 && info.creator === userId">
            <button type="primary" @click="toEdit">编辑</button>
            <button type="primary" @click="cancelTask(id)">取消会议</button>
          </template>
          <template v-if="info.status === 2">
            <button v-if="info.meetingFileId && info.recorderId === userId" type="primary" @click="toFile">
              替换会议记录
            </button>
            <button v-if="!info.meetingFileId" type="primary" @click="toFile">上传会议记录</button>
          </template>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from './api'
import statusList from './lib/statusList'
export default {
  name: 'TaskDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      userId: uni.getStorageSync('userId') || '',
      statusList
    }
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {
    this.init()
  },
  methods: {
    //初始化页面参数
    async init() {
      let res = await Api.detail(this.id)
      this.info = res.data
    },
    //跳转编辑
    toEdit() {
      this.$utils.toUrl(`/pages/meeting/add?id=${this.id}`)
    },
    //上传会议记录
    toFile() {
      this.$utils.toUrl(`/pages/meeting/upload?id=${this.id}`)
    },
    //取消
    cancelTask(id) {
      uni.showModal({
        title: '提示',
        content: '确定取消当前会议吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '取消中' })
            Api.remove([id]).then(res => {
              uni.hideLoading()
              this.$utils.goBack()
            })
          }
        }
      })
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
