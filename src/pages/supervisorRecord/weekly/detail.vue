<template>
  <view class="main">
    <view class="main-body">
      <!--        <view class="card-title-info">-->
      <!--          <view class="title">监理周报基本信息</view>-->
      <!--        </view>-->
      <uni-card>
        <uni-form-item label="单位工程名称" :border="false" align="left">
          <view>{{ baseInfo.engineeringName }}</view>
        </uni-form-item>
        <uni-form-item label="" style="margin: 0 0 -15px 0; padding-bottom: 0">
          <view v-if="baseInfo.status >= 0">
            <span class="circle" :style="{ backgroundColor: referStatus[baseInfo.status].color }"></span
            >{{ referStatus[baseInfo.status].label }}
          </view>
        </uni-form-item>
        <uni-form-item label="时间" :border="false" align="left">
          <view class="placeholder">{{ `${baseInfo.reportStartDate}~${baseInfo.reportEndDate}` }}</view>
        </uni-form-item>
        <uni-form-item label="签阅人" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.signPersonName }}</view>
        </uni-form-item>
      </uni-card>

      <view class="card-title-outer">
        <view class="title">本周工程进度</view>
      </view>
      <uni-card>
        <block v-for="(item, index) in baseInfo.thisWeekList || []" :key="index">
          <view v-if="index > 0" class="line"></view>
          <uni-form-item label="序号" :border="false" align="left">
            <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
          </uni-form-item>
          <uni-form-item label="工作内容名称" :border="false" align="left">
            <view class="placeholder">{{ item.workContent }}</view>
          </uni-form-item>
          <uni-form-item label="完成情况(%)" :border="false" align="left">
            <view class="placeholder">{{ item.finishSituation }}</view>
          </uni-form-item>
          <uni-form-item label="未完成原因" :border="false" align="left">
            <view class="placeholder">{{ item.unfinishedReason }}</view>
          </uni-form-item>
          <uni-form-item label="负责人" :border="false" align="left">
            <view class="placeholder">{{ item.principal }}</view>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ item.remark }}</view>
          </uni-form-item>
        </block>
      </uni-card>

      <view class="card-title-outer">
        <view class="title">下周工程安排</view>
      </view>
      <uni-card>
        <block v-for="(item, index) in baseInfo.nextWeekList || []" :key="index">
          <view v-if="index > 0" class="line"></view>
          <uni-form-item label="序号" :border="false" align="left">
            <view class="placeholder">{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
          </uni-form-item>
          <uni-form-item label="工作内容名称" :border="false" align="left">
            <view class="placeholder">{{ item.workContent }}</view>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left">
            <view class="placeholder">{{ item.remark }}</view>
          </uni-form-item>
        </block>
      </uni-card>

      <uni-card>
        <uni-form-item label="本周现场大事记" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.breakingNews }}</view>
        </uni-form-item>
        <uni-form-item label="本周安全问题反馈" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.safetyIssueFeedback }}</view>
        </uni-form-item>
        <uni-form-item label="本周工程照片" :border="false">
          <uni-attachment v-model="baseInfo.engineeringImgIds"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="监理周报附件" :border="false">
          <uni-attachment v-model="baseInfo.fileIds"></uni-attachment>
        </uni-form-item>
      </uni-card>
      <block v-if="baseInfo.status === 1">
        <uni-card title="签阅结果">
          <uni-form-item label="总监理工程师签阅意见" :border="false">{{ baseInfo.signOpinion }}</uni-form-item>
          <uni-form-item label="签阅附件">
            <view><uni-attachment v-model="baseInfo.signFileIds"></uni-attachment></view>
          </uni-form-item>
        </uni-card>
      </block>
      <block v-if="baseInfo.signPersonId === $store.state.user.userId && baseInfo.status === 0">
        <uni-card title="签阅信息">
          <uni-form-custom ref="form" :rules="rules" :model="form">
            <!--            <view class="card-header">签阅信息</view>-->
            <view>
              <uni-form-item
                label="总监理工程师签阅意见"
                type="textarea"
                prop="signOpinion"
                align="left"
                class="block-item"
              >
                <textarea v-model.trim="form.signOpinion" :maxlength="200" placeholder="请输入备注信息" auto-height />
              </uni-form-item>
              <uni-form-item class="file-item" label="签阅附件">
                <uni-attachment v-model="form.signFileIds" edit></uni-attachment>
              </uni-form-item>
            </view>
          </uni-form-custom>
          <view class="btn-wrapper">
            <button
              v-if="baseInfo.signPersonId === $store.state.user.userId && baseInfo.status === 0"
              class="button"
              type="primary"
              :loading="loading"
              @click="handleSubmit"
            >
              签阅
            </button>
          </view>
        </uni-card>
      </block>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/supervisorRecord'
import referStatus from '../lib/referStatus'
import api from '@/api/supervisorRecord'

export default {
  data() {
    return {
      id: '',
      isDraft: true, //是否签阅
      baseInfo: {},
      referStatus,
      showBarOperate: false,
      loading: false,
      status: '',
      form: {},
      rules: {
        signOpinion: [{ required: true, message: '请填写总监理工程师签阅意见' }]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
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
  methods: {
    init() {
      // 通过请求获取详情
      Api.getWeeklyInfo(this.id).then(res => {
        this.baseInfo = res.data || {}
      })
    },
    //签阅文件提交
    async handleSubmit() {
      try {
        this.loading = true
        await this.$refs.form.validate()
        await api.getWeeklySign({ ...this.form, id: this.id }).then(res => {
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
            this.$utils.toUrl(`/pages/supervisorRecord/weekly/add?id=${this.id}`)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../detail.less';
</style>
