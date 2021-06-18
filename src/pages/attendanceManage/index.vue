<template>
  <view class="wrap">
    <view>
      <view v-if="showModel">
        <view class="videos">
          <uni-attachment v-model="vodoData.attachment" uploadType="video" autoplay></uni-attachment>
        </view>

        <view class="tip">请查看安全教育视频后再入场施工</view>
        <section class="container">
          <view class="body-main">
            <i class="icon-m"></i>
            <span class="tip"> 上班打卡：{{ kaoqinTime.workTime }}</span>
          </view>
        </section>
      </view>
      <view v-else>
        <view class="main-headers">
          <view>
            <view>{{ this.$store.state.user.userName }}</view>
            <view style="font-size: 12px; color: #999"></view>
          </view>
          <view>{{ moment(new Date()).format('YYYY-MM-DD') }}</view>
        </view>
        <section class="container">
          <view class="body-main">
            <uni-step :options="dataList1" @showModelTrue="showModelTrue"></uni-step>
          </view>
        </section>
      </view>
    </view>
    <section class="container">
      <view v-if="showGetClick === true">
        <view class="body-header">
          <view class="body-item">
            <view style="color: #fff; font-size: 16px" @click="gitCick()"> {{ status }} </view>
            <view style="color: #fff; font-size: 14px"> {{ hms }} </view>
          </view>
        </view>
        <view>
          <view class="item-desc">{{ locationDesc }}</view>
        </view>
      </view>
      <view v-else>
        <view class="colck-update" @click="getUpdate">更新打卡</view>
      </view>
    </section>
    <div class="btn-wrappers">
      <div class="tabs-wraps">
        <uni-tabs v-model="type" class="default-tabs">
          <uni-tab-pane name="hand" class="hand" label="打卡" @click.native="toHand()" />
          <uni-tab-pane name="send" class="send" label="统计" @click.native="toSend()" />
        </uni-tabs>
      </div>
    </div>
    <!-- 无数据空载页 end -->
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="输入备注信息?"
        :before-close="true"
        class="dialog"
        @close="deleteClose"
        @confirm="deleteConfirm"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import api from './api'
