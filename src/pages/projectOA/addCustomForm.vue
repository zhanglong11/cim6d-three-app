<template>
  <div class="main">
    <div class="form-details">
      <WorkFlow ref="workFlowRef" :companyList="companyList" :token="token" addFormData :formId="id" />
    </div>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="btnLoading" @click="handleSave">提交</button>
    </view>
  </div>
</template>

<script>
import Api from './api'
export default {
  data() {
    //这里存放数据
    return {
      id: '',
      btnLoading: false
    }
  },
  onLoad(options) {
    this.id = options.id
    this.name = options.name
    this.$utils.setTitle(this.name)
    this.init()
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    companyList() {
      return this.$store.state.project.companyList
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    // 初始化
    init() {},
    async handleSave() {
      let formData = await this.$refs.workFlowRef.getJSON()
      console.log(111, formData)
      this.btnLoading = true
      await Api.getFormFillSave({ formData: formData, formName: this.name, formId: this.id })
        .then(res => {
          this.$utils.showToast('操作成功')
          this.btnLoading = false
          setTimeout(() => {
            this.$utils.goBack(1)
          }, 1500)
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.form-details {
  /deep/.approver-main {
    height: auto;
    padding: 22px 22px 0 0;
  }
}
</style>
