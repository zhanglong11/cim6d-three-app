<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <div class="card">
        <div>
          <h2>监理日志</h2>
          <view class="read-status">
            <uni-status :options="readStatus" :value="info.status"></uni-status>
          </view>
        </div>
      </div>
      <div class="card base-info">
        <h3 class="base-info-title">基本信息</h3>
        <ul>
          <li>
            <span class="label">日期</span><span class="value">{{ info.reportDate | formatData }}</span>
          </li>
          <li>
            <span class="label">填写人</span><span class="value">{{ info.creatorName }}</span>
          </li>
          <li>
            <span class="label">日志编号</span><span class="value">{{ info.code }}</span>
          </li>
          <li>
            <span class="label">单位工程名称</span><span class="value">{{ info.unitProjectName }}</span>
          </li>
        </ul>
      </div>
      <div class="card weather">
        <h3 class="weather-title">天气</h3>
        <ul>
          <li>
            <span class="label">今日天气</span><span class="value">{{ info.weather }}</span>
          </li>
          <li>
            <span class="label">上午温度(℃)</span
            ><span class="value">{{ info.morningTemperature && info.morningTemperature + '°C' }}</span>
          </li>
          <li>
            <span class="label">下午温度（°C）</span
            ><span class="value">{{ info.afternoonTemperature && info.afternoonTemperature + '°C' }}</span>
          </li>
        </ul>
      </div>
      <div class="card progress">
        <h3 class="progress-title">进度</h3>
        <ul>
          <li>
            <h6>施工进展情况：</h6>
            <div class="value">
              {{ info.constructionProgress }}
            </div>
          </li>
          <li>
            <h6>监理工作情况：</h6>
            <div class="value">{{ info.supervisionWork }}</div>
          </li>
          <li>
            <h6>存在问题及处理情况：</h6>
            <div class="value">{{ info.problemAndHandling }}</div>
          </li>
          <li>
            <h6>其他事项：</h6>
            <div class="value">{{ info.remark }}</div>
          </li>
          <li style="align-items: start; display: flex">
            <span class="label" style="width: 100px">监理日志附件：</span
            ><span class="value"> <uni-attachment v-model="info.fileIds"></uni-attachment></span>
          </li>
        </ul>
      </div>
      <div v-if="info.status === 1" class="card">
        <ul>
          <li>
            <span class="label">签阅意见：</span><span class="value">{{ info.signComments }}</span>
          </li>
          <li>
            <span class="label">签阅人：</span><span class="value">{{ info.signerName }}</span>
          </li>
          <li style="align-items: start; display: flex">
            <span class="label" style="width: 100px">签阅附件：</span
            ><span class="value"> <uni-attachment v-model="info.signFileIds"></uni-attachment></span>
          </li>
        </ul>
      </div>
      <div v-if="info.signer === $store.state.user.userId && info.status === 0" class="card">
        <uni-form-custom ref="form" :rules="rules" :model="form">
          <view class="card-header" style="font-size: 14px">签阅</view>
          <view>
            <uni-form-item label="签阅意见：" type="textarea" prop="signComments" align="left" class="block-item">
              <textarea v-model.trim="form.signComments" :maxlength="200" placeholder="请输入" auto-height />
            </uni-form-item>
            <uni-form-item class="file-item" label="签阅附件">
              <uni-attachment v-model="form.signFileIds" edit></uni-attachment>
            </uni-form-item>
          </view>
        </uni-form-custom>
      </div>
      <view class="btn-wrapper">
        <button
          v-if="info.signer === $store.state.user.userId && info.status === 0"
          class="button"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          提交
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import readStatus from './lib/readStatus'
import api from '../api'
export default {
  data() {
    return {
      id: null,
      info: {},
      readStatus,
      form: {},
      rules: {
        signComments: [{ required: true, message: '请填写总监理工程师签阅意见' }]
      },
      loading: false
    }
  },
  onLoad(option) {
    this.id = option.id
  },
  onShow() {
    this.handleQueryLogInfo()
  },
  methods: {
    async handleQueryLogInfo() {
      let result = await api.getLogInfo(this.id)
      if (result.code === 200) {
        this.info = result.data || {}
      }
    },
    //签阅文件提交
    async handleSubmit() {
      try {
        this.loading = true
        await this.$refs.form.validate()
        await api.getLogSign({ ...this.form, id: this.id }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.$utils.showToast('签阅成功')
            this.$utils.goBack()
          } else {
            this.$utils.showToast('签阅失败')
          }
        })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">
@import url('./detail.less');
.card-header {
  font-weight: bolder;
  font-size: 16px;
}
</style>
