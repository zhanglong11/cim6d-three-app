<template>
  <view class="main">
    <view class="main-body">
      <uni-card>
        <view class="body-hdc">
          <!-- <view class="avatar">
            <image :src="this.$store.state.user.headImage" class="user-avatar" />
          </view> -->
          <view>
            <view>{{ this.$store.state.user.userName }}</view>
            <!-- <view style="font-size: 12px; color: #999">{{ detailInfo.identity }}</view> -->
          </view>
          <view>{{ moment(new Date()).format('YYYY-MM-DD') }}</view>
        </view>
      </uni-card>
      <view class="body-title">
        <view>月度考勤汇总</view>
        <view><span class="body-icon" style="color: #0079fe" @click="openDrawer">打卡月历</span></view>
      </view>
      <uni-card>
        <uni-form-item label="出勤天数">
          <view class="placeholder">{{ detailInfo.attendanceDays ? detailInfo.attendanceDays : 0 }}天</view>
        </uni-form-item>
        <uni-form-item label="正常天数">
          <view class="placeholder">{{ detailInfo.normalDays ? detailInfo.normalDays : 0 }}天</view>
        </uni-form-item>
      </uni-card>
      <section class="container" style="margin-top: 10px">
        <!--上班迟到-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item title="上班迟到" :sum="`${detailInfo.lateList ? detailInfo.lateList.length : 0}`">
              <view v-for="(item, index) of detailInfo.lateList" :key="index" class="item">
                <span>{{ item }}</span>
                <!-- <span>{{ item.hours }}</span> -->
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
        <!--下班早退-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item
              title="下班早退"
              :sum="`${detailInfo.leaveEarlyAfterWorkList ? detailInfo.leaveEarlyAfterWorkList.length : 0}`"
            >
              <view v-for="(item, index) of detailInfo.leaveEarlyAfterWorkList" :key="index" class="item">
                <span>{{ item.date }}</span>
                <span>{{ item.hours }}</span>
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
        <!--下班缺卡-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item
              title="下班缺卡"
              :sum="`${detailInfo.cardMissingAfterWorkList ? detailInfo.cardMissingAfterWorkList.length : 0}`"
            >
              <view v-for="(item, index) of detailInfo.cardMissingAfterWorkList" :key="index" class="item">
                <span>{{ item }}</span>
                <!-- <span>{{ item.hours }}</span> -->
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
        <!--全天缺卡-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item
              title="全天缺卡"
              :sum="`${detailInfo.allDayCardMissingList ? detailInfo.allDayCardMissingList.length : 0}`"
            >
              <view v-for="(item, index) of detailInfo.allDayCardMissingList" :key="index" class="item">
                <span>{{ item }}</span>
                <!-- <span>{{ item.hours }}</span> -->
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
        <!--迟到早退-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item
              title="迟到早退"
              :sum="`${detailInfo.lateLeaveEarlyList ? detailInfo.lateLeaveEarlyList.length : 0}`"
            >
              <view v-for="(item, index) of detailInfo.lateLeaveEarlyList" :key="index" class="item">
                <span>{{ item }}</span>
                <!-- <span>{{ item.hours }}</span> -->
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
        <!--迟到缺卡-->
        <uni-card>
          <uni-collapse accordion="true" class="collapse">
            <uni-collapse-item
              title="迟到缺卡"
              :sum="`${detailInfo.lateCardMissingList ? detailInfo.lateCardMissingList.length : 0}`"
            >
              <view v-for="(item, index) of detailInfo.lateCardMissingList" :key="index" class="item">
                <span>{{ item }}</span>
                <!-- <span>{{ item.hours }}</span> -->
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </uni-card>
      </section>
    </view>
    <div class="btn-wrappers">
      <div class="tabs-wraps">
        <uni-tabs v-model="type" class="default-tabs">
          <uni-tab-pane name="hand" class="hand" label="打卡" @click.native="toHand()" />
          <uni-tab-pane name="send" class="send" label="统计" @click.native="toSend()" />
        </uni-tabs>
      </div>
    </div>
  </view>
</template>

<script>
import Api from './api/index'
import UniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import UniCollapseItem from '@/components/uni-collapse/uni-collapse-item.vue'
export default {
  components: { UniCollapse, UniCollapseItem },
  data() {
    return {
      detailInfo: {},
      type: 'send',
      openId: [],
      dataTime: {
        time: ''
      },
      attendanceGroupType: 1 || '', //类型 1：管理人员 2：劳务人员
      userId: this.$store.state.user.userId //当前用户
    }
  },

  onLoad(options) {
    this.type = options.type ? options.type : 'send'
    this.init()
  },
  methods: {
    // 获取安全管理制度详情
    init() {
      // const data = {
      //   attendanceGroupType: 1 || '', //类型 1：管理人员 2：劳务人员
      //   userId: this.$store.state.user.userId //当前用户
      // }
      Api.getAttendanceClockInTj(this.dataTime).then(res => {
        this.detailInfo = res.data
      })
    },
    // 编辑
    openDrawer() {
      this.$utils.toUrl(`/pages/attendanceManage/clock`)
    },
    //打卡跳转 ?id=${row.safetyEducationVideoId}
    toHand() {
      this.$utils.toUrl(`/pages/attendanceManage/index?type=${this.type}`)
    },
    //统计跳转
    toSend() {
      this.$utils.toUrl(`/pages/attendanceManage/statistics?type=${this.type}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
.placeholder {
  color: @placeholderColor;
}
.safe-data-delete {
  margin-top: 20px;
}
.collapse {
  .item {
    font-size: 14px;
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
