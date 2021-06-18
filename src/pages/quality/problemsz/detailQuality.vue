<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="通知日期" prop="noticeDate">
            <view class="disabled">{{ form.noticeDate | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="工程名称" prop="engineeringName">
            <view class="disabled">{{ form.engineeringName }}</view>
          </uni-form-item>
          <uni-form-item label="编号" prop="qualityProblemCode">
            <view class="disabled">{{ form.qualityProblemCode }}</view>
          </uni-form-item>
          <uni-form-item label="协作单位" prop="collaborationCompany">
            <view class="disabled">{{ form.collaborationCompany }}</view>
          </uni-form-item>
          <uni-form-item label="施工内容" prop="constructionContent">
            <view class="disabled">{{ form.constructionContent }}</view>
          </uni-form-item>
          <uni-form-item label="通知单位" prop="noticeContactCompany">
            <view class="disabled">{{ form.noticeContactCompany }}</view>
          </uni-form-item>
          <uni-form-item label="现场问题" prop="siteProblem">
            <view class="disabled">{{ form.siteProblem }}</view>
          </uni-form-item>
          <uni-form-item label="整改要求" prop="rectificationRequirements">
            <view class="disabled">{{ form.rectificationRequirements }}</view>
          </uni-form-item>
          <uni-form-item label="施工单位" prop="constructionCompany">
            <view class="disabled">{{ form.constructionCompany }}</view>
          </uni-form-item>
          <uni-form-item label="发起时间" prop="startDate">
            <view class="disabled">{{ form.startDate | formatData }}</view>
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
import Api from '../api'
import { mapGetters } from 'vuex'
export default {
  name: 'QualityDetail',
  components: {},
  data() {
    return {
      form: {},
      id: '',
      isCheck: '',
      targetId: '',
      isDraft: true, //是否草稿
      isLoading: false,
      type: '',
      status: ''
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    console.log(options)
    this.id = options.id
    this.targetId = options.targetId
    this.isCheck = options.isCheck === 'true'
    this.status = options.status || ''
    this.type = options.type
    this.isDraft = Number(options.status) === 0 || Number(options.status) === 3
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
      let res = await Api.getEngineeringDetail(this.id)
      this.form = { ...res.data }
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.getQualityProblemDelete([this.id]).then(res => {
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
      if (this.status === '3') {
        uni.showActionSheet({
          itemList: ['再次发起'],
          success: res => {
            let index = res.tapIndex
            if (index === 1) {
              // this.handleDelete()
            } else if (index === 0) {
              if (this.type === '1') {
                //工程质量通知
                this.$utils.toUrl(`/pages/quality/problemsz/addQuality?id=${this.id}&status=${this.status}`)
              } else if (this.type === '2') {
                //工程业务联系单
                this.$utils.toUrl(`/pages/quality/problemsz/addProject?id=${this.id}&status=${this.status}`)
              } else if (this.type === '3') {
                //工作业务联系
                this.$utils.toUrl(`/pages/quality/problemsz/addWork?id=${this.id}&status=${this.status}`)
              }
            }
          }
        })
      } else {
        uni.showActionSheet({
          itemList: ['编辑', '删除'],
          success: res => {
            let index = res.tapIndex
            if (index === 1) {
              this.handleDelete()
            } else if (index === 0) {
              if (this.type === '1') {
                // this.$utils.toUrl(`/pages/quality/inspection/add?id=${this.id}`)
                //工程质量通知
                this.$utils.toUrl(`/pages/quality/problemsz/addQuality?id=${this.id}`)
              } else if (this.type === '2') {
                //工程业务联系单
                this.$utils.toUrl(`/pages/quality/problemsz/addProject?id=${this.id}`)
              } else if (this.type === '3') {
                //工作业务联系
                this.$utils.toUrl(`/pages/quality/problemsz/addWork?id=${this.id}`)
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/common.less';
.main {
  padding-top: 0;
  .main-header {
    overflow: hidden;
    border-radius: 30px;
    font-size: 13px;
    display: block;
    background-color: #fff;
    line-height: 48px;
    padding: 25px 0 5px;
  }

  .card {
    width: 100%;
    margin-top: 25px;
    .disabled {
      color: #a0a0a0;
    }
  }
}
</style>
