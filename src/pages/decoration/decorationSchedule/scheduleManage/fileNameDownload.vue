<template>
  <view class="file-info">
    <view class="preview" @click="openDocument">{{ fileInfo.fileName }}</view>
    <view class="download" @click="downLoad">下载</view>
  </view>
</template>

<script>
export default {
  props: {
    fileId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileInfo: {},
      imgReg: /^(jpg|png|jpeg|gif|webp|bmp)$/i
    }
  },
  watch: {
    fileId: {
      immediate: true,
      handler() {
        this.refresh()
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.fileId) {
        this.fileInfo = {}
      } else {
        this.fileInfo = await this.fly.file.post('file/manage/list', [this.fileId]).then(res => res.data[0])
      }
    },
    openDocument() {
      if (this.imgReg.test(this.fileInfo.fileNameSuffix)) {
        uni.previewImage({
          current: this.fileInfo.fileUrl,
          urls: [this.fileInfo.fileUrl]
        })
        return
      }
      uni.showLoading({
        title: '正在加载文件'
      })
      uni.downloadFile({
        url: this.fileInfo.fileUrl,
        success: function (res) {
          uni.hideLoading()
          var filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    },
    downLoad() {
      uni.downloadFile({
        url: this.fileInfo.fileUrl, //仅为示例，并非真实的资源
        success: res => {
          if (res.statusCode === 200) {
            const imgReg = /^(jpg|png|jpeg|gif|webp|bmp|mp4|mkv|ogg|webm)$/i
            if (imgReg.test(this.fileInfo.fileNameSuffix)) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: res => {
                  this.$utils.showToast('下载成功')
                }
              })
              return
            }
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: res => {
                var savedFilePath = res.savedFilePath
                console.log(savedFilePath)
                this.$utils.showToast('下载成功')
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-info {
  display: flex;
  .preview,
  .download {
    color: #2888f1;
  }
  .preview {
    margin-right: 20px;
  }
}
</style>
