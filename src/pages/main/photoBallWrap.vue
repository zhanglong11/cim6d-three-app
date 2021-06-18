<template>
  <div class="wrap">
    <web-view :src="`http://ly.gim6d.com:9914/#/pages/main/photoBall?fileUrl=${fileUrl}`" />
    <!--    <web-view :src="`/hybrid/html/index.html?fileUrl=${fileUrl}`"></web-view>-->
  </div>
</template>

<script>
export default {
  name: 'photoBall',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      fileUrl: null
    }
  },
  // 生命周期 - 挂载完成
  mounted() {
    this.refresh()
  },
  created() {
    // this.initPhoto()
  },
  onLoad(options) {
    this.fileUrl = options.fileUrl
    //#ifdef APP-PLUS
    // plus.screen.lockOrientation('landscape-primary')
    //#endif
  },
  onUnload() {
    //#ifdef APP-PLUS
    // plus.screen.lockOrientation('portrait-primary')
    //#endif
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    initPhoto() {}
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
}
</style>
