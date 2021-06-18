<template>
  <view class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="type">
        <uni-tab-pane name="ingl" label="管理人员"></uni-tab-pane>
        <uni-tab-pane name="outlw" label="劳务人员"></uni-tab-pane>
      </uni-tabs>
    </div>
    <DetailGl v-if="type === 'ingl'" />
    <DetailLw v-if="type === 'outlw'" />
  </view>
</template>

<script>
import DetailGl from './DetailGl'
import DetailLw from './DetailLw'
export default {
  components: { DetailGl, DetailLw },
  data() {
    return {
      type: 'ingl'
    }
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  created() {
    // 设置webview缓存
    let token = this.$utils.getUrlStr('token')
    if (token) {
      this.$store.commit('setWebViewDatas', {
        projectId: this.$utils.getUrlStr('projectId'),
        token
      })
    }
  },
  methods: {
    // 初始化
    init() {}
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/common.less';
.tabs-wrap {
}
/deep/ .item .wrap,
.item.active .wrap {
  min-width: 160px;
}
</style>
