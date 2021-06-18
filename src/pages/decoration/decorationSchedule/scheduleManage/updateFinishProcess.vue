<template>
  <view class="main">
    <view class="info-view">房间号：{{ detailData.roomDetailName }}</view>
    <view class="info-view">使用工序组：{{ detailData.procedureGroupName }}</view>
    <view class="info-view">工序名称：{{ detailData.procedureName }}</view>

    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view v-for="(form, index) in forms" :key="index" class="form-card">
          <view class="header">
            <view>{{ index + 1 }}：<span class="title">工序负责班组</span></view>
            <view class="operation">
              <a @click="handleRemove(index)">删除</a>
              <a @click="handleClone(index)">复制</a>
            </view>
          </view>
          <uni-form-custom :ref="`form${index}`" :model="form" :rules="rules">
            <uni-form-item label="劳务公司" prop="companyId">
              <uni-select
                v-model="form.companyId"
                :options="companyList"
                @input="
                  val => {
                    handleChangeCompany(val, index)
                  }
                "
              ></uni-select>
            </uni-form-item>
            <uni-form-item label="负责班组" prop="labourGroupId">
              <uni-select v-model="form.labourGroupId" :options="form.groupList"></uni-select>
            </uni-form-item>
            <uni-form-item label="人工费用" prop="labourStaffCosts">
              <input v-model.number="form.labourStaffCosts" type="number" class="uni-input" placeholder="点击输入" />
            </uni-form-item>

            <!--工序耗材展示--开始-->
            <uni-form-item label="工序耗材">
              <uni-icons
                class="icon"
                color="#2EB04C"
                type="plus-filled"
                size="24"
                @click="handleOpenDrawer(index)"
              ></uni-icons>
            </uni-form-item>
            <view class="materials-con">
              <view v-for="(row, index) in form.tableData" :key="index" class="materials-item">
                <view class="title">{{ row.name }}</view>
                <view class="detail">
                  <view class="detail-item">
                    <view class="label">型号</view>
                    <view class="value">{{ row.models }}</view>
                  </view>
                  <view class="detail-item">
                    <view class="label">用量</view>
                    <view class="value">
                      <input v-model.number="row.dosage" type="number" class="uni-input" placeholder="点击输入" />
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!--工序耗材展示--结束-->

            <uni-form-item label="附件">
              <uni-attachment v-model="form.fileId" edit></uni-attachment>
            </uni-form-item>
          </uni-form-custom>
        </view>
      </view>
    </scroll-view>

    <div v-if="forms.length === 0" class="no-data">暂无班组信息</div>

    <view class="btn-wrapper">
      <button class="button" @click="handleDutyGroup">新增工序负责班组</button>
      <br />
      <button class="button" type="primary" :loading="btnLoading" :disabled="btnLoading" @click="handleSubmit">
        提 交
      </button>
    </view>

    <!--材料选择框组件--开始-->
    <uni-drawer ref="productList" :width="750" mode="right">
      <materials-select @selected="handleMaterialsSelected" />
    </uni-drawer>
    <!--材料选择框组件--结束-->
  </view>
</template>

