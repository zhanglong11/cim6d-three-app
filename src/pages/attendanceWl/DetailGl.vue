<template>
  <view class="main">
    <view class="main-body">
      <view class="day-one">
        <view class="title"> 昨日出勤统计 </view>
        <view class="card-body">
          <ring-chart
            v-if="safetyOptions && safetyOptions.series && safetyOptions.series.length"
            :dataAs="safetyOptions"
            :colors="color"
          />
          <view v-else class="empty-wrapper">
            <image src="../../static/images/empty.png"></image>
          </view>
          <view>
            <EchartsLar container="containergl" :dataList="dataList" />
          </view>
        </view>
      </view>
      <view class="day-two">
        <view class="title-item">
          <view class="title">考勤异常人员</view>
          <view>
            <uni-tabs v-model="mode">
              <uni-tab-pane name="1" label="昨日"></uni-tab-pane>
              <uni-tab-pane name="2" label="本月"></uni-tab-pane>
            </uni-tabs>
          </view>
        </view>
        <view>
          <view v-if="mode === '1'">
            <uni-card v-for="(item, index) of detailGlList" :key="index">
              <view class="card-body">
                <view class="card-info">
                  <view class="title">
                    <view>{{ item.name }}</view>
                    <!-- <view class="desc">经理</view> -->
                  </view>
                  <view class="titles">{{ item.deptName ? item.deptName : '' }}</view>
                  <!-- <view class="desc">{{ item.allStatus }}</view> -->
                  <!-- <span :class="`work-item-type work-type-${e.type}`"> -->
                  <view class="desc"><uni-status :options="readStatus" :value="item.allStatus"></uni-status></view>
                </view>
              </view>
            </uni-card>
            <uni-card v-if="detailGlList.length === 0">
              <view class="card-body">
                <view style="text-align: center; font-size: 14px">暂无信息</view>
              </view>
            </uni-card>
          </view>
          <view v-if="mode === '2'">
            <view v-for="(item, index) of objMoneyGlListData" :key="index" style="margin-bottom: 10px">
              <view style="font-size: 12px; margin-left: 5px"
                ><uni-status :options="readStatus" :value="item.allStatus"></uni-status
              ></view>
              <uni-card v-for="(items, indexss) of item.children" :key="indexss">
                <view class="card-body">
                  <view class="card-info">
                    <view class="title">
                      <view>{{ items.name }}</view>
                    </view>
                    <view class="titles">{{ items.deptName ? items.deptName : '' }}</view>
                    <!-- :class="`work-item-type work-type-${e.type}`" -->
                    <view :class="`desc desc-${item.allStatus}`">{{ items.count }}</view>
                  </view>
                </view>
              </uni-card>
            </view>
            <uni-card v-if="detailGlList.length === 0">
              <view class="card-body">
                <view style="text-align: center; font-size: 14px">暂无信息</view>
              </view>
            </uni-card>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import RingChart from '@/components/stan-ucharts/RingChart.vue'
import EchartsLar from './echarts.vue'
import readStatus from './lib/readStatus'
import api from './api'
export default {
  components: { RingChart, EchartsLar },
  data() {
    return {
      readStatus,
      mode: '1', // 默认日
      formMode: {
        timeSpan: 1 //日 2月
      },
      // 安全检查数据
      safetyOptions: {
        title: {
          name: '总人数',
          fontSize: 16
        },
        subtitle: {
          name: '',
          fontSize: 14
        },
        legend: {
          show: false
        },
        series: []
      },
      dataList: {
        ydataText: ['正常上班', '上班迟到', '下班早退', '下班缺卡', '全天缺卡', '迟到早退', '迟到缺卡'],
        xdata: []
      },
      color: ['#7495fd', '#c366ff', '#ff7676', '#ffaea0', '#ffd988', '#58c799', '#84e3ee'],
      detailGlList: [],
      objMoneyGlListData: []
    }
  },
  watch: {
    mode(e) {
      this.formMode.timeSpan = e
      this.getCheckSpecificdetaildl()
    }
  },
  created() {
    this.getEmploeeKqinInfo()
    this.getCheckSpecificdetaildl()
  },
  methods: {
    //异常信息获取
    async getCheckSpecificdetaildl() {
      await api.getDeGlInformation(this.formMode).then(res => {
        this.detailGlList = res.data || []
        let obj = {}
        res.data.map((item, index) => {
          let { allStatus } = item
          if (!obj[allStatus]) {
            obj[allStatus] = {
              allStatus,
              children: []
            }
          }
          obj[allStatus].children.push(item)
        })
        // console.log(Object.values(obj))
        this.objMoneyGlListData = Object.values(obj)
      })
    },
    //图表信息获取
    async getEmploeeKqinInfo() {
      await api.getEmploeeKqinInfo().then(res => {
        let datas = res.data
        console.log(res.data)
        this.safetyOptions.subtitle.name = datas.total + '人' || 0 + '人'
        this.safetyOptions.series = [
          { name: '正常上班', data: parseInt(datas.normalNumber) },
          { name: '上班迟到', data: parseInt(datas.lateNumber) },
          { name: '下班早退', data: parseInt(datas.leaveEarlyAfterWorkNumber) },
          { name: '下班缺卡', data: parseInt(datas.cardMissingAfterWorkNumber) },
          { name: '全天缺卡', data: parseInt(datas.allDayCardMissingNumber) },
          { name: '迟到早退', data: parseInt(datas.lateLeaveEarlyNumber) },
          { name: '迟到缺卡', data: parseInt(datas.lateCardMissingNumber) }
        ]
        this.dataList.xdata = this.safetyOptions.series.map(e => e.data)
        console.log(this.dataList.xdata)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/common.less';
.main {
  .main-body {
    .title {
      margin-bottom: 10px;
    }
  }
  .card-body {
    background: #fff;
  }
  .day-two {
    padding: 30px 0;
    .title-item {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/.item .wrap {
        width: 80px;
      }
    }
    .card-body {
      padding: 31px;
      color: @h2FontColor;
      .card-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: @h2FontSize;
          font-weight: bold;
          // margin-bottom: 15px;
          color: #020202;

          .ellipsis;
        }
        .titles {
          font-size: @h2FontSize;
          // margin-bottom: 15px;
          color: #999;

          .ellipsis;
        }
        .desc {
          color: #999;
          font-size: 12px;
        }

        .desc-2 {
          color: #ffaea0;
        }

        .desc-3 {
          color: #ff7676;
        }

        .desc-4 {
          color: #c366ff;
        }

        .desc-5 {
          color: #58c799;
        }

        .desc-6 {
          color: #84e3ee;
        }

        .desc-7 {
          color: #ffd988;
        }
      }
    }
  }
}
</style>
