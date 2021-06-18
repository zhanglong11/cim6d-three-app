<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="单位工程名称" prop="engineeringName">
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="旁站部位或工序" prop="partProcedure">
            <textarea v-model.trim="form.partProcedure" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="天气" prop="weather">
            <textarea v-model.trim="form.weather" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="旁站人">
            <textarea v-model.trim="form.creatorName" auto-height disabled />
          </uni-form-item>
          <uni-form-item label="旁站开始时间" prop="startDate" isLink>
            <uni-date-picker
              v-model="form.startDate"
              fields="day"
              mode="date"
              @input="handleStartDate"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="旁站结束时间" prop="endDate" isLink>
            <uni-date-picker v-model="form.endDate" fields="day" mode="date" @input="handleEndDate"></uni-date-picker>
          </uni-form-item>
        </uni-card>
        <block>
          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="施工情况" align="right" prop="constructionSituation">
              <label>
                <textarea v-model.trim="form.constructionSituation" :maxlength="-1" placeholder="请输入" auto-height />
              </label>
            </uni-form-item>
            <uni-form-item label="监理情况" align="right" prop="supervisorSituation">
              <label>
                <textarea v-model.trim="form.supervisorSituation" :maxlength="-1" placeholder="请输入" auto-height />
              </label>
            </uni-form-item>
            <uni-form-item label="发现问题" align="right">
              <label>
                <textarea v-model.trim="form.findIssue" :maxlength="-1" placeholder="请输入" auto-height />
              </label>
            </uni-form-item>
            <uni-form-item label="处理问题" align="right">
              <label>
                <textarea v-model.trim="form.handleIssue" :maxlength="-1" placeholder="请输入" auto-height />
              </label>
            </uni-form-item>
            <uni-form-item label="旁站备注" align="right">
              <label>
                <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />
              </label>
            </uni-form-item>
            <uni-form-item label="旁站附件" align="right">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" :loading="btnSaveLoading" type="primary" @click="handleSubmit()">提 交</button>
          </view>
        </block>
      </uni-form-custom>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/supervisorRecord'
export default {
  data() {
    return {
      id: '',
      form: {
        projectId: uni.getStorageSync('projectId'),
        creator: uni.getStorageSync('userId'),
        creatorName: uni.getStorageSync('userName')
      },
      rules: {
        engineeringName: [{ required: true, message: '单位工程名称必填' }],
        partProcedure: [{ required: true, message: '旁站部位或工序必填' }],
        weather: [{ required: true, message: '天气必填' }],
        startDate: [{ required: true, message: '旁站开始时间必选' }],
        endDate: [{ required: true, message: '旁站结束时间必选' }],
        constructionSituation: [{ required: true, message: '施工情况必填' }],
        supervisorSituation: [{ required: true, message: '监理情况必填' }]
      },
      btnSaveLoading: false,
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑旁站记录')
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
  methods: {
    //获得详情
    getDetail() {
      Api.getRecordInfo(this.id).then(res => {
        this.form = res.data || {}
      })
    },
    handleStartDate(e) {
      let startDate = new Date(e).getTime()
      let endDate = new Date(this.form.endDate).getTime()
      if (startDate > endDate) {
        this.$utils.showToast('开始时间不能大于结束时间')
        return
      }
    },
    handleEndDate(e) {
      let endDate = new Date(e).getTime()
      let startDate = new Date(this.form.startDate).getTime()
      if (startDate > endDate) {
        this.$utils.showToast('结束时间不能小于开始时间')
        return
      }
    },
    // 点击保存按钮
    async handleSubmit() {
      try {
        // 开启表单验证
        await this.$refs.form.validate()
        this.btnSaveLoading = true
        let res = this.id ? await Api.getRecordUpdate(this.form) : await Api.getRecordAdd(this.form)
        let num = this.id ? 2 : 1
        if (res.code === 200) {
          this.btnSaveLoading = false
          this.$utils.showToast('保存成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack(num)
          }, 1000)
        } else {
          this.$utils.showToast('保存失败')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack(num)
          }, 1000)
        }
      } catch (e) {
        this.btnSaveLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
.mt20 + .mt20 {
  margin-top: 50rpx;
}
</style>
