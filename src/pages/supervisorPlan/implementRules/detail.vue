<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <uni-form-item label="监理实施细则名称">
          <view class="placeholder">{{ detailInfo.name }}</view>
        </uni-form-item>
        <uni-form-item label="编制人">
          <view class="placeholder">{{ detailInfo.writer }}</view>
        </uni-form-item>
        <uni-form-item label="编制日期">
          <view class="placeholder">{{ detailInfo.writerDateStr }}</view>
        </uni-form-item>
        <uni-form-item label="适用范围">
          <view class="placeholder">{{ detailInfo.applyRange }}</view>
        </uni-form-item>
        <uni-form-item label="监理实施细则备注">
          <view class="placeholder">{{ detailInfo.remark }}</view>
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="detailInfo.fileIds"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="创建人">
          <view class="placeholder">{{ detailInfo.creatorStr }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <view class="placeholder">{{ detailInfo.createTime }}</view>
        </uni-form-item>
      </uni-card>

      <block v-if="detailInfo.status !== 1 && detailInfo.status !== 0">
        <uni-card title="审核结果">
          <uni-form-item label="审核结果" :border="false">
            <view>{{ ['不通过', '通过'][detailInfo.auditStatus] }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false">
            <view>{{ detailInfo.auditPerson }}</view>
          </uni-form-item>
          <uni-form-item label="审核意见">
            <view>{{ detailInfo.auditOpinion }}</view>
          </uni-form-item>
          <uni-form-item label="审核日期" :border="false">
            <view>{{ detailInfo.auditTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </block>
      <block v-if="detailInfo.status === 1 && $store.state.user.userId !== detailInfo.creator">
        <uni-card isForm>
          <uni-form-custom ref="form" :model="form" :rules="rules">
            <uni-form-item label="审核结果" isLink isRequired prop="auditStatus">
              <view @click="handleResultItemClick">{{ IsCheckText || '点击选择' }}</view>
            </uni-form-item>
            <uni-form-item label="审核意见" prop="auditOpinion">
              <textarea v-model.trim="form.auditOpinion" :maxlength="-1" auto-height placeholder="点击输入" />
            </uni-form-item>
          </uni-form-custom>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="handleCheck">审核</button>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import Api from './api'
import WorkFlowApi from '@/api/work-flow'
export default {
  data() {
    return {
      detailInfo: {},
      form: {},
      rules: {
        auditStatus: { required: true }
      },
      isDraft: true, //是否草稿
      // 审核是否合格：
      IsCheck: [
        { name: '通过', value: 1 },
        { name: '驳回', value: 2 }
      ],
      //检查结果是否合格
      IsCheckText: '',
      isLoading: false
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    this.isDraft = Number(options.status) === 0
    if (this.id) {
      this.init()
    }
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
    if (obj.type === 'menu') {
      this.showMenu()
    }
  },
  methods: {
    // 获取监理实施细则详情
    init() {
      Api.getImplementRulesDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 删除
    handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除该数据吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中' })
            Api.deleteImplementRules(this.id).then(res => {
              uni.hideLoading()
              this.$utils.goBack()
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    // 展示更多操作：编辑和删除
    showMenu() {
      uni.showActionSheet({
        itemList: ['编辑', '删除'],
        success: res => {
          let index = res.tapIndex
          if (index === 1) {
            this.handleDelete()
          } else if (index === 0) {
            this.$utils.toUrl(`/pages/supervisorPlan/implementRules/add?id=${this.id}`)
          }
        }
      })
    },
    // 选择审核结果
    handleResultItemClick() {
      let vm = this
      let itemList = (this.IsCheck || []).map(item => {
        return item.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: function (res) {
          let selectItem = vm.IsCheck[res.tapIndex] || {}
          vm.IsCheckText = selectItem.name
          vm.form.auditStatus = selectItem.value
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    // 审核操作
    async handleCheck() {
      await this.$refs.form.validate()
      this.isLoading = true
      WorkFlowApi.completeTask(this.id, { flag: this.form.auditStatus, remark: this.form.auditOpinion }).then(
        res => {
          this.$utils.showToast('审核成功')
          setTimeout(() => {
            this.isLoading = false
            this.$utils.goBack()
          }, 1000)
        },
        err => {
          this.isLoading = false
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
</style>
