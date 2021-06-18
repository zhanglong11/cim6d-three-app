<template>
  <div>
    <ul v-if="edit" class="upload-button-list">
      <template v-if="isExcel">
        <li @click="uploadExcel">
          <p>+</p>
          <p>表格</p>
        </li>
      </template>
      <template v-else>
        <li v-if="uploadType.includes('image') && !isDrawings" @click="uploadImage">
          <p>+</p>
          <p>图片</p>
        </li>
        <li v-if="uploadType.includes('video') && !isDrawings" @click="uploadVideo">
          <p>+</p>
          <p>视频</p>
        </li>
        <li v-if="uploadType.includes('other')" @click="uploadOther">
          <p>+</p>
          <p>{{ isDrawings ? '上传' : '其它' }}</p>
        </li>
      </template>
    </ul>
    <ul v-if="imageList.length" class="file-list">
      <li v-for="file in imageList" :key="file.id">
        <image :src="file.previewUrl + '?x-oss-process=style/w140_h140'" @click="previewImage(file)" />
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="videoList.length" class="video-list file-list">
      <li v-for="file in videoList" :key="file.id">
        <video :src="file.fileUrl" :autoplay="autoplay" />
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <ul v-if="documentList.length" class="document-list file-list">
      <li v-for="file in documentList" :key="file.id">
        <image v-if="file.fileNameSuffix === 'pdf'" src="./assets/pdf.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xls'" src="./assets/xls.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'xlsx'" src="./assets/xlsx.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'doc'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'docx'" src="./assets/doc.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'ppt'" src="./assets/ppt.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'psd'" src="./assets/psd.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'zip'" src="./assets/zip.png" @click="openDocument(file)" />
        <image v-else-if="file.fileNameSuffix === 'rar'" src="./assets/zip.png" @click="openDocument(file)" />
        <image v-else src="./assets/other.png" @click="openDocument(file)" />
        <p class="name">{{ file.fileName }}</p>
        <div v-if="edit" class="close" @click="remove(file)"></div>
      </li>
    </ul>
    <lFile ref="lFile" :isExcel="isExcel" @up-success="uploadSuccess" />
  </div>
