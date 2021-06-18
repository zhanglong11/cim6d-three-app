<template>
  <div>
    <template v-if="processDetails.flag === 1 && isAuditStyle">
      <uni-title title="审批"></uni-title>
      <WorkFlow
        v-if="formDataJson"
        ref="workFlowRef"
        class="no-padding-work"
        :token="token"
        :addFormData="true"
        :companyList="companyList"
        :formDataJson="formDataJson"
      />
      <button class="button" type="primary" :loading="btnLoading" @click="submitCheckFlow()">审核</button>
    </template>
    <uni-card v-if="isProcess" class="is-process">
      <h2 slot="title" class="process-title">
        <span class="title">审批流程</span>
        <uni-status :value="processDetails.status" :options="statusList"></uni-status>
      </h2>
      <div class="flow-container" :class="{ isAddCustomForm: isAddCustomForm }">
        <div
          v-for="(item, index) of processData"
          :key="item.id + 'ss' + index"
          class="item"
          :class="{ isReadNode: item.type === 2 }"
          @click="handleItemClick(item, index)"
        >
          <div class="content-label">
            <span :class="'label-' + item.type">{{ item.operateLabel }}</span>
          </div>
          <div
            class="circle-line"
            :class="{
              isSuccess: item.result === 1 || item.status === 1 || (!isAddCustomForm && item.type === 0),
              isCurrent: index === current,
              isFailure: item.type === 1 && item.result === 2,
              passNotRead: item.status !== 1 && index < current
              // default: [0, undefind].includes(item.result)
            }"
          >
            <div class="circle"></div>
          </div>
          <div
            class="content"
            :class="{
              isCurrent: current && index === current,
              isFailure: item.type === 1 && item.result === 2
            }"
          >
            <div v-if="item.companyName" class="company">
              <b>{{ item.companyName }}:</b>
            </div>
            <div class="user" v-html="item.content"><i class="el-icon-s-custom" style="marginright: 3px"></i></div>
            <div v-if="item.operateTime" class="time">{{ item.operateTime }}</div>
          </div>
        </div>
      </div>
    </uni-card>
    <!-- <uni-popup v-if="isCheck" ref="checkFlow" type="center">
      <div class="popup-container">
        <h4 class="title">审核</h4>
        <div class="audit-body">
          <WorkFlow
            v-if="formDataJson"
            ref="workFlowRef"
            :token="token"
            :addFormData="true"
            :companyList="companyList"
            :formDataJson="formDataJson"
          />
        </div>
        <view class="btn-wrapper inline-btn">
          <button class="button" type="default" @click="closeCheckFlow">取消</button>
          <button class="button" type="primary" :loading="btnLoading" @click="submitCheckFlow()">确定</button>
        </view>
      </div>
    </uni-popup> -->
    <uni-popup ref="auditDetail" type="center">
      <div class="popup-container">
        <h4 class="title">审核详情</h4>
        <div class="audit-body">
          <template v-if="_.every(selectFlowNode.children, i => _.isNil(i.auditResult))">
            <view class="audit-card"><p>暂无数据</p></view>
          </template>
          <template v-else>
            <view v-for="(item, index) of selectFlowNode.children" :key="'sfn' + index" class="audit-card">
              <div class="audit-detail-item">
                <div class="label">审核人</div>
                <div class="value">{{ item.userName }}</div>
              </div>
              <div class="audit-detail-item">
                <div class="label">审核时间</div>
                <div class="value">{{ item.auditTime }}</div>
              </div>
              <div class="audit-detail-item">
                <div class="label">公司</div>
                <div class="value">{{ item.companyName }}</div>
              </div>
              <WorkFlow
                ref="generateForm"
                :companyList="companyList"
                :token="token"
                viewFormData
                :formDataJson="JSON.parse(item.template)"
              />
            </view>
          </template>
        </div>
        <view class="btn-wrapper inline-btn">
          <button class="button" type="primary" @click="auditDetailRefClose()">确定</button>
        </view>
      </div>
    </uni-popup>
    <uni-popup ref="readDetail" type="center">
      <div class="popup-container">
        <h4 class="title">抄送详情</h4>
        <div class="audit-body">
          <view v-for="(item, index) of selectFlowNode.children" :key="'sfn' + index" class="audit-card">
            <div class="audit-detail-item">
              <div class="label">抄送人</div>
              <div class="value">{{ item.userName }}</div>
            </div>
            <div class="audit-detail-item">
              <div class="label">所属公司</div>
              <div class="value">{{ item.companyName }}</div>
            </div>
            <div v-if="item.status" class="audit-detail-item">
              <div class="label">已读时间</div>
              <div class="value">{{ item.readTime }}</div>
            </div>
            <div class="audit-detail-item">
              <div class="label">状态</div>
              <div class="value">
                <switch :check="!!+item.status" disabled />
                <span v-if="item.status">已读</span>
                <b v-else style="color: #ff3300">未读</b>
              </div>
            </div>
          </view>
        </div>

        <view class="btn-wrapper inline-btn">
          <button class="button" type="primary" @click="readDetailRefClose()">确定</button>
        </view>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'UniCommonCheckFlow',
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: [String, Number],
      default: 100
    },
    isAddCustomForm: {
      type: Boolean,
      default: false
    },
    formId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      statusList: [
        { value: 1, label: '审批中', color: '#0079fe' },
        { value: 2, label: '已通过', color: '#25cc70' },
        { value: 3, label: '已驳回', color: '#FC5556' }
      ],
      processData: [],
      processDetails: {},
      formDataJson: '',
      current: '',
      selectFlowNode: {},
      showAuditDetail: false,
      btnLoading: false,
      isAuditStyle: false,
      isProcess: false
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    userName() {
      return this.$store.state.user.userName
    },
    companyList() {
      return this.$store.state.project.companyList
    }
  },
  created() {
    this.getAuditDetail()
    if (this.isAddCustomForm) {
      if (!this.formId) return
      this.getProcessListByFormId()
    }
  },
  mounted() {},
  methods: {
    //获取审批样式
    async getFormStyle() {
      let res = await http.processApi.get(`/oa/audit/style/template/${this.id}`)
      let datas = res.data
      if (!datas) {
        return
      }
      let formDataJson = JSON.parse(datas.template)
      this.isAuditStyle = true
      this.formDataJson = formDataJson
      if (!_.isEmpty(this.formDataJson)) {
        this.$refs.checkFlow && this.$refs.checkFlow.open()
      }
    },
    //获取审批数据
    async getAuditDetail() {
      if (!this.id) return
      let res = await http.processApi.get(`/oa/form/process/get/${this.id}`)
      let processData = []
      let processDetails = res.data
      if (!processDetails) {
        return
      }
      this.isProcess = true
      this.processDetails = processDetails
      let isCurrentChange = false //current只能取第一个
      if (processDetails.flag === 1) {
        this.getFormStyle()
      }
      processData =
        res.data &&
        res.data.list.map((item, index) => {
          if (item.nodeType !== 2 && !item.auditResult) {
            if (!isCurrentChange) {
              this.current = index + 1 //要加上发起人
            }
            isCurrentChange = true
          }
          if (item.auditResult === 2) {
            this.current = index + 1
            isCurrentChange = true
          }
          if (item.auditResult === 1) {
            this.current = index + 2
          }
          let operateLabel = item.nodeType === 1 ? '审批人' : '抄送人'
          if (item.nodeName) {
            operateLabel = item.nodeName
          }
          return {
            type: item.nodeType,
            result: item.auditResult,
            status: item.status,
            auditStyleType: item.auditStyleType,
            operateLabel,
            content: item.nodeContent,
            children: item.children
          }
        })
      processData.unshift({
        type: 0,
        operateLabel: '发起人',
        content: res.data.applyUserName
      })
      this.processData = processData
    },
    async getProcessListByFormId() {
      let res = await http.processApi.get(`/oa/form/get/${this.formId}`)
      console.log(res)
      let processData = []
      processData =
        res.data &&
        res.data.processConfigList.map((item, index) => {
          return {
            type: item.nodeType,
            operateLabel: item.nodeType === 1 ? '审批人' : '抄送人',
            content: item.nodeContent,
            children: item.children
          }
        })
      processData.unshift({
        type: 0,
        operateLabel: '发起人',
        content: this.userName
      })
      this.processData = processData
    },
    closeCheckFlow() {
      this.$refs.checkFlow.close()
    },
    //提交审核操作
    async submitCheckFlow() {
      let formData = await this.$refs.workFlowRef.getJSON()
      await this.auditSuccess(formData)
    },
    // 动态表单审批流程
    async auditSuccess(formData) {
      if (!this.id || this.btnLoading) {
        return
      }
      this.btnLoading = true
      await http.processApi.post(`/task/complete/${this.id}`, formData)
      this.$utils.showToast('审核成功')

      this.$refs.checkFlow && this.$refs.checkFlow.close()
      setTimeout(() => {
        this.$utils.goBack()
        this.btnLoading = false
      }, 1000)
    },
    //审核详情关闭
    auditDetailRefClose() {
      this.$refs.auditDetail.close()
    },
    //抄送详情关闭
    readDetailRefClose() {
      this.$refs.readDetail.close()
    },
    //点击节点
    handleItemClick(item, index) {
      console.log('点击节点', item)
      if (this.isAddCustomForm) return
      if (index > this.current) return
      if (item.type === 0 || item.auditStyleType === 3) {
        return
      }
      if (item.type === 1) {
        this.$refs.auditDetail.open()
      }
      if (item.type === 2) {
        this.$refs.readDetail.open()
      }
      this.selectFlowNode = { ...item }
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-common-check-flow.less';
</style>
