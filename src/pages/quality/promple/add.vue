<template>
  <view class="main">
    <view class="main-body">
      <block v-for="(item, index) in list" :key="index">
        <uni-form-custom :ref="index" :model="item" :rules="rules" class="mt20" style="position: relative">
          <view v-if="index !== 0" style="position: absolute; top: -20rpx; right: 8rpx; z-index: 2; text-align: center">
            <uni-icons class="icon" color="#f00" type="clear" size="24" @click="handleDeleteItem(index)"> </uni-icons>
          </view>
          <uni-card isForm>
            <uni-form-item label="问题部位" prop="problemArea" isRequired>
              <textarea v-model.trim="item.problemArea" auto-height placeholder="请输入问题部位" />
            </uni-form-item>
            <uni-form-item label="问题描述" prop="problemDesc" isRequired>
              <textarea v-model.trim="item.problemDesc" auto-height placeholder="请输入问题描述" />
            </uni-form-item>
            <uni-form-item class="file-item" label="照片" prop="fileId">
              <uni-attachment v-model="item.fileId" uploadType="image" edit></uni-attachment>
            </uni-form-item>
            <uni-form-item label="整改人" isLink isRequired prop="rectifyPrincipal">
              <uni-select-user v-model="item.rectifyPrincipal" />
            </uni-form-item>
            <uni-form-item label="整改期限" prop="rectifyDeadline" isRequired isLink>
              <uni-date-picker v-model="item.rectifyDeadline" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
      </block>
      <view style="text-align: center">
        <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAdd"> </uni-icons>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并下达</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from './api'
export default {
  components: {},
  data() {
    return {
      //申请到货日期
      id: '',
      list: [
        {
          problemArea: '',
          problemDesc: '',
          fileId: '',
          rectifyPrincipal: '',
          rectifyDeadline: '',
          inspectType: 1
        }
      ],
      rules: {
        // applicantName: { required: true },
        problemArea: { required: true },
        problemDesc: { required: true },
        fileId: { required: true },
        rectifyPrincipal: { required: true },
        rectifyDeadline: { required: true }
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
      this.$utils.setTitle('编辑采购单')
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
      let res = await Api.getIssueDetailById(this.id)
      this.list = res
    },
    //删除选中的采购产品
    handleDeleteItem(index) {
      this.list.splice(index, 1)
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      // 开启表单验证
      await Promise.all(
        this.list.map((item, index) => {
          return this.$refs[index][0].validate()
        })
      )
      isSave ? await Api.saveIssue(this.list) : await Api.saveAddReleaseIssue(this.list)
      this.$utils.showToast('成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    },
    // 新增
    handleAdd() {
      let obj = {
        problemArea: '',
        problemDesc: '',
        fileId: '',
        rectifyPrincipal: '',
        rectifyDeadline: '',
        inspectType: 1
      }
      this.list.push(obj)
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