</template>
<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp|dwg)$/i
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/i
const imgTypeReg = /(png|jpg|gif)/i
import lFile from '@/components/l-file/l-file.vue'
import { fileUrl } from '@/utils/http'
import Api from '../../api'
export default {
  components: {
    lFile
  },
  props: {
    // 是否是工作流组件
    isWorkForm: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array],
      default: ''
    },
    // 是否可编辑
    edit: {
      type: Boolean,
      default: false
    },
    isExcel: {
      type: Boolean,
      default: false
    },
    hasVideo: {
      type: Boolean,
      default: false
    },
    // 上传类型
    uploadType: {
      type: String,
      default: 'image,video,other'
    },
    // 返回所有数据 [{name: 11, fileKey: 22}]
    isAll: {
      type: Boolean,
      default: false
    },
    //上传最大数量
    limit: {
      type: [Number, null],
      default: null
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    sourceType: {
      type: Array,
      default() {
        return ['camera', 'album']
      }
    },
    type: {},
    id: {},
    url: {},
    isDrawings: {}
  },
  data() {
    return {
      fileList: [],
      listTemp: [],
      previewAry: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    imageList() {
      return this.previewAry.filter(p => imgReg.test(p.name))
    },
    videoList() {
      return this.previewAry.filter(p => videoReg.test(p.name))
    },
    documentList() {
      return this.previewAry.filter(p => !imgReg.test(p.name) && !videoReg.test(p.name))
    }
  },
  methods: {
    // 删除文件
    async remove(file) {
      await Api.delete(file.id)
      this.previewAry = this.previewAry.filter(p => p.id !== file.id)
    },
    openDocument(file) {
      uni.showLoading({
        title: '正在加载文件'
      })
      uni.downloadFile({
        url: file.fileUrl,
        success: function (res) {
          uni.hideLoading()
          var filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            success: function (res) {
              // console.log('打开文档成功')
            }
          })
        }
      })
    },
    // 预览
    previewImage() {
      let urlAry = this.previewAry.map(p => p.previewUrl)
      uni.previewImage({
        current: 0,
        urls: urlAry
      })
    },
    // 上传文件
    async uploadFile(name, filePath) {
      await uni
        .uploadFile({
          header: {
            'x-access-token': this.token,
            'project-id': uni.getStorageSync('projectId')
          },
          name: 'file',
          url: fileUrl + this.url,
          filePath,
          formData: {
            categoryId: this.type,
            parentId: this.id
          }
        })
        .then(async ([err, uploadFileRes]) => {
          const res = JSON.parse(uploadFileRes.data)
          const detailRes = await Api.fileDetail(res.data)
          const detailData = detailRes.data
          this.previewAry.push({
            previewUrl: detailData.fileUrl,
            name: detailData.name,
            id: detailData.id,
            fileSuffix: detailData.fileNameSuffix
          })
        })
        .finally(() => {
          uni.hideLoading()
        })
    },
    // 图片上传
    uploadImage() {
      if (this.limit && this.fileList.length >= this.limit) {
        this.$utils.showToast(`文件个数不能大于${this.limit}个`)
        return
      }
      uni.chooseImage({
        sourceType: this.sourceType,
        success: async chooseImageRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePaths = chooseImageRes.tempFilePaths
          for (let filePath of tempFilePaths) {
            let list = filePath.split('/')
            let name = list[list.length - 1]
            this.uploadFile(name, filePath)
          }
          uni.hideLoading()
        }
      })
    },
    // 上传视频
    uploadVideo() {
      if (this.limit && this.fileList.length >= this.limit) {
        this.$utils.showToast(`文件个数不能大于${this.limit}个`)
        return
      }
      uni.chooseVideo({
        success: chooseVideoRes => {
          uni.showLoading({ title: '正在上传' })
          const tempFilePath = chooseVideoRes.tempFilePath
          let list = tempFilePath.split('/')
          let name = chooseVideoRes.tempFile ? chooseVideoRes.tempFile.name : list[list.length - 1]
          this.uploadFile(name, tempFilePath)
        }
      })
    },
    // 上传其他文件
    uploadOther() {
      if (this.limit && this.fileList.length >= this.limit) {
        this.$utils.showToast(`文件个数不能大于${this.limit}个`)
        return
      }
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + this.url,
        name: 'file',
        header: {
          'x-access-token': this.token,
          'project-id': uni.getStorageSync('projectId')
        },
        formData: {
          categoryId: this.type,
          parentId: this.id
        }
      })
    },
    uploadExcel() {
      if (this.fileList.length >= 1) {
        this.$utils.showToast('只能选一个')
        return false
      }
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        'project-id': uni.getStorageSync('projectId'),
        header: {
          'x-access-token': this.token,
          type: '.xls,.xlsx'
        }
      })
    },
    // 上传其他文件成功
    async uploadSuccess(uploadFileRes) {
      const { id } = uploadFileRes.data
      const detailRes = await Api.fileDetail(id)
      const detailData = detailRes.data
      const fileTypeReg = /(jpg|png|jepg|gif|webp|dwg)$/i
      if (!fileTypeReg.test(detailData.fileNameSuffix) && this.isDrawings) {
        this.$utils.showToast('文件格式错误')
        await Api.delete(id)
        return
      }
      let previewUrl = detailData.fileNameSuffix === 'dwg' ? detailData.previewUrl : detailData.fileUrl
      this.previewAry.push({
        previewUrl: previewUrl,
        name: detailData.name,
        id: detailData.id,
        fileSuffix: detailData.fileNameSuffix
      })
      console.log(this.previewAry)
    }
  }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
