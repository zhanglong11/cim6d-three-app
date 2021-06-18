<template>
  <div class="item" :class="{ active: name === activeName }" @click="$parent.$emit('input', name)">
    <div class="wrap">
      <p v-if="count" class="count" v-text="count"></p>
      <p v-if="icon" class="icon">
        <slot></slot>
      </p>
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniTabPane',
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: [String, Number],
      default: null
    },
    // 是否显示图标
    icon: {
      type: Boolean,
      default: false
    },
    // 统计
    count: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      activeName: false
    }
  },
  created() {
    this.activeName = this.$parent.value
    this.$parent.$watch('value', val => {
      this.activeName = val
    })
  }
}
</script>

<style scoped lang="less">
@import './uni-tab-pane.less';
</style>
