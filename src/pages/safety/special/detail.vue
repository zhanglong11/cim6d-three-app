<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="工种">
            <view class="disabled">{{ $getLabel(workTypeList, info.workType) }}</view>
          </uni-form-item>
          <uni-form-item label="施工部位">
            <view class="disabled">{{ info.constructionArea }}</view>
          </uni-form-item>
          <uni-form-item label="作业类型/内容">
            <view class="disabled">{{ info.taskContentType }}</view>
          </uni-form-item>
          <uni-form-item label="施工负责人">
            <view class="disabled">{{ info.constructionMangerName }}</view>
          </uni-form-item>
          <uni-form-item label="计划起始日期">
            <view class="disabled">{{ info.planStartDate | ymd }}~{{ info.planEndDate | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="安全防护措施">
            <view class="disabled">{{ info.safetyPrecautions }}</view>
          </uni-form-item>
          <uni-form-item label="创建人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="现场照片">
            <uni-attachment v-model="info.fileId"></uni-attachment>
          </uni-form-item>
        </view>
      </view>
      <!-- 通用审批 start -->
      <uni-common-check-flow :id="id" />
      <!-- 通用审批 end -->
    </view>
  </view>
</template>

<script>
import Api from '@/pages/safety/api'
import { mapGetters } from 'vuex'
export default {
  name: 'SafetySpecialDetail',
  components: {},
  data() {
    return {
      info: {},
      isDraft: true, //是否草稿
      status: '',
      id: '',
      isCheck: '',
      targetId: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId']),
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || []
    }
  },
  onLoad(options) {
    this.id = options.id
    this.targetId = options.targetId
    this.isCheck = options.isCheck === 'true'
    this.status = options.status || ''
    this.isDraft = Number(options.status) === 0
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    console.log(444, obj)
    if (obj.type === 'menu' && this.isDraft) {
      this.showMenu()
    }
  },
  onShow() {},
  onReady() {
    // 非草稿状态隐藏顶部更多操作
    // #ifdef  APP-PLUS
    if (!this.isDraft) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '',
        fontSize: 0
      })
    }
    // #endif
  },
  mounted() {},
  methods: {
    //初始化页面参数
    init() {
      this.getDetail()
    },
    // 草稿状态的报修项展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/safety/special/add?id=${this.id}`)
          }
        }
      })
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.deleteSpecialById([this.id]).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        }
      })
    },
    //获取详情
    async getDetail() {
      let res = await Api.getSpecialDetail(this.id)
      this.info = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
</style>
