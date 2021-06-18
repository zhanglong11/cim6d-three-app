<template>
  <view class="main">
    <view class="main-body">
      <!--        <view class="card-title-info">-->
      <!--          <view class="title">监理月报基本信息</view>-->
      <!--        </view>-->
      <uni-card>
        <uni-form-item label="监理月报名称" :border="false" align="left">
          <view>{{ baseInfo.name }}</view>
        </uni-form-item>
        <uni-form-item label="年度" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.year }}</view>
        </uni-form-item>
        <uni-form-item label="月份" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.month }}</view>
        </uni-form-item>
        <uni-form-item label="编制人" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.writerName }}</view>
        </uni-form-item>
        <uni-form-item label="编制日期" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.writeDate }}</view>
        </uni-form-item>
        <uni-form-item label="监理月报备注" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.remark }}</view>
        </uni-form-item>
        <uni-form-item label="监理月报附件" :border="false" align="left">
          <uni-attachment v-model="baseInfo.fileIds"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="创建人" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.createTime }}</view>
        </uni-form-item>
      </uni-card>
      <!--        <view class="btn-wrapper">-->
      <!--          <button class="button" type="primary" :loading="loading" @click="handleDelete">删除</button>-->
      <!--        </view>-->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/supervisorRecord'

export default {
  data() {
    return {
      id: '',
      baseInfo: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.type === 'menu') {
      this.showMenu()
    }
  },
  methods: {
    init() {
      // 通过请求获取详情
      Api.getMonthlyInfo(this.id).then(res => {
        this.baseInfo = res.data || {}
      })
    },
    //删除
    handleDelete() {
      Api.getMonthlyDelete([this.id]).then(res => {
        if (res.code === 200) {
          this.$utils.showToast('删除成功')
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
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
            this.$utils.toUrl(`/pages/supervisorRecord/monthly/add?id=${this.id}`)
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
