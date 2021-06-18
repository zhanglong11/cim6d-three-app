<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <uni-form-item label="工种" prop="workType" isRequired isLink>
            <uni-select v-model="form.workType" :options="workTypeList"></uni-select>
          </uni-form-item>
          <uni-form-item label="施工部位" prop="constructionArea" isRequired>
            <textarea v-model.trim="form.constructionArea" auto-height placeholder="请输入施工部位" />
          </uni-form-item>
          <uni-form-item label="作业内容/类型" prop="taskContentType" isRequired>
            <textarea v-model.trim="form.taskContentType" auto-height placeholder="请输入作业内容/类型" />
          </uni-form-item>
          <uni-form-item label="施工负责人" isLink isRequired prop="constructionManger">
            <uni-select-user v-model="form.constructionManger" />
          </uni-form-item>
          <uni-form-item label="计划起始日期" prop="planDate" isRequired isLink>
            <uni-date-picker
              v-model="form.planDate"
              fields="day"
              valueFormat="YYYY-MM-DD"
              mode="range"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="安全防护措施" prop="safetyPrecautions" isRequired>
            <textarea v-model.trim="form.safetyPrecautions" auto-height placeholder="请输入安全防护措施" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileId">
            <uni-attachment v-model="form.fileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '@/pages/safety/api'
export default {
  components: {},
  data() {
    return {
      //申请到货日期
      id: '',
      form: {
        workType: '',
        constructionArea: '',
        taskContentType: '',
        constructionManger: '',
        planDate: [],
        safetyPrecautions: '',
        fileId: ''
      },
      rules: {
        workType: { required: true },
        constructionArea: { required: true },
        taskContentType: { required: true },
        constructionManger: { required: true },
        planDate: { required: true },
        safetyPrecautions: { required: true },
        fileId: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || []
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    this.getDetail()
    let targetId = options.messageId || ''
    if (targetId) {
      this.$utils.toUrl(`/pages/safety/special/detail?id=${this.id}&isCheck=${options.isCheck}`, 2)
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
  onNavigationBarButtonTap(obj) {},
  methods: {
    // 时间截取年月日
    formatData(str) {
      if (!str) {
        return ''
      }
      return str.substring(0, 10)
    },
    //获取详情
    async getDetail() {
      if (!this.id) {
        return
      }
      let res = await Api.getSpecialDetail(this.id)
      let datas = res.data
      datas.planDate = [this.formatData(datas.planStartDate), this.formatData(datas.planEndDate)]
      console.log(444, datas)
      this.form = datas
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        projectId: this.projectId,
        planStartDate: this.moment(this.form.planDate[0]).format('YYYY-MM-DD 00:00:00'),
        planEndDate: this.moment(this.form.planDate[1]).format('YYYY-MM-DD 23:59:59:00:00')
      }
      isSave ? await Api.addSpecial(params) : await Api.submitSpecial(params)
      this.$utils.showToast('成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/add.less');
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
