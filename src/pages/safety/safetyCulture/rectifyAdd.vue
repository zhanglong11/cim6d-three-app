<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="工程名称" prop="engineeringName" isRequired>
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入工程名称" />
          </uni-form-item>
          <uni-form-item label="回复单位" prop="rectificationReplyCompany" isRequired>
            <textarea v-model.trim="form.rectificationReplyCompany" auto-height placeholder="请输入回复单位" />
          </uni-form-item>
          <uni-form-item label="具体内容" prop="concreteContent" isRequired>
            <textarea v-model.trim="form.concreteContent" auto-height placeholder="请输入具体内容" />
          </uni-form-item>

          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item label="回复文件" prop="replyFile" isRequired>
            <textarea v-model.trim="form.replyFile" auto-height placeholder="请输入回复文件" />
          </uni-form-item>
        </uni-card>
        <view style="font-size: 14px"><uni-form-item label="包含问题" isRequired></uni-form-item></view>
        <block v-for="(item, index) in form.details" :key="index">
          <uni-form-custom :ref="index" :model="item" :rules="subRules" class="mt20" style="position: relative">
            <uni-card isForm>
              <view class="hdec-top">
                <view class="btn-title">问题{{ index + 1 }}</view>
                <view class="btn-delete" @click="showDelete(index)">删除</view>
              </view>
              <uni-form-item label="问题描述" prop="problemDescribe" isRequired>
                <textarea v-model.trim="item.problemDescribe" auto-height placeholder="请输入问题描述" />
              </uni-form-item>
              <uni-form-item label="整改情况" prop="rectificationSituation" isRequired>
                <textarea v-model.trim="item.rectificationSituation" auto-height placeholder="请输入整改情况" />
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
        <view style="text-align: center">
          <view class="btn-add" @click="handleAddItem()">新增问题</view>
          <!-- <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAdd"> </uni-icons> -->
        </view>
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
        rectificationReplyCompany: '深圳市市政工程质量安全监督总站',
        replyFile: '住建局《责令整改通知书》（深建市政改[2021]0566号）',
        details: [
          {
            problemDescribe: '',
            rectificationSituation: ''
          }
        ] //安全隐患
      },
      rules: {
        engineeringName: { required: true },
        rectificationReplyCompany: { required: true },
        concreteContent: { required: true },
        replyFile: { required: true },
        safetyProblem: { required: true },
        details: { required: true },
        fileIds: { required: true }
      },
      subRules: {
        problemDescribe: { required: true },
        rectificationSituation: { required: true }
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
      let res = await api.getrectifyDetail(this.id)
      this.form = { ...res.data }
    },
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      if (this.form.details.length <= 0) {
        return this.$utils.showToast('至少添加一个包含问题')
      }
      await Promise.all(
        this.form.details.map((item, index) => {
          return this.$refs[index][0].validate()
        })
      )
      const form = _.cloneDeep(this.form)
      this.btnSaveLoadingSave = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? await api.getrectifyUpdate(form) : await api.getrectifySave(form)
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
      if (this.form.details.length <= 0) {
        return this.$utils.showToast('至少添加一个包含问题')
      }
      const form = _.cloneDeep(this.form)
      this.btnSaveLoading = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? await api.getrectifyUpdateAndSubmit(form) : await api.getrectifySubmit(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoading = false
        this.$utils.goBack(num)
      }, 1000)
    },
    // 隐患删除
    showDelete(index) {
      //  this.form.currentList.splice(scope.$index, 1)
      this.form.details.splice(index, 1)
    },
    //新增
    handleAddItem() {
      this.form.details.push({
        problemDescribe: '',
        rectificationSituation: ''
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
.btn-wrapper {
  display: flex;
  .button {
    flex: 1;
    margin: 0 20rpx;
  }
}

.hdec-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  .btn-title {
    margin-right: 20px;
  }
  .btn-delete {
    background: red;
    color: #fff;
    font-size: 14px;
    padding: 4px 16px;
    border-radius: 10px;
  }
}
.btn-add {
  width: 200px;
  text-align: center;
  // background: #00aeff;
  color: #00aeff;
  padding: 8px 8px;
  border-radius: 10px;
  display: inline-block;
}
.hedc-title {
  font-size: 14px;
  border-top: 1px solid #ccc;
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
</style>
