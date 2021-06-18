<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="工程名称">
            <view class="disabled">{{ form.engineeringName }}</view>
          </uni-form-item>
          <uni-form-item label="回复单位">
            <view class="disabled">{{ form.rectificationReplyCompany }}</view>
          </uni-form-item>
          <uni-form-item label="具体内容">
            <view class="disabled">{{ form.concreteContent }}</view>
          </uni-form-item>
          <uni-form-item label="附件">
            <uni-attachment v-model="form.fileIds"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="回复文件">
            <view class="disabled">{{ form.replyFile }}</view>
          </uni-form-item>
        </view>
        <block v-for="(item, index) in form.details" :key="index">
          <uni-form-custom :ref="index" :model="item" class="mt20" style="position: relative">
            <uni-card isForm>
              <view class="hdec-top">
                <view class="btn-title">问题{{ index + 1 }}</view>
                <view></view>
              </view>
              <uni-form-item label="问题描述">
                <view class="disabled">{{ item.problemDescribe }}</view>
              </uni-form-item>
              <uni-form-item label="整改情况">
                <view class="disabled">{{ item.rectificationSituation }}</view>
              </uni-form-item>
            </uni-card>
          </uni-form-custom>
        </block>
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
  name: 'RectifyDetail',
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
      let res = await Api.getrectifyDetail(this.id)
      this.form = { ...res.data }
    },
    //草稿状态下 进行删除
    handleDelete() {
      Api.getsafetyHiddenDelete([this.id]).then(res => {
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
                //安全隐患检查
                this.$utils.toUrl(`/pages/safety/safetyCulture/perilAdd?id=${this.id}`)
              } else if (this.type === '2') {
                //周安全检查回复表
                this.$utils.toUrl(`/pages/safety/safetyCulture/replyAdd?id=${this.id}&status=${this.status}`)
              } else if (this.type === '3') {
                //安全月度联合检查回复表
                this.$utils.toUrl(`/pages/safety/safetyCulture/checkAdd?id=${this.id}&status=${this.status}`)
              } else if (this.type === '4') {
                //质量安全整改回复单
                this.$utils.toUrl(`/pages/safety/safetyCulture/rectifyAdd?id=${this.id}&status=${this.status}`)
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
                //安全隐患检查
                this.$utils.toUrl(`/pages/safety/safetyCulture/perilAdd?id=${this.id}`)
              } else if (this.type === '2') {
                //周安全检查回复表
                this.$utils.toUrl(`/pages/safety/safetyCulture/replyAdd?id=${this.id}`)
              } else if (this.type === '3') {
                //安全月度联合检查回复表
                this.$utils.toUrl(`/pages/safety/safetyCulture/checkAdd?id=${this.id}`)
              } else if (this.type === '4') {
                //质量安全整改回复单
                this.$utils.toUrl(`/pages/safety/safetyCulture/rectifyAdd?id=${this.id}`)
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
  .disabled {
    color: #a0a0a0;
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
