<template>
  <div class="main is-white">
    <div class="about-header">
      <image src="~@/static/images/login/login-bg.png" class="logo" mode="widthFix" />
    </div>
    <div class="about-form main-body">
      <uni-card isForm>
        <uni-form-item
          label="更新记录"
          :border="false"
          isLink
          @click="$utils.toUrl('/pages/about/update-records')"
        ></uni-form-item>
        <uni-form-item label="服务协议" isLink @click="$utils.toUrl('/pages/about/agreement')"></uni-form-item>
      </uni-card>
    </div>
    <div class="about-footer">
      <p>工程飞鱼</p>
      <p class="copyright">Copyright © www.bimfish.com, All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    //这里存放数据
    return {}
  },
  mounted() {},
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
