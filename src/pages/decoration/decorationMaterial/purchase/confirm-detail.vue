<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="采购内容">
            <view class="disabled">
              {{ info.name }} <span class="split"></span> {{ info.models }} <span class="split"></span>{{ info.brand }}
              <span class="split"></span>{{ info.supplier }}</view
            >
          </uni-form-item>
          <uni-form-item label="采购数量">
            <view class="disabled"
              ><span style="margin-right: 8rpx">{{ info.purchaseNumber }}</span
              >{{ info.unit }}</view
            >
          </uni-form-item>
          <uni-form-item label="已到货确认数量">
            <view class="disabled"
              ><span style="margin-right: 8rpx">{{ info.arrivalNumber }}</span
              >{{ info.unit }}</view
            >
          </uni-form-item>
          <uni-form-item label="合格数量">
            <view class="disabled">
              <span
                :style="{
                  color: info.qualifiedNumber < info.purchaseNumber ? '#f00' : '',
                  marginRight: '8rpx'
                }"
                >{{ info.qualifiedNumber }}</span
              >{{ info.unit }}</view
            >
          </uni-form-item>
        </view>
        <view class="common-card">
          <view class="common-card-title between"> 历次到货确认详情 </view>
          <view class="common-card-body">
            <block v-if="records.length">
              <block v-for="(item, index) of records || []" :key="'records' + index">
                <div class="card-item">
                  <div class="card-item-title"></div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <span class="label"></span>
                      <span class="value">
                        <strong>{{ item.createTime }}</strong>
                      </span>
                    </div>
                    <div class="line-item">
                      <span class="label"></span>
                      <span class="value">
                        {{ item.creatorName }}
                      </span>
                    </div>
                  </div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <span class="label">到货数量:</span>
                      <span class="value"
                        ><strong>{{ item.arrivalNumber }}</strong
                        >{{ item.unit }}</span
                      >
                    </div>
                    <div class="line-item">
                      <span class="label">合格数量:</span>
                      <span
                        class="value"
                        :style="{
                          color: item.qualifiedNumber < item.arrivalNumber ? '#f00' : ''
                        }"
                        ><strong>{{ item.qualifiedNumber }}</strong
                        >{{ item.unit }}</span
                      >
                    </div>
                  </div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <span class="label">不合格原因:</span>
                      <span>{{ item.reason }}</span>
                    </div>
                  </div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <div class="common-form-item">
                        <uni-form-item class="file-item" label="附件:">
                          <uni-attachment v-model="item.fileIds" uploadType="image"></uni-attachment>
                        </uni-form-item>
                      </div>
                    </div>
                    <!--<div class="line-item" style="flex: 0 0 220rpx">
                      <span class="common-button mini" type="primary" @click="toConfirmDetail(item)"
                      >删除</span
                      >
                    </div>-->
                  </div>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
import { mapGetters } from 'vuex'
import materialTypeList from './lib/materialTypeList'
export default {
  name: 'DecorationMaterialPurchaseConfirmDetail',
  components: {},
  data() {
    return {
      materialTypeList,
      info: {},
      id: '',
      materialId: '',
      isLoading: false,
      records: [] //到货确认列表
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.materialId = options.materialId
    this.getDetail()
  },
  onShow() {},
  mounted() {},
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getMaterialPurchaseDetail(this.id)
      this.info = _.find(res.data.list, item => item.materialId === this.materialId)
      let confirmRes = await Api.getMaterialPurchaseConfirmList({
        materialId: this.materialId,
        materialPurchaseId: this.materialPurchaseId
      })
      this.records = confirmRes.data || []
    },
    //跳转到到货确认详情
    toConfirmDetail(item) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/detail?id=${item.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./detail.less');
</style>
