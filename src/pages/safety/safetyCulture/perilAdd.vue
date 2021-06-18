<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="mt20">
        <uni-card isForm>
          <uni-form-item label="检查日期" prop="checkDate" isRequired>
            <uni-date-picker v-model="form.checkDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="检查组长" prop="checkGroupLeader" isRequired>
            <textarea v-model.trim="form.checkGroupLeader" auto-height placeholder="请输入检查组长" />
          </uni-form-item>
          <uni-form-item label="检查组员" prop="checkGroupMembers" isRequired>
            <textarea v-model.trim="form.checkGroupMembers" auto-height placeholder="请输入检查组员" />
          </uni-form-item>
          <uni-form-item label="建设单位" prop="buildCompany" isRequired>
            <textarea v-model.trim="form.buildCompany" auto-height placeholder="请输入建设单位" />
          </uni-form-item>
          <uni-form-item label="施工单位" prop="constructionCompany" isRequired>
            <textarea v-model.trim="form.constructionCompany" auto-height placeholder="请输入施工单位" />
          </uni-form-item>
          <!-- <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item> -->
          <uni-form-item label="监理单位" prop="supervisionCompany" isRequired>
            <textarea v-model.trim="form.supervisionCompany" auto-height placeholder="请输入监理单位" />
          </uni-form-item>
        </uni-card>

        <block v-for="(item, index) in form.details" :key="index">
          <uni-form-custom :ref="index" :model="item" :rules="subRules" class="mt20" style="position: relative">
            <!-- <view style="position: absolute; top: -20rpx; right: 8rpx; z-index: 2; text-align: center">
              <uni-icons class="icon" color="#f00" type="clear" size="24" @click="handleDeleteItem(index)"> </uni-icons>
            </view> -->
            <uni-card isForm>
              <view class="hdec-top">
                <view class="btn-title">隐患{{ index + 1 }}</view>
                <view class="btn-delete" @click="handelDelete(index)">删除</view>
              </view>
              <view class="hedc-title">隐患排查</view>
              <uni-form-item label="隐患类型" prop="safetyHiddenDangerType" isRequired>
                <textarea v-model.trim="item.safetyHiddenDangerType" auto-height placeholder="请输入隐患类型" />
              </uni-form-item>
              <uni-form-item label="位置/活动" prop="locationActivity" isRequired>
                <textarea v-model.trim="item.locationActivity" auto-height placeholder="请输入位置/活动" />
              </uni-form-item>
              <uni-form-item label="存在隐患或问题描述" prop="hiddenDangerProblemDescribe" isRequired>
                <textarea
                  v-model.trim="item.hiddenDangerProblemDescribe"
                  auto-height
                  placeholder="请输入存在隐患或问题描述"
                />
              </uni-form-item>
              <uni-form-item class="file-item" label="隐患照片" prop="hiddenDangerFileIds" isRequired>
                <uni-attachment v-model="item.hiddenDangerFileIds" uploadType="image" edit></uni-attachment>
              </uni-form-item>
              <uni-form-item label="依据或建议" prop="basisSuggestion" isRequired>
                <textarea v-model.trim="item.basisSuggestion" auto-height placeholder="请输入依据或建议" />
              </uni-form-item>
              <view class="hedc-title">隐患整改</view>
              <uni-form-item label="整改人" prop="rectificationPerson">
                <textarea v-model.trim="item.rectificationPerson" auto-height placeholder="请输入整改人" />
              </uni-form-item>
              <uni-form-item label="整改措施" prop="rectificationMeasures">
                <textarea v-model.trim="item.rectificationMeasures" auto-height placeholder="请输入整改措施" />
              </uni-form-item>
              <uni-form-item class="file-item" label="整改后照片" prop="afterRectificationFileIds">
                <uni-attachment v-model="item.afterRectificationFileIds" uploadType="image" edit></uni-attachment>
              </uni-form-item>
              <view class="hedc-title">整改验收</view>
              <uni-form-item class="file-item" label="是否合格" prop="qualifiedStatus">
                <uni-select v-model="item.qualifiedStatus" :options="quaStatus"></uni-select>
              </uni-form-item>
              <uni-form-item label="验收时间" prop="acceptanceTime">
                <uni-date-picker v-model="item.acceptanceTime" fields="day" mode="date"></uni-date-picker>
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
        <view style="text-align: center">
          <view class="btn-add" @click="handleAddItem">新增隐患</view>
          <!-- <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAdd"> </uni-icons> -->
        </view>
      </uni-form-custom>

      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="btnSaveLoading" @click="saveCaoGao()">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import api from '../api'
import moment from 'moment'
import { quaStatus } from '../lib/issueStatusList'
export default {
  components: {},
  data() {
    return {
      //申请到货日期
      id: '',
      quaStatus,
      form: {
        checkDate: moment(new Date()).format('YYYY-MM-DD'),
        buildCompany: '深圳特区建设发展集团有限公司',
        constructionCompany: '中交天津航道局有限公司',
        supervisionCompany: '广州华申监理有限公司',
        details: [
          {
            locationActivity: '',
            hiddenDangerProblemDescribe: '',
            hiddenDangerFileIds: '',
            basisSuggestion: '',
            rectificationPerson: '',
            rectificationMeasures: '',
            afterRectificationFileIds: '',
            qualifiedStatus: '',
            acceptanceTime: ''
          }
        ] //安全隐患
      },
      rules: {
        checkDate: { required: true },
        checkGroupLeader: { required: true },
        checkGroupMembers: { required: true },
        buildCompany: { required: true },
        constructionCompany: { required: true },
        supervisionCompany: { required: true }
      },
      subRules: {
        safetyHiddenDangerType: { required: true },
        locationActivity: { required: true },
        hiddenDangerProblemDescribe: { required: true },
        hiddenDangerFileIds: { required: true },
        basisSuggestion: { required: true }
      },
      isSave: false, // 是否保存,
      btnSaveLoading: false,
      btnSaveLoadingSave: false
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
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
      let res = await api.getsafetyHiddenDetail(this.id)
      this.form = { ...res.data }
    },
    // 保存
    async saveCaoGao() {
      await this.$refs.form.validate()
      if (this.form.details.length <= 0) {
        return this.$utils.showToast('至少添加一个隐患问题')
      }
      await Promise.all(
        this.form.details.map((item, index) => {
          return this.$refs[index][0].validate()
        })
      )
      const form = _.cloneDeep(this.form)
      form.checkDate = moment(form.checkDate).format('YYYY-MM-DD HH:00:00')
      this.btnSaveLoading = true
      let num = this.id ? 2 : 1
      this.id ? await api.getsafetyHiddenUpdate(form) : await api.getsafetyHiddenSave(form)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.btnSaveLoading = false
        this.$utils.goBack(num)
      }, 1000)
    },
    // 移除
    handelDelete(index) {
      this.form.details.splice(index, 1)
    },
    handleAddItem() {
      this.form.details.push({
        locationActivity: '',
        hiddenDangerProblemDescribe: '',
        hiddenDangerFileIds: '',
        basisSuggestion: '',
        rectificationPerson: '',
        rectificationMeasures: '',
        afterRectificationFileIds: '',
        qualifiedStatus: '',
        acceptanceTime: ''
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
