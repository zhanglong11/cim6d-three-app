<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="单位工程名称" prop="engineeringName">
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="时间" prop="reportStartDate" isLink>
            <uni-date-picker
              v-model="reportDate"
              valueFormat="YYYY-MM-DD"
              fields="day"
              mode="range"
              @input="getDateTime"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="签阅人" prop="signPersonId" isLink>
            <uni-select-user v-model="form.signPersonId" :name.sync="form.signPersonName" />
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <!--本周工程进度-->
      <view class="card-title-outer">
        <view class="title">
          <view>本周工程进度</view>
          <uni-icons
            class="icon"
            color="#2EB04C"
            type="plus-filled"
            size="24"
            @click="handleOpenThisWeekList"
          ></uni-icons>
        </view>
      </view>

      <block v-if="thisWeekList.length">
        <block v-for="(item, index) in thisWeekList" :key="`this${index}`">
          <uni-form-custom :ref="index" :model="item" :rules="subRules" class="border-top mt20">
            <uni-card>
              <icon class="icon-clear" type="clear" size="26" @click="handleDeleteThisItem(index)" />
              <uni-form-item label="序号">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item>
              <uni-form-item label="工作内容名称" prop="workContent">
                <input v-model="item.workContent" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="完成情况(%)" prop="finishSituation">
                <input v-model="item.finishSituation" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="未完成原因">
                <input v-model="item.unfinishedReason" class="uni-input" placeholder="请输入" />
              </uni-form-item>
              <uni-form-item label="负责人">
                <input v-model="item.principal" class="uni-input" placeholder="请输入" />
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
          <uni-icons
            class="icon"
            color="#2EB04C"
            type="plus-filled"
            size="24"
            @click="handleOpenNextWeekList"
          ></uni-icons>
        </view>
      </view>
      <block v-if="nextWeekList.length">
        <block v-for="(item, index) in nextWeekList" :key="`next${index}`">
          <uni-form-custom :ref="index" :model="item" :rules="subRules" class="border-top mt20">
            <uni-card>
              <icon class="icon-clear" type="clear" size="26" @click="handleDeleteNextItem(index)" />
              <uni-form-item label="序号">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item>
              <uni-form-item label="工作内容" prop="workContent">
                <input v-model="item.workContent" class="uni-input" placeholder="请输入" />
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
            <textarea v-model.trim="form.breakingNews" :maxlength="-1" placeholder="请输入" auto-height />
          </label>
        </uni-form-item>
        <uni-form-item label="本周安全问题反馈" align="right">
          <label>
            <textarea v-model.trim="form.safetyIssueFeedback" :maxlength="-1" placeholder="请输入" auto-height />
          </label>
        </uni-form-item>
        <uni-form-item label="本周工程照片" align="right">
          <uni-attachment v-model="form.engineeringImgIds" edit uploadType="image"></uni-attachment>
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
import Api from '@/api/supervisorRecord'
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
        engineeringName: [{ required: true, message: '单位工程名称必填' }],
        reportStartDate: [{ required: true, message: '时间必选' }],
        signPersonId: [{ required: true, message: '签阅人必选' }]
      },
      subRules: {
        workContent: {
          required: true
        },
        finishSituation: {
          required: true
        }
      },
      thisWeekList: [
        {
          finishSituation: '',
          principal: '',
          remark: '',
          unfinishedReason: '',
          workContent: ''
        }
      ], //本周工程进度
      nextWeekList: [
        {
          remark: '',
          workContent: ''
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
        let { reportEndDate, reportStartDate, thisWeekList, nextWeekList } = this.form
        this.reportDate = [reportStartDate, reportEndDate]
        this.thisWeekList = [...thisWeekList]
        this.nextWeekList = [...nextWeekList]
      })
    },

    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()
      if (!this.thisWeekList.length) {
        this.$utils.showToast('本周工程进度必填')
        return
      }
      Promise.all(
        this.thisWeekList.map((item, index) => {
          // console.log('item' + index)
          // let item = 'item' + index
          return this.$refs[index][0].validate()
        })
      ).then(() => {
        for (let item of this.nextWeekList) {
          if (!item.workContent) {
            this.$utils.showToast('下周工作安排工作内容必填')
            return
          }
        }
        let data = _.cloneDeep({ ...this.form, thisWeekList: this.thisWeekList, nextWeekList: this.nextWeekList })
        let num = this.id ? 2 : 1
        Api.getWeeklyAdd(data).then(res => {
          this.$utils.showToast('保存成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack(num)
          }, 1000)
        })
      })
    },
    //获取时间
    getDateTime(e) {
      this.form.reportStartDate = e[0]
      this.form.reportEndDate = e[1]
    },
    // 添加本周工作进度
    handleOpenThisWeekList() {
      let obj = {
        finishSituation: '',
        principal: '',
        remark: '',
        unfinishedReason: '',
        workContent: ''
      }
      this.thisWeekList.push(obj)
    },
    //添加下周工作计划
    handleOpenNextWeekList() {
      let obj = {
        remark: '',
        workContent: ''
      }
      this.nextWeekList.push(obj)
    },
    //删除本周工作
    handleDeleteThisItem(index) {
      this.thisWeekList.splice(index, 1)
    },
    //删除下周工作
    handleDeleteNextItem(index) {
      this.nextWeekList.splice(index, 1)
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
