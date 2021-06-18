<template>
  <view class="main">
    <view class="main-body">
      <view class="card-title-info">
        <view class="title">
          <view class="title-font">监理周报</view>
          <view v-if="baseInfo.status >= 0" style="text-align: right">
            <span class="circle" :style="{ backgroundColor: referStatus[baseInfo.status].color }"></span
            >{{ referStatus[baseInfo.status].label }}
          </view>
        </view>
      </view>

      <uni-card>
        <uni-form-item label="周报所属日期：" :border="false" align="left">
          <view class="placeholder"
            >{{ baseInfo.reportStartDate | formatData }}~{{ baseInfo.reportEndDate | formatData }}</view
          >
        </uni-form-item>
        <uni-form-item label="周报编号：" :border="false" align="left">
          <view>{{ baseInfo.code }}</view>
        </uni-form-item>
        <uni-form-item label="单位工程名称：" :border="false" align="left">
          <view>{{ baseInfo.unitProjectName }}</view>
        </uni-form-item>
        <uni-form-item label="填写人：" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="提交时间：" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.createTime }}</view>
        </uni-form-item>
      </uni-card>

      <view class="card-title-outer">
        <view class="title">本周工程进度</view>
      </view>
      <uni-card>
        <block v-for="(item, index) in baseInfo.currentList || []" :key="index">
          <view v-if="index > 0" class="line"></view>
          <uni-form-item label="工程进度：" :border="false" align="left">
            <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
          </uni-form-item>
          <uni-form-item label="工作内容名称：" :border="false" align="left">
            <view class="placeholder">{{ item.content }}</view>
          </uni-form-item>
          <uni-form-item label="完成情况(%)：" :border="false" align="left">
            <view class="placeholder">{{ item.completion }}</view>
          </uni-form-item>
          <uni-form-item label="未完成原因：" :border="false" align="left">
            <view class="placeholder">{{ item.notFinishedReason }}</view>
          </uni-form-item>
          <uni-form-item label="负责人：" :border="false" align="left">
            <view class="placeholder">{{ item.directorName }}</view>
          </uni-form-item>
          <uni-form-item label="备注：" :border="false" align="left">
            <view class="placeholder">{{ item.remark }}</view>
          </uni-form-item>
        </block>
      </uni-card>

      <view class="card-title-outer">
        <view class="title">下周工程安排</view>
      </view>
      <uni-card>
        <block v-for="(item, index) in baseInfo.nextList || []" :key="index">
          <view v-if="index > 0" class="line"></view>
          <uni-form-item label="工程安排：" :border="false" align="left">
            <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
          </uni-form-item>
          <uni-form-item label="工作内容名称：" :border="false" align="left">
            <view class="placeholder">{{ item.content }}</view>
          </uni-form-item>
          <uni-form-item label="备注：" :border="false" align="left">
            <view class="placeholder">{{ item.remark }}</view>
          </uni-form-item>
        </block>
      </uni-card>

      <uni-card>
        <uni-form-item label="本周现场大事记：" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.sceneMemorabilia }}</view>
        </uni-form-item>
        <uni-form-item label="本周质量问题反馈：" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.qualityProblem }}</view>
        </uni-form-item>
        <uni-form-item label="本周安全问题反馈：" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.safetyProblem }}</view>
        </uni-form-item>
        <uni-form-item label="本周工程照片上传：" :border="false">
          <uni-attachment v-model="baseInfo.engineeringPhotoFileIds"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="监理周报附件：" :border="false">
          <uni-attachment v-model="baseInfo.fileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
      <block v-if="baseInfo.status === 1">
        <uni-card title="签阅结果">
          <uni-form-item label="签阅意见：" :border="false" align="left">{{ baseInfo.signComments }}</uni-form-item>
          <uni-form-item label="签阅人：" :border="false" align="left">{{ baseInfo.signerName }}</uni-form-item>
          <uni-form-item label="签阅附件：" align="left">
            <view><uni-attachment v-model="baseInfo.signFileIds"></uni-attachment></view>
          </uni-form-item>
        </uni-card>
      </block>
      <block v-if="baseInfo.signer === $store.state.user.userId && baseInfo.status === 0">
        <uni-card title="签阅">
          <uni-form-custom ref="form" :rules="rules" :model="form">
            <!--            <view class="card-header">签阅信息</view>-->
            <view>
              <uni-form-item label="签阅意见：" type="textarea" prop="signComments" align="left" class="block-item">
                <textarea v-model.trim="form.signComments" :maxlength="200" placeholder="请输入信息" auto-height />
              </uni-form-item>
              <uni-form-item class="file-item" label="签阅附件：">
                <uni-attachment v-model="form.signFileIds" edit></uni-attachment>
              </uni-form-item>
            </view>
          </uni-form-custom>
          <view class="btn-wrapper">
            <button
              v-if="baseInfo.signer === $store.state.user.userId && baseInfo.status === 0"
              class="button"
              type="primary"
              :loading="loading"
              @click="handleSubmit"
            >
              提交
            </button>
          </view>
        </uni-card>
      </block>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import referStatus from '../lib/referStatus'

export default {
  data() {
    return {
      id: '',
      isDraft: false, //是否签阅
      baseInfo: {},
      referStatus,
      showBarOperate: false,
      loading: false,
      status: '',
      form: {},
      rules: {
        signComments: [{ required: true, message: '请填写签阅意见' }]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.status = options.status || ''
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
  // onNavigationBarButtonTap(obj) {
  //   if (obj.type === 'menu' && this.isDraft) {
  //     this.showMenu()
  //   }
  // },
  methods: {
    init() {
      // 通过请求获取详情
      Api.getWeeklyInfo(this.id).then(res => {
        this.baseInfo = res.data || {}
        this.baseInfo.signStatus = this.signStatus
      })
    },
    //签阅文件提交
    async handleSubmit() {
      try {
        this.loading = true
        await this.$refs.form.validate()
        await Api.getWeeklySign({ ...this.form, id: this.id }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.$utils.showToast('签阅成功')
            this.$utils.goBack()
          } else {
            this.$utils.showToast('签阅失败')
          }
        })
      } catch (e) {
        this.loading = false
      }
    },
    //未签阅状态下 进行删除
    handleDelete() {
      Api.getWeeklyDelete([this.id]).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        }
      })
    },
    // 未签阅状态的报修项展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/decoration/decorationSupervisor/supervisorWeekly/add?id=${this.id}`)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import 'detail.less';
</style>
