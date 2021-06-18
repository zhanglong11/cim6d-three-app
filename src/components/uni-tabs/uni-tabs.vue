<template>
  <ul class="tabs uni-tabs" :class="{ 'no-line': noLine }">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'UniTabs',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    // 不显示底部线
    noLine: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import './uni-tabs.less';
</style>
