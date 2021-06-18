<template>
  <view class="main">
    <view class="search-bar">
      <view class="label">楼栋：</view>
      <view class="value">
        <uni-select v-model="singleId" :options="singleList" @input="handleSingleChange" />
      </view>
    </view>
    <view v-if="unitList.length" class="charts">
      <view v-for="(unit, index) in unitList" :key="index">
        <view class="unit-title">
          <span>{{ unit.buildingName + unit.unitName }}</span>
          <span v-if="$hasPower('AppUnitProgressDetail')" @click="toDetail(unit)">查看详情</span>
        </view>
        <UnitProgressPie :id="'pie-' + index" :unit="unit" />
      </view>
    </view>
    <view v-else class="charts-no-data">暂无数据</view>
  </view>
</template>

<script>
import scheduleManageApi from '@/pages/decoration/decorationSchedule/scheduleManage/api'
import api from './api'
import UnitProgressPie from './unitProgressPie'
export default {
  components: { UnitProgressPie },
  data() {
    return {
      singleId: '',
      singleList: [],
      unitList: []
    }
  },
  mounted() {
    this.getBuildingDetail()
  },
  methods: {
    // 获取楼栋下的单元信息
    refresh() {
      this.unitList = []
      api.getUnitSchedule({ constructionBuildingId: this.singleId }).then(res => {
        this.unitList = res.data.unitList
      })
    },
    // 获取楼栋信息
    getBuildingDetail() {
      scheduleManageApi.getBuildingDetail(this.$store.state.project.projectId).then(res => {
        // console.log(res.data)
        res.data.map(item => {
          item.value = item.id
          item.label = item.name
        })
        this.singleList = res.data
        if (res.data.length) {
          this.singleId = this.singleList[0].id // 默认加载第一栋下的数据
          this.refresh()
        }
      })
    },
    // 楼栋变更
    handleSingleChange(e) {
      this.singleId = e
      this.refresh()
    },
    // 跳转单元进度详情
    toDetail(unit) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSchedule/schedulePanel/unitProgressDetail?id=${unit.constructionUnitsId}`
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-bar {
  display: flex;
  font-size: 14px;
  padding: 30px;
  align-items: center;
  .label {
    color: #666666;
  }
  .value {
    border: solid 2px #cccccc;
    flex: 1;
    padding: 12px 14px;
    color: #333333;
  }
}
.charts {
  padding-bottom: 30px;
  .unit-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    > span:nth-child(1) {
      font-size: 14px;
      font-weight: bold;
    }
    > span:nth-child(2) {
      font-size: 12px;
      color: red;
      margin-left: 20px;
    }
  }
}
.charts-no-data {
  height: 750px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666666;
  font-size: 14px;
}
</style>
