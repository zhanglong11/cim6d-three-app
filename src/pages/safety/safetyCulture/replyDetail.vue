<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="工程名称">
            <view class="disabled">{{ form.engineeringName }}</view>
          </uni-form-item>
          <uni-form-item label="检查区域">
            <view class="disabled">{{ form.checkArea }}</view>
          </uni-form-item>
          <uni-form-item label="整改单位">
            <view class="disabled">{{ form.rectificationReplyCompany }}</view>
          </uni-form-item>
          <uni-form-item label="整改期限">
            <view class="disabled">{{ form.rectificationTerm | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="整改通知书编号">
            <view class="disabled">{{ form.rectificationNoticeNo }}</view>
          </uni-form-item>

          <uni-form-item label="需整改内容">
            <view class="disabled">{{ form.rectificationContent }}</view>
          </uni-form-item>
          <uni-form-item label="覆盖周期">
            <view class="disabled"
              >{{ form.cycleStartDate | formatData }}{{ getWeekDay(form.cycleStartDate) }}~{{
                form.cycleEndDate | formatData
              }}{{ getWeekDay(form.cycleEndDate) }}</view
            >
          </uni-form-item>
        </view>
        <block v-for="(item, index) in form.hiddenDangerDetails" :key="index">
          <uni-form-custom :ref="index" :model="item" class="mt20" style="position: relative">
            <uni-card isForm>
              <view class="hdec-top">
                <view class="btn-title">隐患{{ index + 1 }}</view>
                <!-- <view class="btn-delete" @click="handleDeleteItem(index)">删除</view> -->
                <view></view>
              </view>
              <view class="hedc-title">隐患排查</view>
              <uni-form-item label="隐患发现时间">
                <view class="disabled">{{ item.checkDate }}</view>
              </uni-form-item>
              <uni-form-item label="隐患类型" prop="safetyHiddenDangerType">
                <view class="disabled">{{ item.safetyHiddenDangerType }}</view>
              </uni-form-item>
              <uni-form-item label="位置/活动" prop="locationActivity">
                <view class="disabled">{{ item.locationActivity }}</view>
              </uni-form-item>
              <uni-form-item label="存在隐患或问题描述" prop="hiddenDangerProblemDescribe">
                <view class="disabled">{{ item.hiddenDangerProblemDescribe }}</view>
              </uni-form-item>
              <uni-form-item class="file-item" label="隐患照片" prop="hiddenDangerFileIds">
                <uni-attachment v-model="item.hiddenDangerFileIds" uploadType="image"></uni-attachment>
              </uni-form-item>
              <uni-form-item label="依据或建议" prop="basisSuggestion">
                <view class="disabled">{{ item.basisSuggestion }}</view>
              </uni-form-item>
              <view class="hedc-title">隐患整改</view>
              <uni-form-item label="整改人" prop="rectificationPerson">
                <view class="disabled">{{ item.rectificationPerson }}</view>
              </uni-form-item>
              <uni-form-item label="整改措施" prop="rectificationMeasures">
                <view class="disabled">{{ item.rectificationMeasures }}</view>
              </uni-form-item>
              <uni-form-item class="file-item" label="整改后照片" prop="afterRectificationFileIds">
                <uni-attachment v-model="item.afterRectificationFileIds" uploadType="image"></uni-attachment>
              </uni-form-item>
              <view class="hedc-title">整改验收</view>
              <uni-form-item class="file-item" label="是否合格" prop="qualifiedStatus">
                <view class="disabled">{{
                  item.qualifiedStatus !== null ? (item.qualifiedStatus === 0 ? '不合格' : '合格') : ''
                }}</view>
              </uni-form-item>
              <uni-form-item label="验收时间" prop="acceptanceTime">
                <view class="disabled">{{ item.acceptanceTime | formatData }}</view>
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
import moment from 'moment'
export default {
  name: 'ReplyDetail',
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
    getWeekDay(e) {
      let date = moment(e).format('YYYY-MM-DD')
      let dt = new Date(date.split('-')[0], date.split('-')[1] - 1, (date = date.split('-')[2]))
      let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekDay[dt.getDay()]
    },
    //初始化页面参数
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = await Api.getReplyDetail(this.id)
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
