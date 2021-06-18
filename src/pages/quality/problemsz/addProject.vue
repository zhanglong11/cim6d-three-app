<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="工程名称" prop="engineeringName" isRequired>
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入工程名称" />
          </uni-form-item>
          <uni-form-item label="编号" prop="qualityProblemCode" isRequired>
            <textarea v-model.trim="form.qualityProblemCode" auto-height placeholder="请输入编号" />
          </uni-form-item>

          <uni-form-item label="联系单位" prop="noticeContactCompany" isRequired>
            <textarea v-model.trim="form.noticeContactCompany" auto-height placeholder="请输入联系单位" />
          </uni-form-item>

          <uni-form-item label="事由" prop="reason" isRequired>
            <textarea v-model.trim="form.reason" auto-height placeholder="请输入事由" />
          </uni-form-item>
          <uni-form-item label="具体内容" prop="concreteContent" isRequired>
            <textarea v-model.trim="form.concreteContent" auto-height placeholder="请输入具体内容" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item label="施工单位" prop="constructionCompany" isRequired>
            <textarea v-model.trim="form.constructionCompany" auto-height placeholder="请输入施工单位" />
          </uni-form-item>
        </uni-card>
      </uni-form-custom>

      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="btnSaveLoading" @click="goSubmit()">提交</button>
        <button class="button" type="primary" :loading="btnSaveLoadingSave" @click="saveCaoGao()">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import api from '../api'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      //申请到货日期
      id: '',
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        noticeContactCompany:
          '广州华申建设工程管理有限公司深圳市海洋新兴产业基地陆域形成工程2a标段项目监理部（项目监理机构）',
        constructionCompany: '中交天津航道局有限公司深圳市海洋新兴产业基地陆域形成工程2a标段施工项目经理部'
      },
      rules: {
        engineeringName: { required: true },
        qualityProblemCode: { required: true },
        noticeContactCompany: { required: true },
        collaborationCompany: { required: true },
        reason: { required: true },
        concreteContent: { required: true },
        constructionCompany: { required: true }
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
      let res = await api.getBusinessDetail(this.id)
      this.form = { ...res.data }
    },
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      this.btnSaveLoadingSave = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? await api.getBusinessUpdate(form) : await api.getBusinessSave(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoadingSave = false
        this.$utils.goBack(num)
      }, 1000)
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      this.btnSaveLoading = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3'
        ? await api.getBusinessUpdateAndSubmit(form)
        : await api.getBusinesssaveAndSubmit(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoading = false
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
