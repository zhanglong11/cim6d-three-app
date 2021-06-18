<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="验收名称">
            <view class="disabled">{{ info.acceptanceName }}</view>
          </uni-form-item>
          <uni-form-item label="计划验收时间">
            <view class="disabled">{{ info.acceptanceDate | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="施工负责人">
            <view class="disabled">{{ info.constructionDirectorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="info.fileIds"></uni-attachment>
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
import Api from '@/pages/quality/api'
import { mapGetters } from 'vuex'
export default {
  name: 'QualityInspectionDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      isCheck: '',
      targetId: '',
      isDraft: true, //是否草稿
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.targetId = options.targetId
    this.isCheck = options.isCheck === 'true'
    this.status = options.status || ''
    this.isDraft = Number(options.status) === 0
    this.init()
  },
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
  onNavigationBarButtonTap(obj) {
    if (obj.type === 'menu' && this.isDraft) {
      this.showMenu()
    }
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
      let res = await Api.getInspectionInfo(this.id)
      this.info = { ...res.data }
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.deleteInspectionById([this.id]).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        }
      })
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
            this.$utils.toUrl(`/pages/quality/inspection/add?id=${this.id}`)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
