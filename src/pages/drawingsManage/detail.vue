<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <uni-form-item label="图纸名称">
            {{ form.drawingsName }}
          </uni-form-item>
          <uni-form-item class="file-item" label="图纸">
            <uploadDrawings v-model="form.modelUrls" fileUrl="/bim-oda-handle/convert" />
          </uni-form-item>
          <uni-form-item label="备注" prop="remark">
            {{ form.remark }}
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.attachmentIds" uploadType="image,other" />
          </uni-form-item>
          <uni-form-item class="file-item" label="上传人">
            {{ form.creatorName }}
          </uni-form-item>
          <uni-form-item class="file-item" label="上传时间">
            {{ form.createTime }}
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
    </view>
    <view class="btn-wrapper">
      <button v-if="$hasPower('AppDrawingsManageEdit')" class="button" type="primary" @click="handleEdit">编辑</button>
      <button v-if="$hasPower('AppDrawingsManageDelete')" class="button delete" type="primary" @click="handleDelete">
        删除
      </button>
    </view>
  </view>
</template>

<script>
import Api from './api'
import uploadDrawings from '@/pages/drawingsManage/components/uploadDrawings'
export default {
  components: {
    uploadDrawings
  },
  data() {
    return {
      id: null,
      form: {},
      rules: {
        drawingsName: { required: true },
        modelUrls: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await Api.detail(this.id)
      let cloneData = _.cloneDeep(res.data)
      cloneData = {
        ...cloneData,
        modelUrls: JSON.parse(cloneData.modelUrls)[0],
        sourceUrls: JSON.parse(cloneData.sourceUrls)[0]
      }
      this.form = cloneData
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      let param = _.cloneDeep(this.form)
      this.id ? await Api.update(param) : await Api.add(param)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    },
    // 编辑
    handleEdit() {
      this.$utils.toUrl(`/pages/drawingsManage/add?id=${this.id}`)
    },
    // 删除
    handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除该数据吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '删除中' })
            Api.remove(this.id).then(res => {
              uni.hideLoading()
              this.$utils.goBack()
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn-wrapper {
  .delete {
    margin-top: 20px;
  }
}
</style>
