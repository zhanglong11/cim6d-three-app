<template>
  <div class="main is-white">
    <div class="header-wrapper">
      <h3>{{ fileInfo.fileName }}</h3>
      <div class="info">
        <span>{{ fileInfo.fileNameSuffix }}</span>
        <span>{{ fileInfo.fileSize | formatFileSize }}</span>
        <span class="ellipsis">{{ fileInfo.fileName }}</span>
      </div>
      <div class="baseView">
        <div class="img-wrapper">
          <div>
            <uni-preview :fileId="fileInfo.id"> </uni-preview>
          </div>
        </div>
      </div>
    </div>
    <div class="form-detail">
      <uni-form-item label="上传人员">
        <view>{{ fileInfo.creatorName }}</view>
      </uni-form-item>
      <uni-form-item label="备注">
        <view>{{ remark }}</view>
      </uni-form-item>
      <uni-form-item label="上传时间">
        <view>{{ time }}</view>
      </uni-form-item>
    </div>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'FileDetail',
  components: { },
  data() {
    return {
      fileId: '',
      id: '', // 项目资料id
      fileInfo: {
        fileNameSuffix: ''
      },
      projectDataInfo: {},
      time: '', // 此时间不是当前文件的即时上传时间，而是待文件上传好后，保存项目资料数据成功后的时间
      remark: ''
    }
  },
  watch: {},
  onLoad(options) {
    this.fileId = options.fileId
    this.id = options.id
  },
  onBackPress() {},
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let resF = await Api.getFileInfo(this.fileId)
      this.fileInfo = resF.data
      let resP = await Api.getProjectDataDetail(this.id)
      this.projectDataInfo = resP.data
      if (this.projectDataInfo) {
        if (this.projectDataInfo.fileList && this.projectDataInfo.fileList.length) {
          for (let i = 0; i < this.projectDataInfo.fileList.length; i++) {
            if (this.projectDataInfo.fileList[i].fileId === this.fileId) {
              this.time = this.projectDataInfo.fileList[i].createTime
              this.remark = this.projectDataInfo.fileList[i].remark
              break
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('file-detail.less');
</style>
