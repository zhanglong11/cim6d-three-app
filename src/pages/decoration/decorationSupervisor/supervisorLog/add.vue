<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :rules="rules" :model="form">
        <uni-card isForm>
          <!-- <uni-form-item label="日志编号" :border="false">
            <textarea v-model.trim="form.name" auto-height placeholder="自动生成" disabled />
          </uni-form-item> -->
          <uni-form-item label="单位工程名称" prop="unitProjectName">
            <textarea v-model.trim="form.unitProjectName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="日期" prop="reportDate" isLink>
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="签阅人" prop="signer">
            <!-- <textarea v-model.trim="form.signer" auto-height disabled placeholder="点击选择人员" /> -->
            <uni-select-user v-model="form.signer" placeholder="点击选择人员" />
          </uni-form-item>
        </uni-card>

        <!-- 今日天气信息 -->
        <view>
          <view class="card-header">天气</view>
          <uni-card isForm>
            <uni-form-item label="今日天气" prop="weather">
              <input v-model.trim="form.weather" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="上午温度(℃)" prop="morningTemperature">
              <input v-model.number="form.morningTemperature" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="下午温度(℃)" prop="afternoonTemperature">
              <input v-model.number="form.afternoonTemperature" placeholder="请输入" />
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 进度状况 -->
        <view>
          <view class="card-header">详情</view>
          <uni-card isForm>
            <uni-form-item label="施工进展情况：" :border="false" align="left" class="block-item">
              <textarea v-model.trim="form.constructionProgress" :maxlength="-1" placeholder="请输入内容" auto-height />
            </uni-form-item>
            <uni-form-item label="监理工作情况：" align="left" class="block-item">
              <textarea v-model.trim="form.supervisionWork" :maxlength="-1" placeholder="请输入内容" auto-height />
            </uni-form-item>
            <uni-form-item label="存在问题及处理情况：" align="left" class="block-item">
              <textarea v-model.trim="form.problemAndHandling" :maxlength="-1" placeholder="请输入内容" auto-height />
            </uni-form-item>
            <uni-form-item label="其他事项：" align="left" class="block-item">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入内容" auto-height />
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 附件上传 -->
        <view>
          <view class="card-header">附件</view>
          <uni-card isForm>
            <!-- <uni-form-item label="签阅人" prop="signPersonId" isLink>
              <uni-select-user v-model="form.signPersonId" :name.sync="form.signPersonName" />
            </uni-form-item> -->
            <!--          <uni-form-item label="备注" type="textarea" align="left" class="block-item">-->
            <!--            <textarea v-model.trim="form.remark" :maxlength="200" placeholder="请输入备注信息" auto-height />-->
            <!--          </uni-form-item>-->
            <uni-form-item class="file-item" label="监理日志附件：">
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
import api from '../api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {
        creator: uni.getStorageSync('userId'),
        creatorName: uni.getStorageSync('userName')
      },
      rules: {
        unitProjectName: [{ required: true, message: '单位工程名称必填' }],
        weather: [{ required: true, message: '天气必填' }],
        signer: [{ required: true, message: '签阅人必填' }],
        reportDate: [{ required: true, message: '编制日期必选' }]
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
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id
      this.$utils.setTitle('编辑监理日志')
      this.getDetail()
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
    //
    getDetail() {
      api.getLogInfo(this.form.id).then(res => {
        this.form = res.data || {}
      })
    },
    // 添加数据
    async handleLogSubmit() {
      await this.$refs.form.validate()
      this.isLoading = true
      if (this.form.id) {
        await api.getLogUpdate(this.form).then(res => {
          this.$utils.showToast('编辑成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      } else {
        await api
          .getLogAdd(this.form)
          .then(result => {
            if (result.code === 200) {
              this.$utils.showToast('操作成功')
              this.isSave = true
              setTimeout(() => {
                this.$utils.goBack()
              }, 1000)
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
