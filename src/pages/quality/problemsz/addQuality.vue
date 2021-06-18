<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="通知日期" prop="noticeDate" isRequired>
            <uni-date-picker v-model="form.noticeDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="工程名称" prop="engineeringName" isRequired>
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入工程名称" />
          </uni-form-item>
          <uni-form-item label="编号" prop="qualityProblemCode" isRequired>
            <textarea v-model.trim="form.qualityProblemCode" auto-height placeholder="请输入编号" />
          </uni-form-item>
          <uni-form-item label="协作单位" prop="collaborationCompany" isRequired>
            <textarea v-model.trim="form.collaborationCompany" auto-height placeholder="请输入协作单位" />
          </uni-form-item>
          <uni-form-item label="施工内容" prop="constructionContent" isRequired>
            <textarea v-model.trim="form.constructionContent" auto-height placeholder="请输入施工内容" />
          </uni-form-item>
          <uni-form-item label="通知单位" prop="noticeContactCompany" isRequired>
            <textarea v-model.trim="form.noticeContactCompany" auto-height placeholder="请输入通知单位" />
          </uni-form-item>
          <uni-form-item label="现场问题" prop="siteProblem" isRequired>
            <textarea v-model.trim="form.siteProblem" auto-height placeholder="请输入现场问题" />
          </uni-form-item>
          <uni-form-item label="整改要求" prop="rectificationRequirements" isRequired>
            <textarea v-model.trim="form.rectificationRequirements" auto-height placeholder="请输入整改要求" />
          </uni-form-item>

          <uni-form-item label="施工单位" prop="constructionCompany" isRequired>
            <textarea v-model.trim="form.constructionCompany" auto-height placeholder="请输入施工单位" />
          </uni-form-item>
          <uni-form-item label="发起时间" prop="startDate" isRequired isLink>
            <uni-date-picker v-model="form.startDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>

      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="btnSaveLoadingSave" @click="goSubmit()">提交</button>
        <button class="button" type="primary" :loading="btnSaveLoading" @click="saveCaoGao()">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '../api'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      //申请到货日期
      id: '',
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        constructionCompany: '中交天津航道局有限公司深圳市海洋新兴产业基地陆域形成工程2a标段施工项目经理部',
        noticeDate: moment(new Date()).format('YYYY-MM-DD'),
        startDate: moment(new Date()).format('YYYY-MM-DD')
      },
      rules: {
        noticeDate: { required: true },
        engineeringName: { required: true },
        qualityProblemCode: { required: true },
        collaborationCompany: { required: true },
        constructionContent: { required: true },
        noticeContactCompany: { required: true },
        siteProblem: { required: true },
        rectificationRequirements: { required: true },
        constructionCompany: { required: true },
        startDate: { required: true }
      },
      isSave: false, // 是否保存,
      btnSaveLoading: false,
      btnSaveLoadingSave: false,
      status: ''
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      console.log(options)
      this.id = options.id
      this.status = options.status || ''
      this.$utils.setTitle('编辑')
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
    async getDetail() {
      let res = await Api.getEngineeringDetail(this.id)
      this.form = { ...res.data }
    },
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.noticeDate = moment(form.noticeDate).format('YYYY-MM-DD HH:00:00')
      form.startDate = moment(form.startDate).format('YYYY-MM-DD HH:00:00')
      this.btnSaveLoading = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? Api.getEngineerUpdate(form) : await Api.getEngineerSave(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoading = false
        this.$utils.goBack(num)
      }, 1000)
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.noticeDate = moment(form.noticeDate).format('YYYY-MM-DD HH:00:00')
      form.startDate = moment(form.startDate).format('YYYY-MM-DD HH:00:00')
      this.btnSaveLoadingSave = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? Api.getEngineerUpdateAndSub(form) : await Api.getEngineersaveAndSubmit(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoadingSave = false
        this.$utils.goBack(num)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
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
</style>
