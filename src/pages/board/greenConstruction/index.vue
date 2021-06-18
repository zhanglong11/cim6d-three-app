<template>
  <div class="green-construction-con">
    <!-- #ifdef H5 -->
    <GreenConstructionWebView />
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <web-view
      :src="`http://ly.gim6d.com:9914/#/pages/board/greenConstruction/greenConstructionWebView?projectId=${projectId}&token=${token}`"
    />
    <!-- #endif -->
  </div>
</template>

<script>
import GreenConstructionWebView from './greenConstructionWebView'
export default {
  name: 'GreenConstruction',
  // import引入的组件
  components: {
    GreenConstructionWebView
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
