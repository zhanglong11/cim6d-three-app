<template>
  <view class="main is-white">
    <web-view :src="`http://172.16.10.161:8080/#/pages/safetyCap/capDetailWebview?id=${id}`" />
  </view>
</template>

<script>
import Api from '@/pages/safetyCap/api'
import alarmType from './lib/alarmType'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      id: ''
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
