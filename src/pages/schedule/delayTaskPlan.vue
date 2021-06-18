<template>
  <div class="main">
    <uni-form-custom>
      <uni-card>
        <uni-form-item label="解决方案详情" isRequired>
          <textarea v-model.trim="form.program" :maxlength="-1" placeholder="点击输入内容" auto-height />
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" :disabled="isLoading || !form.program" type="primary" @click="submit">提交</button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import { delayProgram } from './api'
export default {
  name: 'CompleteTask',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: null,
      form: {},
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  onLoad({ taskId }) {
    this.form.taskId = taskId
  },
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 提交
    async submit() {
      this.isLoading = true
      await delayProgram(this.form).finally(() => (this.isLoading = false))
      this.$utils.showToast('提交成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding: 10px 25px 25px;
}
</style>
