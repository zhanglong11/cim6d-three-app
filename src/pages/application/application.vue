<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <template v-for="items in applicationPower">
          <uni-card
            v-if="items.children && items.children.length > 0"
            :key="items.powerKey"
            :title="items.powerName"
            :hideTitle="false"
          >
            <ul class="list">
              <li v-for="item in items.children" :key="item.powerKey" @click="$utils.toUrl(item.url)">
                <image class="list-icon" :src="getAppIcon(item)" />
                <p v-text="item.powerName"></p>
              </li>
              <li v-if="items.powerName === '设备管理'" @click="scanCode">
                <image class="list-icon" :src="require(`@/static/images/application-power/AppCode.png`)" />
                <p>扫描二维码</p>
              </li>
            </ul>
          </uni-card>
        </template>
        <uni-card title="安全帽管理">
          <ul class="list">
            <li @click="$utils.toUrl('/pages/safetyCap/capList')">
              <image class="list-icon" :src="require(`@/static/images/application-power/AppCode.png`)" />
              <p>报警列表</p>
            </li>
            <li @click="$utils.toUrl('/pages/safetyCap/trackList')">
              <image class="list-icon" :src="require(`@/static/images/application-power/AppCode.png`)" />
              <p>轨迹列表</p>
            </li>
            <li @click="$utils.toUrl('/pages/safetyCap/capStatistics')">
              <image class="list-icon" :src="require(`@/static/images/application-power/AppCode.png`)" />
              <p>安全帽统计</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
    return {}
  },
  computed: {
    // APP应用权限
    applicationPower() {
      return this.$store.state.userPower.applicationPower
    }
  },
  methods: {
    scanCode() {
      let that = this
      uni.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          console.log('条码类型：' + res.scanType)
          console.log('条码内容：' + res.result)
          plus.runtime.openURL(res.result)
        },
        complete: function (res) {
          uni.showLoading({
            title: '识别中...'
          })
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
        },
        fail: function (res) {
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
        }
      })
    },
    // APP图标
    getAppIcon(item) {
      let url = ''
      try {
        url = require(`@/static/images/application-power/${item.powerKey}.png`)
      } catch (e) {
        url = require(`@/static/images/application-power/AppDefaultIcon.png`) // 默认Icon配置
        // console.log('需要提前添加图标文件')
      }
      return url
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
