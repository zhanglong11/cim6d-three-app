<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="问题部位">
            <view class="disabled">{{ info.problemArea }}</view>
          </uni-form-item>
          <uni-form-item label="问题描述">
            <view class="disabled">{{ info.problemDesc }}</view>
          </uni-form-item>
          <uni-form-item label="整改人">
            <view class="disabled">{{ info.rectifyPrincipalName }}</view>
          </uni-form-item>
          <uni-form-item label="整改期限">
            <view class="disabled">{{ info.rectifyDeadline | ymd }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片">
            <uni-attachment v-model="info.fileId"></uni-attachment>
          </uni-form-item>
          <block v-if="[1, 2, 3].includes(info.status)">
            <uni-form-item label="检查人">
              <view class="disabled">{{ info.creatorName }}</view>
            </uni-form-item>
            <uni-form-item label="检查时间">
              <view class="disabled">{{ info.inspectTime | ymd }}</view>
            </uni-form-item>
          </block>
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
      <block v-if="$hasPower('SafetyIssueAppRectify') && info.status === 1 && userId === info.rectifyPrincipal">
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="toRectify">整改</button>
        </view>
      </block>
      <block v-if="$hasPower('SafetyIssueAppReview') && info.status === 2">
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="toReview">复查</button>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import Api from '@/pages/safety/api'
import { mapGetters } from 'vuex'
export default {
  name: 'SafetyDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
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
      let res = await Api.getIssueDetailById(this.id)
      this.info = { ...res.data }
    },
    //整改
    toRectify() {
      this.$utils.toUrl(`/pages/safety/issue/rectify?id=${this.id}&rectifyPrincipal=${this.info.rectifyPrincipal}`, 2)
    },
    //复查
    toReview() {
      this.$utils.toUrl(
        `/pages/safety/issue/review?id=${this.id}&rectifyReviewId=${
          this.info.rectifyReviewList[this.info.rectifyReviewList.length - 1].rectifyReviewId
        }`,
        2
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
</style>
