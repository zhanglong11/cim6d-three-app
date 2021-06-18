<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <uni-form-item label="危险源名称" prop="dangerSource" isRequired>
            <textarea v-model.trim="form.dangerSource" auto-height placeholder="请输入危险源名称" />
          </uni-form-item>
          <uni-form-item label="伤害类型" prop="harmCategory" isRequired isLink>
            <uni-select v-model="form.harmCategory" :options="harmTypeList"></uni-select>
          </uni-form-item>
          <uni-form-item label="防范措施" prop="precautionaryMeasure" isRequired>
            <textarea v-model.trim="form.precautionaryMeasure" auto-height placeholder="请输入防范措施" />
          </uni-form-item>
          <uni-form-item label="备注" prop="remark">
            <textarea v-model.trim="form.remark" auto-height placeholder="请输入备注" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileId">
            <uni-attachment v-model="form.fileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <p class="title-p">所在位置</p>
      <block v-for="(item, index) in form.placeList" :key="index">
        <uni-form-custom :ref="index" :model="item" :rules="subRules" class="mt20">
          <uni-card isForm>
            <div slot="title" class="card-title">
              <div>序号{{ index + 1 }}</div>
              <span @click="handleDelete(index)">删除</span>
            </div>
            <uni-form-item label="所在位置" prop="placeName" isRequired>
              <textarea v-model.trim="item.placeName" auto-height placeholder="请输入所在位置" />
            </uni-form-item>
            <uni-form-item label="危险源时效性(开始)" prop="timelinessStartTime" isRequired isLink>
              <uni-date-picker v-model="item.timelinessStartTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="危险源时效性(结束)" prop="timelinessEndTime" isRequired isLink>
              <uni-date-picker v-model="item.timelinessEndTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="责任人" isLink isRequired prop="principal">
              <uni-select-user v-model="item.principal" />
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
      </block>
      <view style="text-align: center">
        <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAdd"> </uni-icons>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
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
        dangerSource: '',
        harmCategory: '',
        precautionaryMeasure: '',
        placeList: [
          {
            placeName: '',
            timelinessStartTime: '',
            timelinessEndTime: '',
            principal: ''
          }
        ]
      },
      rules: {
        dangerSource: { required: true },
        harmCategory: { required: true },
        precautionaryMeasure: { required: true },
        placeList: { required: true }
      },
      subRules: {
        placeName: { required: true },
        timelinessStartTime: { required: true },
        timelinessEndTime: { required: true },
        principal: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  onLoad(options) {},
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
    // 新增
    handleAdd() {
      let obj = {
        placeName: '',
        timelinessStartTime: '',
        timelinessEndTime: '',
        principal: ''
      }
      this.form.placeList.push(obj)
    },
    //删除
    handleDelete(index) {
      if (this.form.placeList.length === 1) {
        this.$utils.showToast('必须有至少一个所在位置')
        return
      }
      this.form.placeList.splice(index, 1)
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      if (!this.form.placeList.length) {
        this.$utils.showToast('必须有至少一个所在位置')
        return
      }
      await Promise.all(
        this.form.placeList.map((item, index) => {
          return this.$refs[index][0].validate()
        })
      )
      await Api.addDanger(this.form)
      this.$utils.showToast('成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
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
.title-p {
  height: 60rpx;
  line-height: 2;
  padding-left: 40rpx;
}
.card-title {
  border-bottom: 1px #999 solid;
  width: 100%;
  padding-bottom: 10rpx;
  position: relative;
  div {
    text-align: center;
  }
  span {
    position: absolute;
    right: 20rpx;
    top: 0;
    font-size: 12px;
    color: red;
  }
}
</style>
