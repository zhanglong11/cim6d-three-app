<template>
  <div class="wrap">
    <div id="viewer"></div>
  </div>
</template>

<script>
import { Viewer } from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'

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
  created() {
    this.fileUrl = this.$utils.getUrlStr('fileUrl')
  },
  // 生命周期 - 挂载完成
  mounted() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      if (!this.fileUrl) return
      this.viewer = new Viewer({
        container: document.querySelector('#viewer'),
        panorama: this.fileUrl,
        size: {
          width: '100%',
          height: '100%'
        },
        // Deactivate the animation
        // time_anim: false,

        // Display the navigation bar
        navbar: true
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100vw;
  height: 100vh;
}
#viewer {
  /deep/ .psv-navbar {
    display: none !important;
  }
}
</style>
