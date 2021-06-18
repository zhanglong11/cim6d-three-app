<template>
  <view class="main">
    <view class="main-body">
      <view>
        <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
          <view class="card">
            <uni-form-item label="危险源名称" isLink prop="dangerSourceId" @click="openDrawer">
              <textarea v-model.trim="form.dangerSource" auto-height disabled placeholder="请选危险源" />
            </uni-form-item>
            <uni-form-item label="伤害类型">
              <view class="disabled">{{ $getLabel(harmTypeList, form.harmCategory) }}</view>
            </uni-form-item>
            <uni-form-item label="防范措施">
              <view class="disabled">{{ form.precautionaryMeasure }}</view>
            </uni-form-item>
            <uni-form-item label="备注">
              <view class="disabled">{{ form.dangerRemark }}</view>
            </uni-form-item>
            <uni-form-item class="file-item" label="附件">
              <uni-attachment v-model="form.dangerFileId"></uni-attachment>
            </uni-form-item>
          </view>
          <view class="card">
            <uni-form-item label="检查结果" isLink prop="firstInspectStatus">
              <uni-select v-model="form.firstInspectStatus" :options="optionList"></uni-select>
            </uni-form-item>
            <block v-if="form.firstInspectStatus === 0">
              <uni-form-item label="所在位置" prop="dangerSourcePlaceId" isLink>
                <uni-select v-model="form.dangerSourcePlaceId" :options="positionList"></uni-select>
              </uni-form-item>
              <uni-form-item label="危险源时效性" prop="timeliness">
                <!--<textarea
                    v-model.trim="form.timeliness"
                    :maxlength="-1"
                    disabled
                    placeholder="危险源位置时效性"
                    auto-height
                  />-->
                <view class="disabled">{{ form.timeliness }}</view>
              </uni-form-item>
              <uni-form-item label="问题描述" prop="problemDesc">
                <textarea v-model.trim="form.problemDesc" :maxlength="-1" placeholder="请输入问题描述" auto-height />
              </uni-form-item>
            </block>
            <uni-form-item class="file-item" label="现场照片" prop="fileId" :isRequired="form.firstInspectStatus === 0">
              <uni-attachment
                :key="'firstInspectStatus' + form.firstInspectStatus"
                v-model="form.fileId"
                uploadType="image"
                edit
              ></uni-attachment>
            </uni-form-item>
            <block v-if="form.firstInspectStatus === 1 || form.firstInspectStatus === null">
              <uni-form-item label="备注" prop="remark">
                <textarea v-model.trim="form.remark" auto-height placeholder="请输入备注" />
              </uni-form-item>
            </block>
            <block v-else>
              <uni-form-item label="整改期限" prop="rectifyDeadline" isLink>
                <uni-date-picker v-model="form.rectifyDeadline" fields="day" mode="date"></uni-date-picker>
              </uni-form-item>
            </block>
          </view>
        </uni-form-custom>
      </view>
      <view class="btn-wrapper">
        <button class="button" :disabled="isLoading" type="primary" @click="handleCheckSubmit">保存</button>
      </view>
    </view>
    <uni-drawer ref="dangerList" :width="700" mode="right">
      <SelectDanger :checkedValue.sync="form.dangerSourceId" @submit="handleSelectSubmit"></SelectDanger>
    </uni-drawer>
  </view>
</template>

<script>
import Api from '@/pages/safety/api'
import { mapGetters } from 'vuex'
import SelectDanger from './selectDanger'
export default {
  name: 'SafetyDangerCheckDetail',
  components: { SelectDanger },
  data() {
    return {
      optionList: [
        { label: '不合格', value: 0 },
        { label: '合格', value: 1 }
      ],
      isLoading: false,
      form: {
        dangerSourceId: '',
        dangerSource: '',
        precautionaryMeasure: '',
        dangerRemark: '',
        dangerFileId: '',
        firstInspectStatus: null,
        remark: '',
        timeliness: '',
        dangerSourcePlaceId: '',
        problemDesc: '',
        fileId: '',
        rectifyDeadline: ''
      },
      rules: {
        dangerSourceId: { required: true },
        firstInspectStatus: { required: true },
        dangerSourcePlaceId: { required: true },
        problemDesc: { required: true },
        rectifyDeadline: { required: true }
      },
      positionList: [], //所选危险源下的位置列表
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['userId']),
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  onLoad(options) {},
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  onShow() {},
  watch: {
    'form.dangerSourcePlaceId': {
      immediate: false,
      handler(val) {
        if (val) {
          this.handlePositionChange(val)
        }
      }
    },
    'form.dangerSourceId': {
      immediate: false,
      handler(val) {
        if (val || val === 0) {
          this.getPositionList()
        }
      }
    }
  },
  mounted() {},
  methods: {
    openDrawer() {
      this.$refs.dangerList.open()
    },
    //选择危险源提交
    handleSelectSubmit(data) {
      this.form.dangerSource = data.dangerSource
      this.form.dangerSourceId = data.id
      this.form.harmCategory = data.harmCategory
      this.form.precautionaryMeasure = data.precautionaryMeasure
      this.form.dangerRemark = data.remark
      this.form.dangerFileId = data.fileId
      this.$refs.dangerList.close()
      this.getPositionList()
    },
    //获取危险源位置列表
    async getPositionList() {
      let res = await Api.getPositionList(this.form.dangerSourceId)
      this.positionList =
        (res.data &&
          res.data.map(item => {
            return {
              ...item,
              name: item.placeName,
              label: item.placeName,
              value: item.id
            }
          })) ||
        []
    },
    //危险源位置改变时
    handlePositionChange(val) {
      let selectPosition = this.positionList.filter(item => item.id === val)[0]
      this.form.timeliness = `${this.moment(selectPosition.timelinessStartTime).format('YYYY-MM-DD')}~${this.moment(
        selectPosition.timelinessEndTime
      ).format('YYYY-MM-DD')}`
    },
    //检查保存
    async handleCheckSubmit() {
      await this.$refs.form.validate()
      if (this.form.firstInspectStatus === 0) {
        if (!this.form.fileId) {
          this.$utils.showToast('现场附件不能为空')
          return false
        }
      }
      await Api.addDangerInspect(this.form)
      this.$utils.showToast('提交成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
@import url('~@/pages/quality/add.less');
</style>
