<template>
  <div class="main is-white">
    <div class="header-wrapper">
      <h3>{{ fileInfo.name }}</h3>
      <div class="info">
        <span>{{ fileInfo.fileNameSuffix }}</span>
        <span>{{ fileInfo.fileSize | formatFileSize }}</span>
        <span class="ellipsis">{{ fileInfo.parentName }}</span>
      </div>
      <div class="baseView">
        <div class="img-wrapper">
          <div>
            <Preview :fileInfo="fileInfo"></Preview>
          </div>
        </div>
      </div>
    </div>
    <div class="form-detail">
      <uni-form-item label="资料类别">
        <view>{{ fileInfo.categoryName }}</view>
      </uni-form-item>
      <uni-form-item label="上传人员">
        <view>{{ fileInfo.creatorName }}</view>
      </uni-form-item>
      <uni-form-item label="上传时间">
        <view>{{ fileInfo.createTime }}</view>
      </uni-form-item>
    </div>
  </div>
</template>

<script>
import Api from './api'
import Preview from './components/preview'
export default {
  name: 'FileDetail',
  components: {
    Preview
  },
  data() {
    return {
      fileId: '',
      fileInfo: {}
    }
  },
  onLoad(options) {
    this.fileId = options.id
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      if (!this.fileId) {
        return
      }
      let res = await Api.fileDetail(this.fileId)
      this.fileInfo = res.data
    }
  }
}
</script>

<style scoped lang="less">
@import url('file-detail.less');
</style>
