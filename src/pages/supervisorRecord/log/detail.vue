<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <div class="card summary">
        <div>
          <h2>{{ info.name }}</h2>
          <view class="read-status">
            <uni-status :options="readStatus" :value="info.status"></uni-status>
          </view>
          <ul>
            <li>
              <h6>编制日期</h6>
              <p>{{ info.reportDate | formatData }}</p>
            </li>
            <li>
              <h6>日志填写人</h6>
              <p>{{ info.recordUserName || info.creatorName }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="card base-info">
        <h3 class="base-info-title">基本信息</h3>
        <ul>
          <li>
            <span class="label">日志编号</span><span class="value">{{ info.code }}</span>
          </li>
          <li>
            <span class="label">单位工程名称</span><span class="value">{{ info.engineeringName }}</span>
          </li>
        </ul>
      </div>
      <div class="card weather">
        <h3 class="weather-title">天气</h3>
        <ul>
          <li>
            <span class="label">今天天气</span><span class="value">{{ info.weather }}</span>
          </li>
          <li>
            <span class="label">最低温度(℃)</span
            ><span class="value">{{ info.minimumTemperature && info.minimumTemperature + '°C' }}</span>
          </li>
          <li>
            <span class="label">最高温度（°C）</span
            ><span class="value">{{ info.maximumTemperature && info.maximumTemperature + '°C' }}</span>
          </li>
        </ul>
      </div>
      <div class="card progress">
        <h3 class="progress-title">进度</h3>
        <ul>
          <li>
            <h6>施工进展情况</h6>
            <div class="value">
              {{ info.constructionProgressSituation }}
            </div>
          </li>
          <li>
            <h6>监理工作情况</h6>
            <div class="value">{{ info.supervisorWorkSituation }}</div>
          </li>
          <li>
            <h6>存在问题及处理情况</h6>
            <div class="value">{{ info.issueHandleSituation }}</div>
          </li>
          <li>
            <h6>其他事项</h6>
            <div class="value">{{ info.otherItems }}</div>
          </li>
        </ul>
      </div>
      <div class="card attachment">
        <ul>
          <li>
            <span class="label">签阅人</span><span class="value">{{ info.signPersonName }}</span>
          </li>
          <!--          <li>-->
          <!--            <span class="label" style="width: 100px">备注</span><span class="value">{{ info.remark }}</span>-->
          <!--          </li>-->
          <li style="align-items: start; display: flex">
            <span class="label" style="width: 100px">附件</span
            ><span class="value"> <uni-attachment v-model="info.fileIds"></uni-attachment></span>
          </li>
        </ul>
      </div>
      <div v-if="info.status === 1" class="card">
        <ul>
          <li>
            <span class="label">总监理工程师签阅意见</span><span class="value">{{ info.signOpinion }}</span>
          </li>
          <li style="align-items: start; display: flex">
            <span class="label" style="width: 100px">签阅附件</span
            ><span class="value"> <uni-attachment v-model="info.signFileIds"></uni-attachment></span>
          </li>
          <li>
            <span class="label">签阅时间</span><span class="value">{{ info.signTime }}</span>
          </li>
        </ul>
      </div>
      <div v-if="info.signPersonId === $store.state.user.userId && info.status === 0" class="card">
        <uni-form-custom ref="form" :rules="rules" :model="form">
          <view class="card-header">签阅信息</view>
          <view>
            <uni-form-item
              label="总监理工程师签阅意见"
              type="textarea"
              prop="signOpinion"
              align="left"
              class="block-item"
            >
              <textarea v-model.trim="form.signOpinion" :maxlength="200" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item class="file-item" label="签阅附件">
              <uni-attachment v-model="form.signFileIds" edit></uni-attachment>
            </uni-form-item>
          </view>
        </uni-form-custom>
      </div>
      <view class="btn-wrapper">
        <button
          v-if="info.signPersonId === $store.state.user.userId && info.status === 0"
          class="button"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          签阅
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import readStatus from './lib/readStatus'
import api from '@/api/supervisorRecord'
export default {
  data() {
    return {
      id: null,
      info: {},
      readStatus,
      form: {},
      rules: {
        signOpinion: [{ required: true, message: '请填写总监理工程师签阅意见' }]
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