import moment from 'moment'
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
export default {
  components: { UniPopupDialog },
  data() {
    return {
      type: 'hand',
      showModel: true,
      status: '上班打卡',
      modelFlag: '',
      locationDesc: '',
      gitCickStus: false,
      showGetClick: true,
      hms: '',
      ymd: '',
      timer: null,
      userType: 1,
      locationData: {
        userId: this.$store.state.user.userId,
        userType: 1,
        phone: this.$store.state.user.mobile,
        projectId: this.$store.state.project.projectId
      },
      locationDataList: {
        userId: this.$store.state.user.userId
      },
      dataList1: [],
      formData: {},
      vodoData: {},
      attachment: '',
      kaoqinTime: [],
      isLoading: false
    }
  },
  onShow() {
    this.init()
  },

  onLoad(options) {
    this.type = options.type ? options.type : 'hand'
  },
  methods: {
    init() {
      this.getPhoneList()
      this.getTime()
      this.countDown()
      this.getLocation()
      this.getAttendanceClockInInfo()
      this.getViod()
    },
    getPhoneList() {
      let data = {
        attendanceGroupType: this.userType,
        mobile: this.$store.state.user.mobile
      }
      api.getPhoneList(data).then(res => {
        this.kaoqinTime = res.data || []
        if (!this.kaoqinTime.workTime) {
          let _this = this
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: '您不在考勤组内，请联系管理员将您录入考勤系统！',
            success: function (res) {
              if (res.confirm) {
                _this.$utils.goBack(1)
              }
            }
          })
        }
      })
    },
    getViod() {
      api.getAttendanceClocVideo().then(res => {
        this.vodoData = res.data || {}
      })
    },
    //备注类型
    deleteConfirm(done, value) {
      const dataRemak = {
        phone: this.$store.state.user.mobile
      }
      if (this.modelFlag === 'lateRemark') {
        dataRemak.lateRemark = value
      } else if (this.modelFlag === 'leaveEarlyRemark') {
        dataRemak.leaveEarlyRemark = value
      }
      api.getRemarklInformation(dataRemak).then(res => {
        if (res.code === 200) {
          // this.$utils.showToast('添加成功')
          this.getAttendanceClockInInfo()
          uni.hideLoading()
        }
      })

      done()
      this.$utils.showToast('添加成功')
      this.getAttendanceClockInInfo()
    },
    //取消备注
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    showModelTrue(val) {
      if (!val) return
      this.modelFlag = val.flag
      this.$refs.deletePopup.open()
    },
    // 获取当前时间
    getTime() {
      const nowData = this.$utils.getDateAll(new Date(), 'dateTimeObject')
      this.hms = nowData.time
      this.ymd = nowData.data
    },
    // 倒计时
    countDown() {
      this.timer = setInterval(() => {
        this.getTime()
      }, 1000)
    },

    //获取当前位置
    getLocation() {
      let self = this
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        success: function (res) {
          // console.log('当前位置的经度：' + res.longitude)
          // console.log('当前位置的纬度：' + res.latitude)
          self.locationDataList.longitudeAndLatitudeStr = res.longitude + ',' + res.latitude
          self.getAttendanceClockInRange()
          if (res.address) {
            self.locationData.clockLocation =
              res.address.province + res.address.city + res.address.district + (res.address.poiName || '') //地址信息
          }
        }
      })
    },
    // 是否在打卡范围内
    async getAttendanceClockInRange() {
      // this.locationDataList.longitudeAndLatitudeStr = '112.379972,34.667107' //测试点
      api.getAttendanceClockInRange(this.locationDataList).then(res => {
        // console.log('是否在打卡范围内', res.data)
        if (res.code === 200 && res.data === true) {
          this.gitCickStus = true
          this.locationDesc = '已进入考勤范围'
        } else if (res.data === false) {
          this.gitCickStus = false
          this.locationDesc = '不在考勤范围内'
        } else {
          this.locationDesc = ''
        }
      })
    },
    //打卡
    gitCick() {
      this.isLoading = true
      if (this.gitCickStus === false) {
        return uni.showToast({ title: '不在考勤范围内不允许打卡', icon: 'none', duration: 2000 })
      }
      // this.locationData.clockLocation = '河南省洛阳市涧西区河南科技大学(西苑校区)' //测试点
      let data = _.cloneDeep(this.locationData)
      api.getAttendanceClockIn([data]).then(res => {
        if (res.code === 200) {
          this.status = '下班打卡'
          this.showModel = false
          this.isLoading = false
          this.getAttendanceClockInInfo()
        }
      })
    },
    //获取打卡信息
    getAttendanceClockInInfo() {
      const data = {
        phoneList: [this.$store.state.user.mobile],
        projectId: this.$store.state.project.projectId,
        time: moment(new Date()).format('YYYY-MM-DD'),
        userType: 1
      }
      api.getAttendanceClockInInfo(data).then(res => {
        if (res.code === 200) {
          console.log('获取打卡信息', res.data)

          this.formData = res.data[0] || []
          // 是否完成打卡
          // this.showModel = false //这里的管
          if (this.formData.workClockInLocation) {
            this.showModel = false //这里的
            this.status = '下班打卡'
          }
          if (this.formData.offDutyClockInTime) {
            this.showGetClick = false
          }

          //展示数据
          this.dataList1 = [
            {
              title: this.formData.ruleWorkClockInTime,
              desc: this.formData.workClockInTime,
              address: this.formData.workClockInLocation,
              workClockInStatus: this.formData.workClockInStatus,
              lateRemark: this.formData.lateRemark
            },
            {
              title: this.formData.ruleOffDutyClockInTime,
              desc: this.formData.offDutyClockInTime,
              address: this.formData.offDutyClockInLocation,
              offDutyClockInStatus: this.formData.offDutyClockInStatus,
              leaveEarlyRemark: this.formData.leaveEarlyRemark
            }
          ]
          // console.log(this.dataList1)
        }
      })
    },
    //打卡跳转
    toHand() {
      this.$utils.toUrl(`/pages/attendanceManage/index?type=${this.type}`)
    },
    //统计跳转
    toSend() {
      this.$utils.toUrl(`/pages/attendanceManage/statistics?type=${this.type}`)
    },
    // 更新
    getUpdate() {
      // this.locationData.clockLocation = '河南省洛阳市涧西区河南科技大学(西苑校区)' //测试点
      let data = _.cloneDeep(this.locationData)
      uni.showModal({
        title: '提示',
        content: '确认要更新此次打卡记录吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '更新中' })
            api.getAttendanceClockIn([data]).then(res => {
              if (res.code === 200) {
                this.getAttendanceClockInInfo()
                uni.hideLoading()
                // this.$utils.goBack()
              }
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
/deep/.video-list {
  display: flex;
  //flex-direction: column;

  li {
    width: 100%;
    video {
      width: 100%;
      height: 442px;
    }
  }
}
.dialog {
}
@import url('index.less');
</style>
