<template>
  <div class="green-construction-con">
    <!-- #ifdef H5 -->
    <AttentWebView />
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <web-view
      :src="`http://ly.gim6d.com:9914/#/pages/attendanceWl/attentWebView?projectId=${projectId}&token=${token}`"
    ></web-view>
    <!-- #endif -->
  </div>
</template>

<script>
import AttentWebView from './attentWebView'
export default {
  name: 'AttenDanceStatice',
  // import引入的组件
  components: {
    AttentWebView
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    projectId() {
      return this.$store.state.project.projectId
    }
  }
}
</script>

<style scoped lang="less">
.green-construction-con {
  flex: 1;
  overflow: hidden;
}
</style>
