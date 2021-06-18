<template>
  <div class="main is-white">
    <scroll-view scroll-y class="scroll-roll list">
      <view class="main-body">
        <!-- 项目概况 start -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-info"></view>
              <text>项目状况</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count danger">{{ procedureInfo.finishedCount }}</view>
                <view class="subItem-text border">完成任务</view>
              </view>
              <view class="subItem">
                <view class="subItem-count"
                  >{{
                    procedureInfo.taskCount && toFixed((procedureInfo.finishedCount * 100) / procedureInfo.taskCount)
                  }}%</view
                >
                <view class="subItem-text border">完成度</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ procedureInfo.postponedCount }}</view>
                <view class="subItem-text border">延期任务</view>
              </view>
              <view class="subItem">
                <view class="subItem-count"
                  >{{
                    procedureInfo.postponedCount &&
                    toFixed((procedureInfo.postponedCount * 100) / procedureInfo.taskCount)
                  }}%</view
                >
                <view class="subItem-text"> 延期率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <ring-chart
              v-if="procedureOption && procedureOption.series && procedureOption.series.length"
              :dataAs="procedureOption"
              canvasId="procedure"
            />
            <view v-else class="empty-wrapper">
              <image src="../../static/images/empty.png"></image>
            </view>
          </view>
          <view class="card-footer border-top">
            <text>数据更新时间:{{ updateTime }}</text>
          </view>
        </uni-card>
        <!-- 项目状况end  -->
        <!-- 质量检查 start  -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-inspect"></view>
              <text>质量检查</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count danger">{{ qualityInfo.problemNum || '-' }}</view>
                <view class="subItem-text border">问题数量</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ qualityInfo.toReviewedNum || '-' }}</view>
                <view class="subItem-text border">待复查</view>
              </view>
              <view class="subItem">
                <view class="subItem-count">{{ qualityInfo.reviewPassRate || '-' }}%</view>
                <view class="subItem-text border">复查合格率</view>
              </view>
              <view class="subItem">
                <view class="subItem-count">{{ qualityInfo.timelyRectifyRate || '-' }}%</view>
                <view class="subItem-text"> 及时整改率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <ring-chart
              v-if="qualityOptions && qualityOptions.series && qualityOptions.series.length"
              :dataAs="qualityOptions"
              canvasId="inspect"
            />
            <view v-else class="empty-wrapper">
              <image src="../../static/images/empty.png"></image>
            </view>
          </view>
          <view class="card-footer border-top">
            <text>数据更新时间:{{ updateTime }}</text>
            <text class="moreTip" @click="$utils.toUrl('/pages/quality/index')">查看更多</text>
          </view>
        </uni-card>
        <!-- 质量检查 end  -->
        <!--  -->
        <!-- 安全检查 start  -->
        <uni-card>
          <view class="card-header">
            <view class="title">
              <view class="icon icon-board-safe"></view>
              <text>安全检查</text>
            </view>
            <view class="subTitle border-bottom">
              <view class="subItem">
                <view class="subItem-count danger">{{ safetyInfo.problemNum || '-' }}</view>
                <view class="subItem-text border">问题数量</view>
              </view>
              <view class="subItem">
                <view class="subItem-count warn">{{ safetyInfo.toReviewedNum || '-' }}</view>
                <view class="subItem-text border">待复查</view>
              </view>
              <view class="subItem">
                <view class="subItem-count">{{ safetyInfo.reviewPassRate || '-' }}%</view>
                <view class="subItem-text border">复查合格率</view>
              </view>
              <view class="subItem">
                <view class="subItem-count">{{ safetyInfo.timelyRectifyRate || '-' }}%</view>
                <view class="subItem-text"> 及时整改率</view>
              </view>
            </view>
          </view>
          <view class="card-body">
            <ring-chart
              v-if="safetyOptions && safetyOptions.series && safetyOptions.series.length"
              :dataAs="safetyOptions"
              canvasId="safe"
            />
            <view v-else class="empty-wrapper">
              <image src="../../static/images/empty.png"></image>
            </view>
          </view>
          <view class="card-footer border-top">
            <text>数据更新时间:{{ updateTime }}</text>
            <text class="moreTip" @click="$utils.toUrl('/pages/safety/issue/index')">查看更多</text>
          </view>
        </uni-card>
        <!-- 安全检查 end  -->
      </view>
    </scroll-view>
  </div>
</template>

