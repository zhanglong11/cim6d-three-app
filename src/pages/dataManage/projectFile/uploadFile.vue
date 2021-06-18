<template>
  <view class="main is-white">
    <uni-form-custom ref="form" :model="form" :rules="rules">
      <uni-card isForm class="attachmentInfo">
        <uni-form-item class="file-item" :label="isDrawings ? '图纸' : '附件'">
          <Upload
            ref="upload"
            url="/common/document/file/add"
            :type="type"
            :id="id"
            :isDrawings="isDrawings"
            edit
          ></Upload>
        </uni-form-item>
      </uni-card>
    </uni-form-custom>
    <view class="btn-wrapper">
      <button type="primary" class="button" :loading="isLoading" @click="handleSave()">保存</button>
    </view>
  </view>
</template>

<script>
import Upload from './components/upload'
export default {
  name: 'uploadFile',
  // import引入的组件
  components: { Upload },
  props: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {},
      isLoading: false,
      isDrawings: false
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  onLoad(options) {
    this.type = options.type
    this.id = options.id
    this.isDrawings = options.isDrawings || 0
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    async handleSave() {
      this.$utils.goBack()
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  background: #eee;
}
</style>
