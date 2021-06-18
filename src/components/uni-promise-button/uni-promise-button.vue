<template>
  <button :loading="loading" class="button" v-bind="$attrs" @click="handleClick"><slot></slot></button>
</template>

<script>
export default {
  name: 'UniPromiseButton',
  props: {
    click: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  // 方法集合
  methods: {
    async handleClick(event) {
      if (!this.click) {
        throw new Error('由于uniapp的限制，无法使用$listeners进行异步处理，因此该组件必须通过:click 传递click事件')
      }
      try {
        this.loading = true
        await this.click(event)
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    }
  }
}
</script>
