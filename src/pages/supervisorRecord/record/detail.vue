<template>
  <view class="main">
    <view class="main-body">
<!--      <view class="card-title-info">-->
<!--        <view class="title">旁站记录基本信息</view>-->
<!--      </view>-->
      <uni-card>
        <uni-form-item label="单位工程名称" :border="false" align="left">
          <view>{{ baseInfo.engineeringName }}</view>
        </uni-form-item>
        <uni-form-item label="旁站部位或工序" :border="false" align="left">
          <view>{{ baseInfo.partProcedure }}</view>
        </uni-form-item>
        <uni-form-item label="天气" :border="false" align="left">
          <view>{{ baseInfo.weather }}</view>
        </uni-form-item>
        <uni-form-item label="旁站人" :border="false" align="left">
          <view>{{ baseInfo.creatorName }}</view>
        </uni-form-item>

        <uni-form-item label="旁站开始时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.startDate | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="旁站结束时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.endDate | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="施工情况" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.constructionSituation }}</view>
        </uni-form-item>
        <uni-form-item label="监理情况" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.supervisorSituation }}</view>
        </uni-form-item>
        <uni-form-item label="发现问题" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.findIssue }}</view>
        </uni-form-item>
        <uni-form-item label="处理问题" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.handleIssue }}</view>
        </uni-form-item>
        <uni-form-item label="备注" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.remark }}</view>
        </uni-form-item>
        <uni-form-item label="旁站附件" :border="false" align="left">
          <view class="placeholder"><uni-attachment v-model="baseInfo.fileIds"></uni-attachment></view>
        </uni-form-item>
        <uni-form-item label="创建时间" :border="false" align="left">
          <view class="placeholder">{{ baseInfo.createTime | ymd }}</view>
        </uni-form-item>
      </uni-card>
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
      Api.getRecordInfo(this.id).then(res => {
        this.baseInfo = res.data || {}
      })
    },
    //进行删除
    handleDelete() {
      Api.getRecordDelete([this.id]).then(res => {
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
            this.$utils.toUrl(`/pages/supervisorRecord/record/add?id=${this.id}`)
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
