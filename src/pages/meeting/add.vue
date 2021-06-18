<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
          <uni-card isForm>
            <uni-form-item label="会议主题" prop="meetingSubject">
              <textarea v-model.trim="form.meetingSubject" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="会议类型" prop="meetingType">
              <uni-select v-model="form.meetingType" :options="meetingType" />
            </uni-form-item>
            <uni-form-item label="发起人" isLink prop="initiator">
              <uni-select-user v-model="form.initiator" />
            </uni-form-item>
            <uni-form-item label="会议地点" prop="meetingAddress">
              <textarea v-model.trim="form.meetingAddress" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="会议开始时间" prop="startTime" isLink>
              <uni-date-picker
                v-model="form.startTime"
                placeholder="点击选择"
                fields="second"
                mode="date"
                @change="changeStartTime"
              />
            </uni-form-item>
            <uni-form-item label="会议结束时间" prop="endTime" isLink>
              <uni-date-picker
                v-model="form.endTime"
                placeholder="点击选择"
                fields="second"
                mode="date"
                @change="changeEndTime"
              />
            </uni-form-item>
            <uni-form-item label="参与人" isLink prop="participant">
              <uni-select-user v-model="form.participant" multiple />
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSave(false)">保存</button>
        </view>
      </view>
    </scroll-view>
    <uni-popup ref="popup" type="center">
      <uni-popup-custom title="会议重叠" cancelBtnText="重复，取消" okBtnText="不重复，继续" @confirm="repeatSubmit">
        <view class="pop-content">
          <p>
            <span class="label">会议主题:</span><span class="val">{{ repeatForm.meetingSubject }}</span>
          </p>
          <p>
            <span class="label">会议类型:</span
            ><span class="val">{{ $getLabelFromArg('workMeetingType', repeatForm.meetingType) }}</span>
          </p>
          <p>
            <span class="label">发起人:</span><span class="val">{{ repeatForm.initiatorName }}</span>
          </p>
          <p>
            <span class="label">参与人:</span
            ><span class="val">{{ repeatForm.participantName && repeatForm.participantName.join(',') }}</span>
          </p>
          <p>
            <span class="label">开始时间:</span><span class="val">{{ repeatForm.startTime }}</span>
          </p>
          <p>
            <span class="label">结束时间:</span><span class="val">{{ repeatForm.endTime }}</span>
          </p>
          <p>
            <span class="label">会议地址:</span><span class="val">{{ repeatForm.meetingAddress }}</span>
          </p>
          <p>
            <span class="label">创建人:</span><span class="val">{{ repeatForm.creatorName }}</span>
          </p>
        </view>
      </uni-popup-custom>
    </uni-popup>
  </view>
</template>

<script>
import Api from './api'
import moment from 'moment'
import utils from '@/utils/utils'
export default {
  data() {
    return {
      id: '',
      form: {},
      rules: {
        meetingSubject: { required: true },
        meetingType: { required: true },
        initiator: { required: true },
        meetingAddress: { required: true },
        startTime: { required: true },
        endTime: { required: true },
        participant: { required: true }
      },
      repeatData: [],
      activeKey: 0,
      repeatForm: {},
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.refresh()
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
  computed: {
    meetingType() {
      return this.$getArgList('workMeetingType') || []
    }
  },
  methods: {
    //获取详情
    async refresh() {
      let res = await Api.detail(this.id)
      let cloneData = _.cloneDeep(res.data)
      this.form = cloneData
    },
    // 点击保存按钮
    async handleSave(isHard = false) {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form)
      let param = isHard ? { ...cloneData, ...{ hardAdd: true } } : cloneData
      let res = this.id ? await Api.update(param) : await Api.add(param)
      if (!isHard && res.data && res.data.length) {
        this.repeatData = res.data
        this.activeKey = 0
        this.repeatForm = res.data[0]
        this.showRepeatDialog()
        return
      }
      this.$utils.showToast('成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    },
    //判断会议开始时间
    changeStartTime(e) {
      if (e && this.form.endTime && moment(this.form.endTime).isBefore(e)) {
        utils.showToast('开始时间不能大于结束时间')
        this.form = {
          ...this.form,
          ...{
            startTime: null
          }
        }
      }
    },
    //判断会议结束时间
    changeEndTime(e) {
      if (e && this.form.startTime && moment(e).isBefore(this.form.startTime)) {
        utils.showToast('开始时间不能大于结束时间')
        this.form = {
          ...this.form,
          ...{
            endTime: null
          }
        }
      }
    },
    //打开重复弹框
    showRepeatDialog() {
      this.$refs.popup.open()
    },
    //不重复，继续创建
    repeatSubmit() {
      if (this.repeatData.length !== this.activeKey + 1) {
        this.activeKey += 1
        this.repeatForm = this.repeatData[this.activeKey]
        return
      }
      this.handleSave(true)
      this.$refs.popup.close()
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
.pop-content {
  width: 100%;
  padding: 20px;
  p {
    display: flex;
    + p {
      margin-top: 10px;
    }
    .label {
      flex: 0 0 180px;
      color: #666;
    }
    .val {
      color: #5f5f5f;
    }
  }
}
</style>
