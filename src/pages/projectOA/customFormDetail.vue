<template>
  <div class="main">
    <div class="form-details">
      <div v-if="formDetails.name" class="details-header">
        <image class="details-icon" :src="formDetails.icon" />
        <span v-text="formDetails.name"></span>
      </div>
      <WorkFlow
        ref="workFlowRef"
        :companyList="companyList"
        :token="token"
        viewFormData
        :targetId="id"
        :formDataJson="formDataJson"
      />
      <div class="details-flow">
        <!-- 通用审批 start -->
        <uni-common-check-flow :id="id" />
        <!-- 通用审批 end -->
      </div>
    </div>
  </div>
</template>

<script>
import statusList from './lib/statusList'
import Api from './api'

export default {
  data() {
    //这里存放数据
    return {
      statusList,
      id: '',
      isCheck: false,
      formDataJson: '',
      formDetails: {},
      proessDetails: {},
      labelWidth: '100px',
      processData: []
    }
  },
  onLoad(options) {
    this.id = options.id
    this.isCheck = options.isCheck === 'true'
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
    init() {
      this.getFormFillDetail()
    },
    // 获取表单数据详情
    async getFormFillDetail() {
      if (!this.id) {
        return
      }
      let result = await Api.getFormFillDetail(this.id)
      let datas = result.data
      let template = datas.template
      this.formDetails = datas
      this.formDataJson = template ? JSON.parse(template) : ''
      if (datas.name) {
        this.$utils.setTitle(datas.name)
      }
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
  .details-header {
    padding: 0 24px 24px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    .details-icon {
      margin-right: 20px;
      width: 60px;
      height: 60px;
    }
  }
  .details-flow {
    padding: 0 24px;
  }
}
.process-title {
  display: flex;
  align-items: center;
  font-weight: normal;
  padding: 22px;
  width: 100%;
  .title {
    font-size: 16px;
    flex: 1;
  }
  /deep/.status {
    display: inline-flex;
    align-items: center;
  }
}
.process-check {
  width: 90%;
  display: inline-flex;
  align-items: center;
  position: relative;
  z-index: 1;
  height: 100%;
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 2px;
    height: 50%;
    background: @mainColor;
    right: 10px;
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
  .process-check-label {
    flex: 1;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    .process-check-label-title {
      margin-right: 10px;
    }
  }
  .process-radio {
    border: 4px @mainColor solid;
    background: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    &.active {
      background: @mainColor;
    }
  }
  &.is-approver {
    cursor: pointer;
    .process-radio {
      display: block;
    }
  }
}
.process-item {
  margin-bottom: 0;
  &:first-child {
    .process-check {
      &:before {
        display: none;
      }
    }
  }
  &:last-child {
    .process-check {
      &:after {
        display: none;
      }
    }
  }
}
</style>
