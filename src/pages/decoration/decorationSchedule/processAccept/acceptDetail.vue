<template>
  <view class="main">
    <view class="info-view"
      >房间号：{{
        detailData.buildingName + '-' + detailData.unitName + '-' + detailData.floorName + '-' + detailData.roomName
      }}</view
    >
    <view class="info-view">需要验收工序名称：{{ detailData.procedureName }}</view>
    <view class="info-view">工序完成时间：{{ detailData.completionTime }}</view>
    <view class="info-view">工序负责班组：{{ detailData.labourGroupNameList.join(',') }}</view>
    <view class="ad-con">
      <view class="title-text">历次验收结果</view>
      <view v-for="(item, index) in detailData.details" :key="index" class="ad-con-item">
        <view>
          <view>验收结果：</view>
          <view>{{ item.acceptanceResult ? '通过' : '不通过' }}</view>
        </view>
        <view>
          <view>验收人：</view>
          <view>{{ item.acceptancePersonName }}</view>
        </view>
        <view>
          <view>验收时间：</view>
          <view>{{ item.acceptanceTime }}</view>
        </view>
        <view v-if="item.acceptanceResult === 0">
          <view>不通过原因：</view>
          <view>{{ item.rejectReason }}</view>
        </view>
        <view v-if="item.acceptanceResult === 0" class="file-info">
          <view>附件：</view>
          <uni-attachment v-if="item.fileId" v-model="item.fileId"></uni-attachment>
          <view v-else>无附件</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      detailData: {
        buildingName: '',
        unitName: '',
        floorName: '',
        roomName: '',
        procedureName: '',
        completionTime: '',
        labourGroupNameList: []
      }
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  mounted() {
    // console.log(this.id)
    if (this.id) {
      Api.getAcceptanceDetail(this.id).then(res => {
        // console.log(res)
        this.detailData = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.info-view {
  font-size: 14px;
  padding: 5px 30px;
  color: #666666;
}
.ad-con {
  background: #ffffff;
  border-radius: 20px;
  border: solid 1px #f5f5f5;
  margin: 30px;
  padding-bottom: 10px;
  .title-text {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    padding: 24px;
    border-bottom: solid 1px #f5f5f5;
  }
  .ad-con-item {
    margin: 14px 24px;
    font-size: 12px;
    color: #666666;
    border-bottom: solid 1px #e5e5e5;
    padding-bottom: 10px;
    .file-info {
      display: flex;
    }
    > view {
      padding: 4px 0px;
      display: flex;
      > view:nth-child(1) {
        width: 200px;
      }
    }
  }
}
</style>