<script>
import Api from './api'
import MaterialsSelect from './materialsSelect'
export default {
  components: { MaterialsSelect },
  data() {
    return {
      forms: [],
      rules: {
        companyId: [{ required: true, message: '请选择劳务公司' }],
        labourGroupId: [{ required: true, message: '请选择劳务公司下的班组' }],
        labourStaffCosts: [{ required: true, message: '请输入当前工序下的人工费用' }]
      },
      companyList: [],
      groupIndex: null,
      detailData: {},
      btnLoading: false
    }
  },
  onLoad(options) {
    this.scheduleId = options.scheduleId || ''
    this.scheduleProcedureId = options.scheduleProcedureId || ''
  },
  async created() {
    if (this.scheduleProcedureId) {
      uni.showLoading()
      await this.getLabourCompanyAndGroup()
      await this.getScheduleProcedureDetail(this.scheduleProcedureId)
      uni.hideLoading()
      // 修改完成工序，进行班组数据回显
      // console.log(this.detailData)
      let labourInfoList = this.detailData.labourInfoList
      for (let i = 0; i < labourInfoList.length; i++) {
        let labourInfo = labourInfoList[i]
        let groupList = []
        // 初始组列表
        for (let k = 0; k < this.companyList.length; k++) {
          if (labourInfo.companyId === this.companyList[k].value) {
            groupList = this.companyList[k].groupList
            break
          }
        }
        this.forms.push({
          labourStaffCosts: labourInfo.labourStaffCosts,
          companyId: labourInfo.companyId,
          labourGroupId: labourInfo.labourGroupId,
          groupList: groupList,
          tableData: labourInfo.materialList ? _.cloneDeep(labourInfo.materialList) : [],
          fileId: labourInfo.fileId
        })
      }
    }
  },
  methods: {
    // 获取进度(房间号、工序组名称)工序(工序名称、标准耗材)详情
    async getScheduleProcedureDetail(id) {
      let res = await Api.getScheduleProcedureDetail(id)
      // console.log(res)
      this.detailData = res.data
    },
    // 获取劳务公司列表
    async getLabourCompanyAndGroup() {
      let res = await Api.getLabourCompanyAndGroup({})
      // console.log(res)
      let companyList = res.data
      for (let i = 0; i < companyList.length; i++) {
        let company = companyList[i]
        company.label = company.name
        company.value = company.id
        let groupList = company.groupList
        for (let k = 0; k < groupList.length; k++) {
          let group = groupList[k]
          group.label = group.name
          group.value = group.id
        }
      }
      this.companyList = companyList
    },
    // 新增工序负责班组
    handleDutyGroup() {
      this.forms.push({
        labourStaffCosts: undefined,
        companyId: '',
        labourGroupId: '',
        groupList: [],
        tableData: _.cloneDeep(this.detailData.procedureStandardMaterialList),
        fileId: ''
      })
    },
    // 劳务公司变更
    handleChangeCompany(companyId, index) {
      this.forms[index].groupList = [] // 清空下拉框集
      this.forms[index].labourGroupId = '' // 清空组选中值
      for (let i = 0; i < this.companyList.length; i++) {
        if (companyId === this.companyList[i].value) {
          this.forms[index].groupList = this.companyList[i].groupList
          break
        }
      }
    },
    // 打开材料选择框
    handleOpenDrawer(index) {
      this.$refs.productList.open()
      this.groupIndex = index
    },
    // 选中物料后数据回传处理
    handleMaterialsSelected(row) {
      if (row) {
        let formTableData = this.forms[this.groupIndex].tableData
        // console.log(row)
        for (let i = 0; i < formTableData.length; i++) {
          if (formTableData[i].materialId === row.id) {
            this.$utils.showToast('存在材料重复，请重新选择')
            return
          }
        }
        row.dosage = ''
        row.materialId = row.id
        formTableData.push(row)
      }
      this.$refs.productList.close()
      this.groupIndex = null
    },
    // 删除工序负责班组
    handleRemove(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除工序负责班组？',
        success: res => {
          if (res.confirm) {
            this.forms.splice(index, 1)
          }
        }
      })
    },
    // 复制工序负责班组
    handleClone(index) {
      let cloneData = _.cloneDeep(this.forms[index])
      this.forms.push(cloneData)
    },
    // 提交
    handleSubmit() {
      Promise.all(
        this.forms.map((form, index) => {
          return this.$refs['form' + index][0].validate()
        })
      ).then(res => {
        // console.log(res)
        // console.log(this.forms)
        let params = {
          labourList: [],
          scheduleId: this.scheduleId,
          scheduleProcedureId: this.scheduleProcedureId
        }
        for (let i = 0; i < this.forms.length; i++) {
          let form = this.forms[i]
          let labour = {
            fileId: form.fileId,
            labourGroupId: form.labourGroupId,
            labourStaffCosts: form.labourStaffCosts,
            materialList: []
          }
          for (let j = 0; j < form.tableData.length; j++) {
            let material = form.tableData[j]
            if (material.dosage && material.dosage !== 0) {
              // 过滤每个负责班组用量为0的材料
              labour.materialList.push({
                dosage: material.dosage,
                materialId: material.materialId
              })
            }
          }
          params.labourList.push(labour)
        }
        // console.log(params)
        this.btnLoading = true
        Api.updateCompleteScheduleProcedure(params).then(
          res => {
            this.$utils.showToast('操作成功')
            setTimeout(() => {
              this.btnLoading = false
              this.$utils.goBack()
            }, 1000)
          },
          err => {
            this.btnLoading = false
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./finishProcess.less');
</style>
