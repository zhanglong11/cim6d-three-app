<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="危险源名称">
            <view class="disabled">{{ info.dangerSource }}</view>
          </uni-form-item>
          <uni-form-item label="伤害类型">
            <view class="disabled">{{ $getLabel(harmTypeList, info.harmCategory) }}</view>
          </uni-form-item>
          <uni-form-item label="防范措施">
            <view class="disabled">{{ info.precautionaryMeasure }}</view>
          </uni-form-item>
          <uni-form-item label="备注">
            <view class="disabled">{{ info.dangerSourceRemark }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="info.fileId"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="检查结果">
            <view class="disabled">{{ ['不合格', '合格'][info.firstInspectStatus] }}</view>
          </uni-form-item>
          <uni-form-item label="检查人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="检查时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
        </view>
        <block v-for="(item, index) in info.rectifyReviewList" :key="index">
          <uni-card v-if="item.rectifyReviewFlag === 0" isForm>
            <div slot="title" class="card-title">
              <div>整改</div>
            </div>
            <uni-form-item label="整改方法">
              <view class="disabled">{{ item.rectifyContent }}</view>
            </uni-form-item>
            <uni-form-item label="整改人">
              <view class="disabled">{{ item.rectifyPrincipalName }}</view>
            </uni-form-item>
            <uni-form-item label="整改时间">
              <view class="disabled">{{ item.rectifyTime }}</view>
            </uni-form-item>
            <uni-form-item class="file-item" label="现场照片">
              <uni-attachment v-model="item.rectifyFileId"></uni-attachment>
            </uni-form-item>
          </uni-card>
          <uni-card v-if="item.rectifyReviewFlag === 1" isForm>
            <div slot="title" class="card-title">
              <div>复查</div>
            </div>
            <uni-form-item label="复查结果">
              <view class="disabled">{{ ['不合格', '合格'][item.reviewResult] }}</view>
            </uni-form-item>
            <uni-form-item v-if="item.reviewResult === 0" label="复查意见">
              <view class="disabled">{{ item.reviewOpinion }}</view>
            </uni-form-item>
            <uni-form-item label="复查人">
              <view class="disabled">{{ item.reviewPrincipalName }}</view>
            </uni-form-item>
            <uni-form-item label="复查时间">
              <view class="disabled">{{ item.reviewTime }}</view>
            </uni-form-item>
            <uni-form-item class="file-item" label="现场照片">
              <uni-attachment v-model="item.reviewFileId"></uni-attachment>
            </uni-form-item>
          </uni-card>
        </block>
      </view>
      <block
        v-if="$hasPower('SafetyDangerCheckRectifyAppRectify') && info.status === 1 && userId === info.rectifyPrincipal"
      >
        <uni-form-custom ref="rectifyForm" :model="rectifyForm" :rules="rectifyFormRules">
          <uni-card isForm>
            <uni-form-item label="整改方法" prop="rectifyContent">
              <textarea
                v-model.trim="rectifyForm.rectifyContent"
                :maxlength="-1"
                placeholder="请输入整改方法"
                auto-height
              />
            </uni-form-item>
            <uni-form-item class="file-item" label="现场照片" prop="rectifyFileId">
              <uni-attachment v-model="rectifyForm.rectifyFileId" uploadType="image" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
          <view class="btn-wrapper">
            <button
              class="button"
              :loading="isLoading"
              :disabled="isLoading"
              type="primary"
              @click="handleRectifySubmit"
            >
              整改
            </button>
          </view>
        </uni-form-custom>
      </block>
      <block v-if="$hasPower('SafetyDangerCheckRectifyAppReview') && info.status === 2">
        <uni-form-custom ref="reviewForm" :model="reviewForm" :rules="reviewFormRules">
          <uni-card isForm>
            <uni-form-item label="复查结果" isLink prop="reviewResult">
              <uni-select v-model="reviewForm.reviewResult" :options="optionList"></uni-select>
            </uni-form-item>
            <uni-form-item class="file-item" label="现场照片" prop="reviewFileId">
              <uni-attachment v-model="reviewForm.reviewFileId" uploadType="image" edit></uni-attachment>
            </uni-form-item>
            <uni-form-item v-if="reviewForm.reviewResult === 0" label="复查意见" prop="reviewOpinion">
              <textarea
                v-model.trim="reviewForm.reviewOpinion"
                :maxlength="-1"
                placeholder="请输入复查意见"
                auto-height
              />
            </uni-form-item>
          </uni-card>
          <view class="btn-wrapper">
            <button
              class="button"
              :loading="isLoading"
              :disabled="isLoading"
              type="primary"
              @click="handleReviewSubmit"
            >
              复查
            </button>
          </view>
        </uni-form-custom>
      </block>
    </view>
  </view>
</template>

<script>
import Api from '@/pages/safety/api'
import { mapGetters } from 'vuex'
export default {
  name: 'SafetyDangerCheckDetail',
  components: {},
  data() {
    return {
      info: {},
      optionList: [
        { label: '不合格', value: 0 },
        { label: '合格', value: 1 }
      ],
      id: '',
      isLoading: false,
      checkForm: { firstInspectStatus: null, fileId: '', remark: '' },
      checkFormRules: {},
      rectifyForm: {},
      rectifyFormRules: {
        rectifyContent: { required: true },
        rectifyFileId: { required: true }
      },
      reviewForm: {},
      reviewFormRules: {
        reviewResult: { required: true },
        reviewFileId: { required: true },
        reviewOpinion: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['userId']),
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {},
  mounted() {},
  methods: {
    //初始化页面参数
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = await Api.getDangerInspectDetail(this.id)
      this.info = { ...res.data }
    },
    //检查保存
    async handleCheckSubmit() {
      await this.$refs.checkForm.validate()
      await Api.addDangerInspect({
        ...this.checkForm,
        dangerSourceId: this.form.dangerSourceId,
        projectId: this.projectId
      })
    },
    //整改保存
    async handleRectifySubmit() {
      await this.$refs.rectifyForm.validate()
      await Api.handleDangerRectify({
        ...this.rectifyForm,
        inspectRecordId: this.id,
        rectifyPrincipal: this.info.rectifyPrincipal
      })
      this.$utils.showToast('整改成功')
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    },
    //复查保存
    async handleReviewSubmit() {
      await this.$refs.reviewForm.validate()
      await Api.handleDangerReview({
        ...this.reviewForm,
        inspectRecordId: this.id,
        reviewPrincipal: this.info.creator,
        id: this.info.rectifyReviewList[this.info.rectifyReviewList.length - 1].rectifyReviewId
      })
      this.$utils.showToast('提交成功')
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
@import url('~@/pages/quality/add.less');
</style>
