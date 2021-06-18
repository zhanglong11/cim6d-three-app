<template>
  <div class="wrapper">
    <div class="image-wrapper">
      <image v-if="imgReg.test(fileInfo.fileNameSuffix)" :src="fileInfo.fileUrl" />
      <image v-else-if="fileInfo.fileNameSuffix === 'dwg'" :src="fileInfo.previewUrl" />
      <image v-else-if="fileInfo.fileNameSuffix === 'pdf'" src="./assets/pdf.png" />
      <image v-else-if="xlsReg.test(fileInfo.fileNameSuffix)" src="./assets/xlsx.png" />
      <image v-else-if="docReg.test(fileInfo.fileNameSuffix)" src="./assets/doc.png" />
      <image v-else-if="fileInfo.fileNameSuffix === 'ppt'" src="./assets/ppt.png" />
      <image v-else-if="fileInfo.fileNameSuffix === 'psd'" src="./assets/psd.png" />
      <image v-else-if="zipReg.test(fileInfo.fileNameSuffix)" src="./assets/zip.png" />
      <image v-else src="./assets/other.png" />
    </div>
    <div class="btn-wrap">
      <div @click="openDocument">预览</div>
      <div v-if="hasDownload" @click="downLoad">下载</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    fileInfo: {},
    hasDownload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgReg: /^(jpg|png|jpeg|gif|webp|bmp)$/i,
      videoReg: /^(mp4|mkv|ogg|webm)$/i,
      docReg: /^(doc|docx)$/i,
      xlsReg: /^(xls|xlsx)$/i,
      zipReg: /^(rar|zip|7z)$/i
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    openDocument() {
      if (this.fileInfo.previewUrl) {
        uni.previewImage({
          current: 0,
          urls: [this.fileInfo.previewUrl]
        })
        return
      }
      if (!this.fileInfo.fileUrl) {
        this.$utils.showToast('无法预览')
        return
      }
      if (this.imgReg.test(this.fileInfo.fileNameSuffix)) {
        uni.previewImage({
          current: 0,
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
@import 'index.less';
</style>
