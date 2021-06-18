<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :rules="rules" :model="form">
        <uni-card isForm>
          <uni-form-item label="日志编号" :border="false">
            <textarea v-model.trim="form.name" auto-height placeholder="自动生成" disabled />
          </uni-form-item>
          <uni-form-item label="单位工程名称" prop="engineeringName">
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="编制日期" prop="reportDate" isLink>
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="日志填写人" prop="creatorName">
            <textarea v-model.trim="form.creatorName" auto-height disabled />
            <!--          <uni-select-user v-model="form.creator" :name.sync="form.creatorName" />-->
          </uni-form-item>
        </uni-card>

        <!-- 今日天气信息 -->
        <view>
          <view class="card-header">天气</view>
          <uni-card isForm>
            <uni-form-item label="今日天气" prop="weather">
              <input v-model.trim="form.weather" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="最低温度(℃)" prop="minimumTemperature">
              <input v-model.number="form.minimumTemperature" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="最高温度(℃)" prop="maximumTemperature">
              <input v-model.number="form.maximumTemperature" placeholder="请输入" />
            </uni-form-item>
            <!--          <uni-form-item label="上午温度(℃)">-->
            <!--            <input v-model.number="form.morningWeather" placeholder="请输入温度" />-->
            <!--          </uni-form-item>-->
            <!--          <uni-form-item label="午间温度(℃)">-->
            <!--            <input v-model.number="form.noonWeather" placeholder="请输入温度" />-->
            <!--          </uni-form-item>-->
            <!--          <uni-form-item label="下午温度(℃)">-->
            <!--            <input v-model.number="form.afternoonWeather" placeholder="请输入温度" />-->
            <!--          </uni-form-item>-->
          </uni-card>
        </view>
        <!-- 进度状况 -->
        <view>
          <view class="card-header">进度</view>
          <uni-card isForm>
            <uni-form-item label="施工进展情况" :border="false" align="left" class="block-item">
              <textarea
                v-model.trim="form.constructionProgressSituation"
                :maxlength="-1"
                placeholder="请填写内容"
                auto-height
              />
            </uni-form-item>
            <uni-form-item label="监理工作情况" align="left" class="block-item">
              <textarea
                v-model.trim="form.supervisorWorkSituation"
                :maxlength="-1"
                placeholder="请填写内容"
                auto-height
              />
            </uni-form-item>
            <uni-form-item label="存在问题及处理情况" align="left" class="block-item">
              <textarea v-model.trim="form.issueHandleSituation" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="其他事项" align="left" class="block-item">
              <textarea v-model.trim="form.otherItems" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 附件上传 -->
        <view>
          <view class="card-header">附件</view>
          <uni-card isForm>
            <uni-form-item label="签阅人" prop="signPersonId" isLink>
              <uni-select-user v-model="form.signPersonId" :name.sync="form.signPersonName" />
            </uni-form-item>
            <!--          <uni-form-item label="备注" type="textarea" align="left" class="block-item">-->
            <!--            <textarea v-model.trim="form.remark" :maxlength="200" placeholder="请输入备注信息" auto-height />-->
            <!--          </uni-form-item>-->
            <uni-form-item class="file-item" label="监理日志附件">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </view>
      </uni-form-custom>
    </view>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleLogSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import api from '@/api/supervisorRecord'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {
        creator: uni.getStorageSync('userId'),
        creatorName: uni.getStorageSync('userName')
      },
      rules: {
        engineeringName: [{ required: true, message: '单位工程名称必填' }],
        weather: [{ required: true, message: '天气必填' }],
        minimumTemperature: [{ required: true, message: '最低温度必填' }],
        creatorName: [{ required: true, message: '日志填写人必填' }],
        reportDate: [{ required: true, message: '编制日期必选' }],
        maximumTemperature: [{ required: true, message: '最高温度必填' }],
        signPersonId: [{ required: true, message: '签阅人必选' }]
      },
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName', 'userId']),
    // 天气信息
    weatherInfo() {
      return this.$store.state.project.weatherInfo
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
  mounted() {
    this.form.projectId = this.projectId
    // this.init()
  },
  methods: {
    // 初始化
    // init() {
    //   Object.assign(this.form, {
    //     diaryDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    //     recordUserName: this.userName,
    //     recordUserId: this.userId,
    //     todayWeather: this.weatherInfo.weather,
    //     highTemperature: this.weatherInfo.highTemperature,
    //     lowTemperature: this.weatherInfo.lowTemperature
    //   })
    // },
    // 添加数据
    async handleLogSubmit() {
      await this.$refs.form.validate()
      this.isLoading = true
      await api
        .getLogAdd(this.form)
        .then(result => {
          if (result.code === 200) {
            this.$utils.showToast('操作成功')
            this.isSave = true
            setTimeout(() => {
              this.$utils.goBack()
            }, 1500)
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
