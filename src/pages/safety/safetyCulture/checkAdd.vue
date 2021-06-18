<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="工程名称" prop="engineeringName" isRequired>
            <textarea v-model.trim="form.engineeringName" auto-height placeholder="请输入工程名称" />
          </uni-form-item>
          <uni-form-item label="检查区域" prop="checkArea" isRequired>
            <textarea v-model.trim="form.checkArea" auto-height placeholder="请输入检查区域" />
          </uni-form-item>
          <uni-form-item label="整改单位" prop="rectificationReplyCompany" isRequired>
            <textarea v-model.trim="form.rectificationReplyCompany" auto-height placeholder="请输入整改单位" />
          </uni-form-item>
          <uni-form-item label="整改期限" prop="rectificationTerm" isRequired>
            <!-- <textarea v-model.trim="form.rectificationTerm" auto-height placeholder="请输入整改期限" /> -->
            <uni-date-picker v-model="form.rectificationTerm" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <!-- <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item> -->
          <uni-form-item label="整改通知书编号" prop="rectificationNoticeNo" isRequired>
            <textarea v-model.trim="form.rectificationNoticeNo" auto-height placeholder="请输入整改通知书编号" />
          </uni-form-item>
          <uni-form-item label="需整改内容" prop="rectificationContent" isRequired>
            <textarea v-model.trim="form.rectificationContent" auto-height placeholder="请输入需整改内容" />
          </uni-form-item>
          <uni-form-item label="覆盖周期" prop="cycleStartDate" isRequired>
            <uni-date-picker
              v-model="reportDate"
              valueFormat="YYYY-MM-DD"
              fields="day"
              mode="range"
              @input="getReportDate"
            ></uni-date-picker>
          </uni-form-item>
        </uni-card>

        <block v-for="(item, index) in hiddenDangerDetails" :key="index">
          <uni-form-custom :ref="index" :model="item" :rules="rules" class="mt20" style="position: relative">
            <uni-card isForm>
              <view class="hdec-top">
                <view class="btn-title">隐患{{ index + 1 }}</view>
                <view class="btn-delete" @click="handleDeleteItem(index)">删除</view>
              </view>
              <view class="hedc-title">隐患排查</view>
              <uni-form-item label="隐患发现时间">
                <view class="disabled">{{ item.checkDate }}</view>
              </uni-form-item>
              <uni-form-item label="隐患类型">
                <view class="disabled">{{ item.safetyHiddenDangerType }}</view>
              </uni-form-item>
              <uni-form-item label="位置/活动">
                <view class="disabled">{{ item.locationActivity }}</view>
              </uni-form-item>
              <uni-form-item label="存在隐患或问题描述" isRequired>
                <view class="disabled">{{ item.hiddenDangerProblemDescribe }}</view>
              </uni-form-item>
              <uni-form-item class="file-item" label="隐患照片">
                <uni-attachment v-model="item.hiddenDangerFileIds" uploadType="image"></uni-attachment>
              </uni-form-item>
              <uni-form-item label="依据或建议">
                <view class="disabled">{{ item.basisSuggestion }}</view>
              </uni-form-item>
              <view class="hedc-title">隐患整改</view>
              <uni-form-item label="整改人">
                <view class="disabled">{{ item.rectificationPerson }}</view>
              </uni-form-item>
              <uni-form-item label="整改措施">
                <view class="disabled">{{ item.rectificationMeasures }}</view>
              </uni-form-item>
              <uni-form-item class="file-item" label="整改后照片">
                <uni-attachment v-model="item.afterRectificationFileIds" uploadType="image"></uni-attachment>
              </uni-form-item>
              <view class="hedc-title">整改验收</view>
              <uni-form-item class="file-item" label="是否合格">
                <view class="disabled">{{
                  item.qualifiedStatus !== null ? (item.qualifiedStatus === 0 ? '不合格' : '合格') : ''
                }}</view>
              </uni-form-item>
              <uni-form-item label="验收时间">
                <view class="disabled">{{ item.acceptanceTime | formatData }}</view>
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
        <view style="text-align: center">
          <!-- <view class="btn-add" @click="handleOpenThisWeekList">新增隐患</view> -->
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
        checkArea: '施工现场',
        rectificationReplyCompany: '中交天航局',
        cycleEndDate: '',
        cycleStartDate: '',
        hiddenDangerCheckRecordDetailIds: '' //隐患集合
      },
      rules: {
        engineeringName: { required: true },
        checkArea: { required: true },
        rectificationReplyCompany: { required: true },
        rectificationTerm: { required: true },
        rectificationNoticeNo: { required: true },
        rectificationContent: { required: true },
        cycleStartDate: { required: true }
      },
      isSave: false, // 是否保存,
      btnSaveLoading: false,
      btnSaveLoadingSave: false,
      reportDate: [
        moment(this.$utils.getMonyOneAndEndDate(new Date()).monthStartDate).format('YYYY-MM-DD'),
        moment(this.$utils.getMonyOneAndEndDate(new Date()).monthEndDate).format('YYYY-MM-DD')
      ],
      status: '',
      hiddenDangerDetails: [] //隐患集合
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.form.cycleStartDate = this.reportDate[0]
    this.form.cycleEndDate = this.reportDate[1]
    options.id ? '' : this.getsafetyHiddenTimeAnds()
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
    //安全隐患记录
    getsafetyHiddenTimeAnds() {
      let sd = this.form.cycleStartDate
      let ed = this.form.cycleEndDate
      let data = {
        cycleStartDate: moment(sd).format('YYYY-MM-DD HH:ss:mm') || '',
        cycleEndDate: moment(ed).format('YYYY-MM-DD HH:ss:mm') || ''
      }
      api.getsafetyHiddenTimeAnd(data).then(res => {
        this.hiddenDangerDetails = res.data || []
      })
    },
    //获取时间
    getReportDate(e) {
      this.form.cycleStartDate = e[0]
      this.form.cycleEndDate = e[1]
      if (this.form.cycleStartDate && this.form.cycleEndDate) {
        this.getsafetyHiddenTimeAnds()
      }
    },
    //获得详情
    async getDetail() {
      let res = await api.getcheckDetail(this.id)
      this.form = { ...res.data }
      this.hiddenDangerDetails = this.form.hiddenDangerDetails
      let { cycleEndDate, cycleStartDate } = this.form
      this.reportDate = [moment(cycleStartDate).format('YYYY-MM-DD'), moment(cycleEndDate).format('YYYY-MM-DD')]
    },
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      if (this.hiddenDangerDetails.length === 0) {
        this.$utils.showToast('安全隐患记录不能为空')
        return
      }
      form.hiddenDangerCheckRecordDetailIds = this.hiddenDangerDetails.map(item => item.id).join(',')
      form.cycleEndDate = moment(form.cycleEndDate).format('YYYY-MM-DD HH:ss:mm')
      form.cycleStartDate = moment(form.cycleStartDate).format('YYYY-MM-DD HH:ss:mm')
      this.btnSaveLoadingSave = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? await api.getcheckUpdate(form) : await api.getcheckSave(form)
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
      if (this.hiddenDangerDetails.length === 0) {
        this.$utils.showToast('安全隐患记录不能为空')
        return
      }
      form.hiddenDangerCheckRecordDetailIds = this.hiddenDangerDetails.map(item => item.id).join(',')
      form.cycleEndDate = moment(form.cycleEndDate).format('YYYY-MM-DD HH:ss:mm')
      form.cycleStartDate = moment(form.cycleStartDate).format('YYYY-MM-DD HH:ss:mm')
      this.btnSaveLoading = true
      let num = this.id ? 2 : 1
      this.id && this.status !== '3' ? await api.getcheckUpdateAndSubmit(form) : await api.getcheckSubmit(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoading = false
        this.$utils.goBack(num)
      }, 1000)
    },
    // 隐患删除
    handleDeleteItem(index) {
      //  this.form.currentList.splice(scope.$index, 1)
      this.hiddenDangerDetails.splice(index, 1)
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
