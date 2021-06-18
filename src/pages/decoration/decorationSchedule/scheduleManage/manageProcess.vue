<template>
  <view class="main">
    <view class="radio-con">
      <view
        v-for="(item, index) in processStateList"
        :key="index"
        :class="['radio-item', item.value === processState ? 'active' : '']"
        @click="handleFilter(item.value)"
        >{{ item.label }}</view
      >
    </view>
    <view class="main-body">
      <block>
        <uni-card v-for="(item, index) in processList" :key="index" @click.native="toDetail(item)">
          <view class="card-body">
            <view class="card-info">
              <view class="header">
                <view class="process-name ellipsis">{{ item.procedureName }}</view>
                <view class="is-accept">是否需要验收：{{ item.acceptanceFlag ? '是' : '否' }}</view>
                <view class="process-state">
                  <view v-if="!item.completionTime" style="color: red">未完成</view>
                  <view v-if="item.completionTime">已完成</view>
                </view>
              </view>
              <view class="standard">
                <view class="label">工序标准：</view>
                <view class="value">{{ item.procedureStandard }}</view>
              </view>
              <view v-if="item.completionTime">工序完成时间：{{ item.completionTime }}</view>
              <view class="operation">
                <a v-if="!item.completionTime && $hasPower('AppFinishProcess')" @click.stop="handleFinish(item)"
                  >完成工序</a
                >
                <a v-if="item.completionTime && $hasPower('AppUpdateFinishProcess')" @click.stop="handleUpdate(item)"
                  >修改</a
                >
              </view>
            </view>
          </view>
        </uni-card>
      </block>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      processState: 1,
      processStateList: [
        { value: 1, label: '全部工序' },
        { value: 2, label: '未完成工序' },
        { value: 3, label: '已完成工序' }
      ],
      processList: []
    }
  },
  // 下拉刷新
  onPullDownRefresh() {},
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.init()
  },
  methods: {
    init() {
      if (this.id) {
        this.getManageProcedureDetail(this.id)
      }
    },
    // 获取管理工序详情页信息
    getManageProcedureDetail(id) {
      uni.showLoading()
      Api.getManageProcedureDetail({ scheduleId: id, scheduleProcedureState: this.processState }).then(res => {
        this.processList = res.data
        uni.hideLoading()
      })
    },
    // 根据工序状态过滤工序列表
    handleFilter(processState) {
      this.processState = processState
      this.init()
    },
    // 修改事件
    handleUpdate(item) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSchedule/scheduleManage/updateFinishProcess?scheduleId=${item.scheduleId}&scheduleProcedureId=${item.scheduleProcedureId}`
      )
    },
    // 完成工序事件
    handleFinish(item) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSchedule/scheduleManage/finishProcess?scheduleId=${item.scheduleId}&scheduleProcedureId=${item.scheduleProcedureId}`
      )
    },
    // 查看完成详情
    toDetail(item) {
      if (item.completionTime && this.$hasPower('AppFinishProcessDetail')) {
        this.$utils.toUrl(
          `/pages/decoration/decorationSchedule/scheduleManage/finishProcessDetail?scheduleId=${item.scheduleId}&scheduleProcedureId=${item.scheduleProcedureId}`
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/list.less';
.radio-con {
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 0px 20px;
  margin-bottom: 20px;
  .radio-item {
    color: #454545;
    background: rgba(223, 223, 223, 0.7);
    padding: 12px 0px;
    flex: 0 0 28%;
    text-align: center;
  }
  .active {
    color: #3558c8;
    background: #c5d2fc;
  }
}

.card-info {
  width: 100%;
  .header {
    display: flex;
    .process-name {
      font-weight: bold;
      font-size: 14px;
      color: #000000;
      flex: 35%;
    }
    .is-accept {
      flex: 30%;
    }
    .process-state {
      flex: 35%;
      text-align: right;
    }
  }
  .standard {
    display: flex;
    .label {
      flex: 0 0 19%;
    }
    .value {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .operation {
    margin-top: 8px;
    padding-top: 4px;
    border-top: solid 1px #e5e5e5;
    text-align: right;
  }
}
</style>
