<template>
  <div>
    <ul v-if="edit" class="upload-button-list">
      <template>
        <li @click="uploadOther">
          <p>+</p>
          <p>上传</p>
        </li>
      </template>
    </ul>
    <view v-if="value" class="file-list">
      <image class="img" :src="value" @click="previewImage" />
      <div v-if="edit" class="close" @click="remove"></div>
    </view>
    <lFile ref="lFile" @up-success="uploadSuccess" />
    <view ref="input" class="file" />
  </div>
</template>
<script>
import lFile from '@/components/l-file/l-file.vue'
import { fileOda } from '@/utils/http'
export default {
  components: {
    lFile
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    // 是否可编辑
    edit: {
      type: Boolean,
      default: false
    },
    // 上传类型
    uploadType: {
      type: String,
      default: 'dwg,jpg,png'
    },
    fileUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      listTemp: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  methods: {
    // 删除文件
    async remove() {
      this.$emit('input', '')
    },
    // 预览
    previewImage() {
      uni.previewImage({
        current: 1,
        urls: [this.value]
      })
    },
    // 上传文件
    async uploadFile(name, filePath) {
      let fileType = name.split('.')[1]
      if (!this.uploadType.split(',').includes(fileType)) {
        this.$utils.showToast('仅支持dwg, png, jpg, jpeg格式的文件')
        return
      }
      await uni
        .uploadFile({
          header: {
            'x-access-token': this.token
          },
          name: 'file',
          url: `${fileOda}${this.fileUrl}`,
          filePath
        })
        .then(([err, uploadFileRes]) => {
          const res = JSON.parse(uploadFileRes.data)
          this.$emit('input', res.data.targetFileUrl)
          this.$emit('getModelFile', { name, fileUrl: res.data.sourceFileUrl })
        })
        .finally(() => {
          uni.hideLoading()
        })
    },
    // 图片上传
    uploadImage() {
      uni.chooseImage({
        success: async chooseImageRes => {
          // if (chooseImageRes.tempFiles.length > 1) {
          //   this.$utils.showToast(`文件个数不能大于1个`)
          //   return
          // }
          uni.showLoading({ title: '正在上传' })
          let filePath = chooseImageRes.tempFilePaths[0]
          let name = chooseImageRes.tempFiles[0].name
          this.uploadFile(name, filePath)
          uni.hideLoading()
        }
      })
    },
    // 上传其他文件
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: `${this.$utils.webBimUrl}${this.fileUrl}`,
        name: 'file',
        type: 'oda',
        header: {
          'x-access-token': this.token
        }
      })
    },
    // 上传其他文件成功
    uploadSuccess(res) {
      let name = res.fileName
      let fileType = name.split('.')[1]
      if (!this.uploadType.split(',').includes(fileType)) {
        this.$utils.showToast('仅支持dwg, png, jpg, jpeg格式的文件')
        return
      }
      let sourceFileUrl = res.data.sourceFileUrl
      let targetFileUrl = res.data.targetFileUrl
      this.$emit('input', targetFileUrl)
      this.$emit('getModelFile', { name, fileUrl: sourceFileUrl })
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
