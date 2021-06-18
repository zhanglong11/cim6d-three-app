<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view v-if="type === 'rectify'" class="card">
          <uni-form-custom ref="rectifyForm" :model="rectifyForm" :rules="rectifyFormRules">
            <uni-card isForm>
              <uni-form-item label="整改方法" prop="rectifyContent">
                <textarea
                  v-model.trim="rectifyForm.rectifyContent"
                  :maxlength="-1"
                  placeholder="请输入整改方法"
                  auto-height
                />
              </uni-form-item>
              <uni-form-item class="file-item" label="照片" prop="rectifyFileId">
                <uni-attachment v-model="rectifyForm.rectifyFileId" uploadType="image" edit></uni-attachment>
              </uni-form-item>
              <view class="btn-wrapper">
                <button class="button" :disabled="isLoading" type="primary" @click="handleRectify">提交</button>
              </view>
            </uni-card>
          </uni-form-custom>
        </view>
        <view v-if="type === 'review'" class="card">
          <uni-form-custom ref="reviewForm" :model="reviewForm" :rules="reviewFormRules">
            <uni-card isForm>
              <uni-form-item label="复检结果" isLink prop="reviewResult">
                <uni-select v-model="reviewForm.reviewResult" :options="reviewOptionList"></uni-select>
              </uni-form-item>
              <uni-form-item class="file-item" label="照片" prop="reviewFileId">
                <uni-attachment v-model="reviewForm.reviewFileId" uploadType="image" edit></uni-attachment>
              </uni-form-item>
              <uni-form-item v-if="reviewForm.reviewResult === 0" label="复检意见" prop="reviewOpinion">
                <textarea
                  v-model.trim="reviewForm.reviewOpinion"
                  :maxlength="-1"
                  placeholder="请输入复检意见"
                  auto-height
                />
              </uni-form-item>
            </uni-card>
            <view class="btn-wrapper">
              <button class="button" :disabled="isLoading" type="primary" @click="handleReview">保存</button>
            </view>
          </uni-form-custom>
        </view>
        <view class="card">
          <uni-form-item label="房间号">
            <view class="disabled">
              {{ info.buildingName }}-{{ info.unitName }}-{{ info.floorName }}-{{ info.roomName }}</view
            >
          </uni-form-item>
          <uni-form-item label="问题描述">
            <view class="disabled">{{ info.problemDesc }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="照片">
            <uni-attachment v-model="info.fileId"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="整改期限">
            <view class="disabled">{{ info.rectifyDeadline | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="创建人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
        </view>
        <view class="card img-mark-container">
          <view class="title">
            <span>图纸名称:</span><span>{{ info.drawingsName}}</span>
          </view>
          <div class="mark-container">
            <div v-if="drawingUrl" class="common-btn-group">
              <span class="common-button" type="primary" @click="zoomOut">缩小</span>
              <span class="common-button" @click="zoomReset">复位</span>
              <span class="common-button" type="warning" @click.stop="zoomIn">放大</span>
            </div>
            <div class="img-container">
              <ImageMark
                v-if="drawingUrl"
                id="zoomImage"
                :style="zoomStyle"
                :imageSrc="drawingUrl"
                :pointList="pointList"
              ></ImageMark>
              <div v-else class="no-data">没有关联的图纸</div>
            </div>
          </div>
        </view>
        <view v-if="info.reviewVOList.length" class="problem-list">
          <view class="title">
            <h4>整改与复检进度</h4>
          </view>
          <block v-for="(item, index) of info.reviewVOList" :key="'rvol' + index">
            <view v-if="item.rectifyReviewFlag === 1 || item.rectifyTime" class="item">
              <block v-if="item.rectifyReviewFlag === 0">
                <view class="item-line">
                  <span class="desc"><span class="mr20">整改人:</span> {{ item.rectifyPrincipalName }} </span>
                </view>
                <view class="item-line">
                  <span class="desc"><span class="mr20">整改时间:</span> {{ item.rectifyTime }} </span>
                </view>
                <view class="item-line file">
                  <span class="mr20">照片:</span>
                  <uni-attachment v-model="item.rectifyFileId" uploadType="image" class="ml20"></uni-attachment>
                </view>
              </block>
              <block v-if="item.rectifyReviewFlag === 1">
                <view class="item-line">
                  <span class="desc"><span class="mr20">复检人:</span> {{ item.reviewPrincipalName }} </span>
                  <span class="tag" :style="{ backgroundColor: item.rectifyStatus === 3 ? '#6fe587' : '#f00' }">{{
                    item.rectifyStatus === 3 ? '合格' : '不合格'
                  }}</span>
                </view>
                <view class="item-line">
                  <span class="desc"><span class="mr20">复检时间:</span> {{ item.reviewTime }} </span>
                </view>
                <view class="item-line file">
                  <span class="mr20">照片:</span>
                  <uni-attachment v-model="item.reviewFileId" uploadType="image" class="ml20"></uni-attachment>
                </view>
              </block>
            </view>
          </block>
        </view>
      </view>
      <block v-if="$hasPower('QualityIssueAppRectify') && info.status === 1 && userId === info.rectifyPrincipal">
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="toRectify">整改</button>
        </view>
      </block>
      <block v-if="$hasPower('QualityIssueAppReview') && info.status === 2">
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="toReview">复查</button>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import Api from './api'
import { mapGetters } from 'vuex'
import ImageMark from 'vue-image-mark'
export default {
  name: 'DecorationQualityInspectDetail',
  components: { ImageMark },
  data() {
    return {
      info: {
        reviewVOList: []
      },
      id: '',
      type: '',
      isLoading: false,
      drawingUrl: '',
      zoomStyle: '', // 放大/缩小
      zoomSize: 1, // 图纸初始大小
      zoomStep: 0.2, // 每次放大或缩小倍数
      pointList: [],
      rectifyForm: {},
      rectifyFormRules: {
        rectifyContent: { required: true },
        rectifyFileId: { required: true }
      },
      reviewOptionList: [
        { label: '不合格', value: 0 },
        { label: '合格', value: 1 }
      ],
      reviewForm: {},
      reviewFormRules: {
        reviewResult: { required: true },
        reviewFileId: { required: true },
        reviewOpinion: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.type = options.type || ''
    this.getDetail()
  },
  onShow() {},
  mounted() {},
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getQualityProblemDetail(this.id)
      this.info = {
        ...res.data
      }
      this.drawingUrl = res.data.modelUrls ? JSON.parse(res.data.modelUrls)[0] : ''
      let x = (res.data.coordinate && res.data.coordinate.split(',')[0]) || 0
      let y = (res.data.coordinate && res.data.coordinate.split(',')[1]) || 0
      this.pointList = [
        {
          id: 1,
          positionNum: 1,
          x,
          xCoordinate: x,
          yCoordinate: y,
          y,
          problemDesc: res.data.problemDesc,
          fileId: res.data.fileId,
          rectifyDeadline: res.data.rectifyDeadline,
          rectifyPrincipal: res.data.rectifyPrincipal,
          rectifyPrincipalName: res.data.rectifyPrincipalName,
          color: '#e63030',
          status: 0
        }
      ]
      console.log(this.info)
    },
    // 放大图纸
    zoomIn() {
      let zoomSize = this.zoomSize + this.zoomStep
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 缩小图纸
    zoomOut() {
      let zoomSize = this.zoomSize - this.zoomStep
      if (zoomSize < 0.2) {
        return
      }
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 复位图纸
    zoomReset() {
      let zoomSize = 1
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    //整改
    async handleRectify() {
      await this.$refs.rectifyForm.validate()
      await Api.handleRectify({
        ...this.rectifyForm,
        rectifyId: this.info.reviewVOList[this.info.reviewVOList.length - 1].id
      })
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    },
    //复查
    async handleReview() {
      await this.$refs.reviewForm.validate()
      await Api.handleReview({
        ...this.reviewForm,
        rectifyId: this.info.reviewVOList[this.info.reviewVOList.length - 1].id
      })
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./detail.less');
</style>
