<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="单位工程名称" prop="unitProjectName">
            <textarea v-model.trim="form.unitProjectName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="周报所属日期" prop="reportStartDate" isLink>
            <uni-date-picker
              v-model="reportDate"
              valueFormat="YYYY-MM-DD"
              fields="day"
              mode="range"
              @input="getDateTime"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="签阅人" prop="signer" isLink>
            <uni-select-user v-model="form.signer" placeholder="点击选择人员" />
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <!--本周工程进度-->
      <view class="card-title-outer">
        <view class="title">
          <view>本周工程进度</view>
          <view class="btn-add" @click="handleOpenThisWeekList">新增工程进度</view>
          <!-- <uni-icons
            class="icon"
            color="#2EB04C"
            type="plus-filled"
            size="24"
            @click="handleOpenThisWeekList"
          ></uni-icons> -->
        </view>
      </view>

      <block v-if="currentList.length">
        <block v-for="(item, index) in currentList" :key="`this${index}`">
          <uni-form-custom :ref="index" :model="item" class="border-top mt20">
            <uni-card>
              <view class="btn-top">
                <view class="btn-title">工程进度:{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                <view class="btn-delete" @click="handleDeleteThisItem(index)">删除</view>
              </view>
              <!-- <icon class="icon-clear" type="clear" size="26" @click="handleDeleteThisItem(index)" /> -->
              <!-- <uni-form-item label=" 工程进度">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item> -->
              <uni-form-item label="工作内容名称" prop="content">
                <input v-model="item.content" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="完成情况(%)" prop="completion">
                <input v-model="item.completion" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="未完成原因">
                <input v-model="item.notFinishedReason" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="负责人">
                <input v-model="item.directorName" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="备注">
                <input v-model="item.remark" class="uni-input" placeholder="请输入" />
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
      </block>
      <!--下周工程安排-->
      <view class="card-title-outer">
        <view class="title">
          <view>下周工程安排</view>
          <view class="btn-add" @click="handleOpenThisWeekList">新增工作安排</view>
          <!-- <uni-icons
            class="icon"
            color="#2EB04C"
            type="plus-filled"
            size="24"
            @click="handleOpenNextWeekList"
          ></uni-icons> -->
        </view>
      </view>
      <block v-if="nextList.length">
        <block v-for="(item, index) in nextList" :key="`next${index}`">
          <uni-form-custom :ref="index" :model="item" class="border-top mt20">
            <uni-card>
              <!-- <icon class="icon-clear" type="clear" size="26" @click="handleDeleteNextItem(index)" />
              <uni-form-item label="工程安排">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item> -->
              <view class="btn-top">
                <view class="btn-title">工程安排:{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                <view class="btn-delete" @click="handleDeleteThisItem(index)">删除</view>
              </view>
              <uni-form-item label="工作内容" prop="content">
                <input v-model="item.content" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="备注">
                <input v-model="item.remark" class="uni-input" placeholder="请输入" />
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
      </block>
      <!-- 备注信息开始 -->
      <uni-card isForm>
        <uni-form-item label="本周现场大事记" align="right">
          <label>
            <textarea v-model.trim="form.sceneMemorabilia" :maxlength="-1" placeholder="请输入内容" auto-height />
          </label>
        </uni-form-item>
        <uni-form-item label="本周安全问题反馈" align="right">
          <label>
            <textarea v-model.trim="form.safetyProblem" :maxlength="-1" placeholder="请输入内容" auto-height />
          </label>
        </uni-form-item>
        <uni-form-item label="本周质量问题反馈" align="right">
          <label>
            <textarea v-model.trim="form.qualityProblem" :maxlength="-1" placeholder="请输入内容" auto-height />
          </label>
        </uni-form-item>
        <uni-form-item label="本周工程照片上传" align="right">
          <uni-attachment v-model="form.engineeringPhotoFileIds" edit uploadType="image"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="监理周报附件" align="right">
          <uni-attachment v-model="form.fileIds" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
      <!-- 备注信息结束 -->
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
import moment from 'moment'
export default {
  data() {
    return {
      id: '',
      reportDate: [],
      form: {
        projectId: uni.getStorageSync('projectId'),
        creator: uni.getStorageSync('userId')
      },
      rules: {
        unitProjectName: [{ required: true, message: '单位工程名称必填' }],
        reportStartDate: [{ required: true, message: '时间必选' }],
        signer: [{ required: true, message: '签阅人必选' }]
      },
      currentList: [
        {
          completion: '',
          notFinishedReason: '',
          remark: '',
          directorName: '',
          content: ''
        }
      ], //本周工程进度
      nextList: [
        {
          remark: '',
          content: ''
        }
      ], //下周工程进度
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑监理周报')
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
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'draft') {
      this.handleSubmit()
    }
  },
  methods: {
    //获得详情
    getDetail() {
      Api.getWeeklyInfo(this.id).then(res => {
        this.form = res.data || {}
        let { reportEndDate, reportStartDate, nextList, currentList } = this.form
        this.currentList = [...currentList]
        this.nextList = [...nextList]
        this.reportDate = [moment(reportStartDate).format('YYYY-MM-DD'), moment(reportEndDate).format('YYYY-MM-DD')]
      })
    },

    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()
      let data = _.cloneDeep({ ...this.form, currentList: this.currentList, nextList: this.nextList })
      if (this.id) {
        Api.getWeeklyUpdate(data).then(res => {
          this.$utils.showToast('修改成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      } else {
        Api.getWeeklyAdd(data).then(res => {
          this.$utils.showToast('保存成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      }
    },
    //获取时间
    getDateTime(e) {
      this.form.reportStartDate = e[0]
      this.form.reportEndDate = e[1]
    },
    // 添加本周工作进度
    handleOpenThisWeekList() {
      let obj = {
        completion: '',
        notFinishedReason: '',
        remark: '',
        directorName: '',
        content: ''
      }
      this.currentList.push(obj)
    },
    //添加下周工作计划
    handleOpenNextWeekList() {
      let obj = {
        remark: '',
        content: ''
      }
      this.nextList.push(obj)
    },
    //删除本周工作
    handleDeleteThisItem(index) {
      this.currentList.splice(index, 1)
    },
    //删除下周工作
    handleDeleteNextItem(index) {
      this.nextList.splice(index, 1)
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
