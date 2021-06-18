<template>
  <view class="main">
    <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
      <uni-card isForm>
        <uni-form-item label="巡更点名称" prop="patrolLocationName" isRequired>
          <textarea v-model.trim="form.patrolLocationName" auto-height placeholder="请输入巡更点名称" />
        </uni-form-item>
        <uni-form-item label="打卡地点">
          <textarea v-model.trim="form.clockInPlace" auto-height placeholder="自动获取打卡地点" disabled />
        </uni-form-item>
        <uni-form-item class="file-item" label="打卡拍照" prop="attachment">
          <uni-attachment v-model="form.attachment" uploadType="image" edit :sourceType="sourceType"></uni-attachment>
        </uni-form-item>
        <uni-form-item class="file-item" label="备注">
          <textarea v-model.trim="form.remark" auto-height placeholder="请输入备注信息" />
        </uni-form-item>
      </uni-card>
    </uni-form-custom>

    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleSave()">保存</button>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      form: {
        clockInPlace: '',
        clockInPlaceInfo: '', //打卡地点经纬度
        patrolLocationInfo: '' //巡更点经纬度
      },
      rules: {
        videoName: { required: true },
        defaultFlag: { required: true },
        attachment: { required: true },
        remark: { required: true }
      },
      sourceType: ['camera'],
      isLoading: false,
      isSave: false // 是否保存
    }
  },
  onLoad(options) {
    let id = options.id
    if (!id) return
    this.init(options.id)
  },
  created() {
    this.getLocation()
  },
  // 返回拦截
  onBackPress(obj) {
    const $utils = this.$utils
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  methods: {
    //自动获取打卡地点 JKTBZ-IA5RD-CKB47-PWE3E-V7DI2-UFBHP
    getLocation() {
      let self = this
      console.log(uni)
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        success: function (res) {
          // console.log(1111, res)
          if (res.address) {
            self.form.clockInPlace =
              res.address.province + res.address.city + res.address.district + (res.address.poiName || '')
          }
          self.form.clockInPlaceInfo = res.longitude + ',' + res.latitude
          self.form.patrolLocationInfo = res.longitude + ',' + res.latitude
          // console.log('当前位置的经度：' + res.longitude)
          // console.log('当前位置的纬度：' + res.latitude)
        },
        fail: function (err) {
          console.log(err)
        }
      })
    },

    // 编辑时，获取资料详情
    init(id) {
      this.form.patrolClockInId = id
    },
    onShow() {
      if (this.form.patrolClockInId) {
        this.getCheckSpecificDetail()
        this.$utils.setTitle('编辑巡更打卡')
      }
    },
    getCheckSpecificDetail() {
      Api.getClockDetail(this.form.patrolClockInId).then(res => {
        this.form = res.data
      })
    },

    // 保存
    async handleSave() {
      await this.$refs.form.validate()
      this.isLoading = true
      let projectId = this.$store.state.project.projectId
      if (this.form.patrolClockInId) {
        Api.getClockUpdate({
          ...this.form,
          projectId
        }).then(
          res => {
            this.$utils.showToast('保存成功')
            this.isSave = true
            setTimeout(() => {
              this.isLoading = false
              this.$utils.goBack(2)
            }, 1000)
          },
          err => {
            this.isLoading = false
          }
        )
      } else {
        Api.getClockAdd({
          ...this.form,
          projectId
        }).then(
          res => {
            this.$utils.showToast('保存成功')
            this.isSave = true
            setTimeout(() => {
              this.isLoading = false
              this.$utils.goBack()
            }, 1000)
          },
          err => {
            this.isLoading = false
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../add.less');
</style>
