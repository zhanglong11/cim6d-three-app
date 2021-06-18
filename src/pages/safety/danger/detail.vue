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
            <view class="disabled">{{ info.remark }}</view>
          </uni-form-item>
          <uni-form-item label="创建人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="info.fileId"></uni-attachment>
          </uni-form-item>
        </view>
      </view>
      <p class="title-p">所在位置</p>
      <block v-for="(item, index) in info.placeList" :key="index">
        <uni-form-custom :ref="index" :model="item" class="mt20">
          <uni-card isForm>
            <div slot="title" class="card-title">
              <div>序号{{ index + 1 }}</div>
            </div>
            <uni-form-item label="所在位置" prop="placeName">
              <view class="disabled">{{ item.placeName }}</view>
            </uni-form-item>
            <uni-form-item label="危险源时效性(开始)" prop="timelinessStartTime">
              <view class="disabled">{{ item.timelinessStartTime | ymd }}</view>
            </uni-form-item>
            <uni-form-item label="危险源时效性(结束)" prop="timelinessEndTime">
              <view class="disabled">{{ item.timelinessEndTime | ymd }}</view>
            </uni-form-item>
            <uni-form-item label="责任人" prop="principal">
              <view class="disabled">{{ item.principalName }}</view>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
      </block>
    </view>
  </view>
</template>

<script>
import Api from '@/pages/safety/api'
import { mapGetters } from 'vuex'
export default {
  name: 'SafetyDangerDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      isLoading: false
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
      let res = await Api.getDangerDetail(this.id)
      this.info = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
</style>