<script>
import RingChart from '@/components/stan-ucharts/RingChart.vue'
import { mapGetters } from 'vuex'
import Api from './api'
import moment from 'moment'
export default {
  name: 'Project',
  components: {
    RingChart
  },
  data() {
    return {
      updateTime: moment().format('HH:mm'),
      // 项目状况数据,
      procedureType: 'month',
      procedureInfo: {},
      procedureOption: {
        series: [
          {
            name: '未领取',
            data: 0,
            color: '#d4d4d4'
          },
          {
            name: `已领取`,
            data: 0,
            color: '#59a9ff'
          },
          {
            name: '超前完成',
            data: 0,
            color: '#00ff2a'
          },
          {
            name: '正常完成',
            data: 0,
            color: '#268dfe'
          },
          {
            name: '滞后完成',
            data: 0,
            color: '#f1cc0b'
          },
          {
            name: '未完成',
            data: 0,
            color: '#f11717'
          }
        ],
        title: {
          name: '-',
          color: '#000',
          fontSize: 16
        },
        subtitle: {
          name: '总任务数',
          color: '#000',
          fontSize: 15
        }
      },
      qualityInfo: {},
      // 质量检查数据
      qualityOptions: {
        series: [
          {
            name: '待整改',
            data: 0,
            color: '#268dfe'
          },
          {
            name: '待复查',
            data: 0,
            color: '#ffcd69'
          },
          {
            name: '合格',
            data: 0,
            color: '#ff9326'
          }
        ]
      },
      safetyInfo: {},
      // 安全检查数据
      safetyOptions: {
        series: [
          {
            name: '待整改',
            data: 0,
            color: '#268dfe'
          },
          {
            name: '待复查',
            data: 0,
            color: '#ffcd69'
          },
          {
            name: '合格',
            data: 0,
            color: '#ff9326'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },

  onShow() {
    this.init()
  },
  methods: {
    init() {
      this.initProcedureInfo()
      this.initQualityInfo()
      // this.initSafetyInfo()
    },
    // 初始化项目状况
    async initProcedureInfo() {
      let result = await Api.getProcedureInfo()
      this.procedureInfo = result.data || {}
      this.formatProcedureOption()
    },
    //格式化项目状况图表数据
    formatProcedureOption() {
      this.procedureOption = {
        series: [
          {
            name: `未领取`,
            data: this.procedureInfo.unReceivedCount,
            color: '#d4d4d4'
          },
          {
            name: `已领取`,
            data: this.procedureInfo.beReceivedCount,
            color: '#59a9ff'
          },
          {
            name: `超前完成`,
            data: this.procedureInfo.advanceCompletedCount,
            color: '#00ff2a'
          },
          {
            name: `正常完成`,
            data: this.procedureInfo.beCompletedCount,
            color: '#5fdb94'
          },
          {
            name: `滞后完成`,
            data: this.procedureInfo.delayCompletedCount,
            color: '#f1cc0b'
          },
          {
            name: `未完成`,
            data: this.procedureInfo.unCompletedCount,
            color: '#f11717'
          }
        ],
        title: {
          name: this.procedureInfo.taskCount,
          color: '#000',
          fontSize: 16
        },
        subtitle: {
          name: '总任务数',
          color: '#000',
          fontSize: 15
        }
      }
    },
    // 获取质量/安全检查统计信息
    async initQualityInfo() {
      let res = await Api.getQualityInfo()
      if (!res.data) {
        return
      }
      this.qualityInfo = this._.find(res.data, { inspectType: 1 })
      this.safetyInfo = this._.find(res.data, { inspectType: 2 })
      this.qualityOptions = {
        series: [
          {
            name: '待整改',
            data: this.qualityInfo.toRectifiedNum,
            color: '#268dfe'
          },
          {
            name: '待复查',
            data: this.qualityInfo.toReviewedNum,
            color: '#ffcd69'
          },
          {
            name: '合格',
            data: this.qualityInfo.reviewPassNum,
            color: '#00ff2a'
          }
        ]
      }
      this.safetyOptions = {
        series: [
          {
            name: '待整改',
            data: this.safetyInfo.toRectifiedNum,
            color: '#268dfe'
          },
          {
            name: '待复查',
            data: this.safetyInfo.toReviewedNum,
            color: '#ffcd69'
          },
          {
            name: '合格',
            data: this.safetyInfo.reviewPassNum,
            color: '#00ff2a'
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="less">
@import url('./index.less');
</style>
