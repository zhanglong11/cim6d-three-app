<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="监理月报名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="年度" prop="year" isLink>
            <uni-date-picker v-model="form.year" valueFormat="YYYY" fields="year" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="月份" prop="month" isLink>
            <uni-select
              v-model="form.month"
              style="font-size: 13px; color: #757575"
              :options="monthList"
              placeholder="请选择月份"
            >
            </uni-select>
          </uni-form-item>
          <uni-form-item label="编制人" prop="authorId" isLink>
            <uni-select-user v-model="form.authorId" />
          </uni-form-item>
          <uni-form-item label="编制日期" prop="reportDate" isLink>
            <uni-date-picker v-model="form.reportDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="监理月报备注" align="right">
            <label>
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入" auto-height />
            </label>
          </uni-form-item>
          <uni-form-item label="监理月报附件" align="right">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSubmit()">提 交</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '../api'
import monthList from '../lib/monthList'
export default {
  data() {
    return {
      id: '',
      monthList,
      form: {
        projectId: uni.getStorageSync('projectId'),
        creator: uni.getStorageSync('userId')
      },
      rules: {
        name: [{ required: true, message: '监理月报名称必填' }],
        reportDate: [{ required: true, message: '编制日期必选' }],
        month: [{ required: true, message: '月度必选' }],
        year: [{ required: true, message: '年度必选' }],
        authorId: [{ required: true, message: '编制人必选' }]
      },
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑监理月报')
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
      Api.getMonthlyInfo(this.id).then(res => {
        console.log(res)
        this.form = res.data || {}
        this.form.year = this.form.year.toString()
      })
    },

    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证
      await this.$refs.form.validate().then(() => {
        let data = _.cloneDeep(this.form)
        // let num = this.id ? 2 : 1
        if (this.id) {
          Api.getMonthlyUpdate(data).then(res => {
            this.$utils.showToast('编辑成功')
            this.isSave = true
            setTimeout(() => {
              this.$utils.goBack(1)
            }, 1000)
          })
        } else {
          Api.getMonthlyAdd(data).then(res => {
            this.$utils.showToast('保存成功')
            this.isSave = true
            setTimeout(() => {
              this.$utils.goBack(1)
            }, 1000)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
.mt20 + .mt20 {
  margin-top: 50rpx;
}
</style>
