<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
          <uni-card isForm>
            <uni-form-item label="图纸名称" prop="drawingsName">
              <textarea v-model.trim="form.drawingsName" auto-height placeholder="请输入" @beforeUpload="" />
            </uni-form-item>
            <uni-form-item class="file-item" label="图纸" prop="modelUrls">
              <uploadDrawings
                v-model="form.modelUrls"
                fileUrl="/bim-oda-handle/convert"
                edit
                @getModelFile="getModelFile"
              />
            </uni-form-item>
          </uni-card>
          <uni-card isForm>
            <uni-form-item label="备注" prop="remark">
              <textarea v-model.trim="form.remark" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item class="file-item" label="附件" prop="attachmentIds">
              <uni-attachment v-model="form.attachmentIds" edit />
            </uni-form-item>
          </uni-card>
        </uni-form-custom>

        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleSave">保存</button>
        </view>
      </view>
    </scroll-view>
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
      this.$utils.setTitle('编辑')
    }
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
    async refresh() {
      let res = await Api.detail(this.id)
      let cloneData = _.cloneDeep(res.data)
      cloneData = {
        ...cloneData,
        modelUrls: JSON.parse(cloneData.modelUrls)[0],
        sourceUrls: JSON.parse(cloneData.sourceUrls)[0],
        sourceNames: JSON.parse(cloneData.sourceNames)[0]
      }
      this.form = cloneData
    },
    // 点击保存按钮
    async handleSave() {
      await this.$refs.form.validate()
      let param = _.cloneDeep(this.form)
      param.modelUrls = JSON.stringify([param.modelUrls])
      param.sourceUrls = JSON.stringify([param.sourceUrls])
      param.sourceNames = JSON.stringify([param.sourceNames])
      this.id ? await Api.update(param) : await Api.add(param)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.id ? this.$utils.goBack(2) : this.$utils.goBack(1)
      }, 1000)
    },
    getModelFile(item) {
      this.form = {
        ...this.form,
        sourceUrls: item.fileUrl,
        sourceNames: item.name
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mt20 + .mt20 {
  margin-top: 50rpx;
}
.btn-wrapper {
  display: flex;
  .button {
    flex: 1;
    margin: 0 20rpx;
  }
}
.radio-item {
  display: block;
  & + .radio-item {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid #eee;
  }
}
.card-title {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx 10rpx 40rpx;
  .btn {
    color: red;
  }
}
.footer {
  margin-top: 10rpx;
  text-align: center;
}
</style>
