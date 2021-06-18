<template>
  <view>
    <u-toast ref="uToast" />
    <u-modal :value="visible" show-cancel-button title="请输入文件夹名称" @cancel="close" @confirm="confirmAdd">
      <view class="name-wrap">
        <textarea v-model.trim="fileName" placeholder="请输入" auto-height />
      </view>
    </u-modal>
  </view>
</template>

<script>
import Api from '../../api'
export default {
  name: 'index',
  // import引入的组件
  components: {},
  props: {
    visible: {},
    categoryId: {},
    parentId: {},
    type: {}
  },
  data() {
    // 这里存放数据
    return {
      fileName: ''
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    close() {
      this.fileName = ''
      this.$emit('update:visible', false)
    },
    async confirmAdd() {
      if (!this.fileName) {
        this.$refs.uToast.show({
          title: '请输入文件名',
          type: 'warning'
        })
        this.$emit('update:visible', true)
        return
      }
      await Api.addFolder({ categoryId: this.categoryId, name: this.fileName, parentId: this.parentId })
      this.$refs.uToast.show({
        title: '操作成功'
      })
      this.close()
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.name-wrap {
  padding: 30px;
}
</style>
