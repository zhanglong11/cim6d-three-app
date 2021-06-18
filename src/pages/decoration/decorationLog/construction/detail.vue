<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <view class="card top-content">
        <h2>施工日志</h2>
        <view class="read-status">
          <uni-status :options="readStatus" :value="info.viewStatus"></uni-status>
        </view>
      </view>
      <view class="card multiple-column">
        <view class="line">
          <div class="line-item">
            <span class="label">编制日期:</span>
            <span class="value">{{ info.diaryDate | ymd }}</span>
          </div>
          <div class="line-item">
            <span class="label">记录人员:</span>
            <span class="value">{{ info.creatorName }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">日志编号:</span>
            <span class="value">{{ info.diaryDate | ymd }}</span>
          </div>
          <div class="line-item">
            <span class="label">项目负责人:</span>
            <span class="value">{{ info.projectPrincipalName }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">项目名称:</span>
            <span class="value">{{ info.projectName }}</span>
          </div>
        </view>
      </view>
      <view class="card">
        <h4>施工人员</h4>
        <view v-if="info.employeeDTOList.length" class="person-list">
          <view v-for="(item, index) of info.employeeDTOList || []" :key="item.id" class="person-item">
            <span class="content">
              <span class="label">施工人员{{ index + 1 }}:</span>
              <span class="info"
                ><span>{{ item.cardNumber }}</span>
                <span>{{ item.name }}</span>
                <span> {{ $getLabel(workType, item.workType) }}</span>
                <span>{{ item.labourCompanyName }}</span>
                <span>{{ item.groupName }}</span>
              </span>
            </span>
          </view>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">施工人数:</span>
            <span class="value">{{ info.constructionPersonNumber }}</span>
          </div>
        </view>
      </view>
      <view class="card">
        <view class="line">
          <div class="line-item">
            <span class="label">今日天气:</span>
            <span class="value">{{ info.todayWeather }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">上午温度℃:</span>
            <span class="value">{{ info.morningWeather }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">午间温度℃:</span>
            <span class="value">{{ info.noonWeather }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">下午温度℃:</span>
            <span class="value">{{ info.afternoonWeather }}</span>
          </div>
        </view>
      </view>
      <view class="card wrap-line-card">
        <view class="wrap-line">
          <view class="wrap-label"> 施工工程及内容: </view>
          <view class="wrap-value"> {{ info.constructionContent }} </view>
        </view>
        <view class="wrap-line">
          <view class="wrap-label"> 质量情况: </view>
          <view class="wrap-value"> {{ info.qualitySituation }} </view>
        </view>
        <view class="wrap-line">
          <view class="wrap-label"> 安全情况: </view>
          <view class="wrap-value"> {{ info.safetySituation }} </view>
        </view>
        <view class="wrap-line">
          <view class="wrap-label"> 进度情况: </view>
          <view class="wrap-value"> {{ info.scheduleSituation }} </view>
        </view>
        <view class="wrap-line">
          <view class="wrap-label"> 材料进场情况: </view>
          <view class="wrap-value"> {{ info.materialEnterSituation }} </view>
        </view>
      </view>
      <view class="card">
        <view class="line">
          <div class="line-item">
            <span class="label">抄送:</span>
            <span class="value">{{ info.copyToPersonNames || '-' }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">备注:</span>
            <span class="value">{{ info.remark }}</span>
          </div>
        </view>
        <view class="line">
          <div class="line-item">
            <span class="label">附件:</span>
            <span class="value"> <uni-attachment v-model="info.fileIds"></uni-attachment></span>
          </div>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import readStatus from './lib/readStatus'
import Api from './api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      id: null,
      info: {
        employeeDTOList: []
      },
      readStatus
    }
  },
  onLoad(option) {
    this.id = option.id
    // if (!option.messageId) {
    //   return
    // }
    // this.fly.system.get('message/read/' + option.messageId)
  },
  onShow() {
    if (this.id) {
      this.getDetail()
    }
  },
  computed: {
    workType() {
      return this.$getArgList('workType') || []
    }
  },
  methods: {
    async getDetail() {
      let result = await Api.getLogDetail(this.id)
      if (result.code === 200) {
        this.info = result.data || {}
      }
    }
  }
}
</script>

<style lang="less">
@import url('detail.less');
</style>
