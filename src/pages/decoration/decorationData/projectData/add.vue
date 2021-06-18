<template>
  <view class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="资料名称" prop="name" isRequired>
          <textarea v-model.trim="form.name" auto-height placeholder="请输入资料名称" />
        </uni-form-item>
        <uni-form-item label="资料分类" prop="informationType" isRequired>
          <uni-select v-model="form.informationType" :options="informationTypeList"></uni-select>
        </uni-form-item>
        <uni-form-item label="资料描述" prop="desp">
          <textarea v-model.trim="form.desp" auto-height placeholder="请输入资料描述" />
        </uni-form-item>
        <uni-form-item label="资料备注" prop="remark">
          <textarea v-model.trim="form.remark" auto-height placeholder="请输入资料备注" />
        </uni-form-item>
      </uni-card>

      <ul class="file-data">
        <li class="file-data-l">资料目录</li>
        <li class="file-data-r" @click="uploadOther">+上传资料</li>
      </ul>
      <lFile ref="lFile" @up-success="uploadSuccess" />

      <uni-card v-if="fileList.length" style="margin-top: 0px">
        <ul>
          <li v-for="(item, index) in fileList" :key="index" class="file-list">
            <span class="file-item-name">
              <span class="ellipsis">{{ item.fileName }}</span>
              <span class="file-item-delete" @click="handleDelete(item.fileId)">删除</span>
            </span>
            <span class="file-item-view" @click="toDetail(item)"></span>
            <span v-if="fileList.length - 1 !== index" class="file-item-border"></span>
          </li>
        </ul>
      </uni-card>
    </uni-form-custom>

    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleSave()">保存</button>
    </view>
  </view>
</template>

<script>
import lFile from '@/components/l-file/l-file.vue'
import { fileUrl } from '@/utils/http'
import Api from './api'
export default {
  components: { lFile },
  data() {
    return {
      form: {},
      rules: {
        name: { required: true },
        informationType: { required: true }
      },
      fileList: [
        /*{ fileName: 'test.txt', fileId: '43d1bbbcc2a2461a99702961138ad3d7', remark: '' },
        { fileName: 'test.xlsx', fileId: 'a91d3c9a45c4451ea825ff3e6a1882fe', remark: '' },
        { fileName: 'test.jpg', fileId: 'e638c4f92d7b43479f95c680cdd53bc7', remark: '' },
        { fileName: 'test.docx', fileId: '919e241e6b484260a568e7b3dde3ff47', remark: '' }*/
      ],
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    informationTypeList() {
      return this.$getArgList('informationType') || []
    }
  },
  onLoad(options) {
    let id = options.id
    if (!id) return
    this.init(options.id)
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
  methods: {
    // 编辑时，获取资料详情
    init(id) {
      this.form.id = id
    },
    onShow() {
      if (this.form.id) {
        this.getProjectDataDetail()
        this.$utils.setTitle('编辑项目资料')
      }
    },
    getProjectDataDetail() {
      Api.getProjectDataDetail(this.form.id).then(res => {
        this.form = res.data
        this.fileList = res.data.fileList
      })
    },
    // 上传其他文件
    uploadOther() {
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: fileUrl + '/file/commonFile/upload',
        name: 'file',
        header: {
          'x-access-token': this.token
        }
      })
    },
    // 上传其他文件成功
    uploadSuccess(res) {
      // console.log(res)
      this.fileList.push({
        fileName: res.fileName,
        fileId: res.data.id,
        remark: ''
      })
    },
    // 打开文件详情
    toDetail(item) {
      this.$utils.toUrl(`/pages/decoration/decorationData/projectData/file-detail?fileId=${item.fileId}`)
    },
    // 删除
    handleDelete(id) {
      this.fileList = this.fileList.filter(item => item.fileId !== id)
    },
    // 保存
    async handleSave() {
      await this.$refs.form.validate()
      this.isLoading = true
      Api.saveProjectData({
        ...this.form,
        fileList: this.fileList,
        projectId: this.$store.state.project.projectId
      }).then(
        res => {
          // console.log(res)
          this.$utils.showToast('保存成功')
          this.isSave = true
          setTimeout(() => {
            this.isLoading = false
            let delta = this.form.id ? 2 : 1
            this.$utils.goBack(delta)
          }, 1000)
        },
        err => {
          this.isLoading = false
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
