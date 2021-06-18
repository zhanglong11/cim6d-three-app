<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <!--            <uni-form-item label="验收名称" prop="acceptanceName" isRequired isLink>-->
          <!--              <textarea v-model.trim="form.acceptanceName" auto-height placeholder="请输入" />-->
          <!--            </uni-form-item>-->
          <uni-form-item label="验收名称" prop="acceptanceName" isRequired isLink>
            <textarea
              v-model="form.acceptanceName"
              auto-height
              disabled
              placeholder="请选择"
              @click="handleOpenDrawer"
            />
          </uni-form-item>
          <uni-form-item label="计划验收时间" prop="acceptanceDate" isRequired isLink>
            <uni-date-picker v-model="form.acceptanceDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="施工负责人" isLink isRequired prop="constructionDirectorId">
            <uni-select-user v-model="form.constructionDirectorId" />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item label="备注" prop="remark">
            <textarea v-model.trim="form.remark" auto-height placeholder="请输入" />
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并提交</button>
      </view>
    </view>
    <!-- 工序侧边栏start -->
    <uni-drawer ref="productList" class="drawer" :width="750" mode="right">
      <!--      <div class="header">-->
      <!--        <span class="close" @click="handleCloseDrawer">取消</span>-->
      <!--        <span class="title">选择验收名称</span>-->
      <!--      </div>-->
      <SelectEntity :taskUniqueId="form.taskUniqueId" @selected="handleSelectedProcedure" @close="handleCloseDrawer" />
    </uni-drawer>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '@/pages/quality/api'
import SelectEntity from '../components/SelectEntity'
export default {
  name: 'QualityInspectionAdd',
  components: { SelectEntity },
  data() {
    return {
      id: '',
      form: {
        acceptanceName: '',
        constructionDirectorId: '',
        acceptanceDate: '',
        remark: '',
        fileIds: ''
      },
      rules: {
        acceptanceName: { required: true },
        constructionDirectorId: { required: true },
        acceptanceDate: { required: true }
      },
      uUid: this.$utils.getUuid() || '', // 接收选择的构件或其他服务使用
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑')
      this.getDetail()
    }
    let targetId = options.messageId || ''
    if (targetId) {
      this.$utils.toUrl(`/pages/quality/inspection/detail?id=${this.id}&isCheck=${options.isCheck}`, 2)
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
  onNavigationBarButtonTap(obj) {},
  methods: {
    // 显示工序进度选择模态框
    handleOpenDrawer() {
      this.$refs.productList.open()
    },
    //详情
    async getDetail() {
      let res = await Api.getInspectionInfo(this.id)
      this.form = res.data
    },
    // 关闭工序选择模态框
    handleCloseDrawer() {
      this.$refs.productList.close()
    },
    // 选择工序完成
    handleSelectedProcedure(data) {
      this.form.planUnicode = data[0].planUnicode
      this.form.taskUniqueId = data[0].taskUniqueId
      this.form.acceptanceName = data[0].name
      this.$refs.productList.close()
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      let num = this.id ? 2 : 1
      await this.$refs.form.validate()
      isSave ? await Api.getInspectionSave(this.form) : await Api.getInspectionSaveAndSubmit(this.form)
      this.$utils.showToast('保存成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(num)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
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
.drawer {
  display: flex;
  .header {
    display: flex;
    align-items: center;
    padding: 10px 100px;
    border-bottom: 1px solid #eee;
    font-weight: 700;
    font-size: 14px;
    height: 88px;
    position: relative;
    .icon {
      color: @h2FontColor;
      font-size: 20px;
    }
    .close,
    .save {
      font-weight: normal;
      color: @headerColor;
      position: absolute;
    }
    .close {
      left: 20rpx;
    }
    .save {
      right: 20rpx;
    }
    .title {
      font-size: 16px;
      flex: 1;
      text-align: center;
      .ellipsis;
    }
  }
}
</style>
