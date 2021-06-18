<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="采购单编号" isCell>
            {{ info.code }}
          </uni-form-item>
          <uni-form-item label="采购申请人" isCell>
            {{ info.creatorName }}
          </uni-form-item>
          <uni-form-item label="采购申请时间" isCell>
            {{ info.createTime }}
          </uni-form-item>
          <uni-form-item label="采购材料类型" isCell>
            {{ $getLabel(materialTypeList, info.purchaseType) }}
          </uni-form-item>
        </view>

        <!-- 采购内容 start -->
        <uni-title v-if="info.list && info.list.length > 0" title="采购内容"></uni-title>
        <template v-for="(item, index) of info.list || []">
          <uni-card :key="index" :title="`采购材料${index + 1}`">
            <uni-form-item noLobel align="left">
              {{ item.code }} <span class="split no-content"></span> {{ item.name
              }}<span class="split no-content"></span> {{ item.models }} <span class="split no-content"></span>
              {{ item.brand }} <span class="split no-content"></span>
              {{ item.supplier }}
              <span class="split no-content"></span>
              {{ $getLabel(materialTypeList, item.type) }}
            </uni-form-item>
            <uni-form-item label="采购数量" isCell> {{ item.purchaseNumber }} {{ item.unit }} </uni-form-item>
            <uni-form-item label="已到货确认数量" isCell> {{ item.arrivalNumber }} {{ item.unit }} </uni-form-item>
            <uni-form-item label="合格数量" isCell> {{ item.qualifiedNumber }} {{ item.unit }} </uni-form-item>
            <uni-form-item noLobel>
              <span class="common-button mini" type="primary" @click="toConfirmDetail(item)">查看到货确认详情</span>
            </uni-form-item>
          </uni-card>
        </template>
        <!-- 采购内容 end -->
        <!-- 通用审批 start -->
        <uni-common-check-flow :id="id" />
        <!-- 通用审批 end -->
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
import { mapGetters } from 'vuex'
import materialTypeList from './lib/materialTypeList'
export default {
  name: 'DecorationMaterialPurchaseDetail',
  components: {},
  data() {
    return {
      materialTypeList,
      info: {
        list: []
      },
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.getDetail()
  },
  onShow() {},
  mounted() {},
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getMaterialPurchaseDetail(this.id)
      this.info = {
        ...res.data
      }
    },
    //跳转到到货确认详情
    toConfirmDetail(item) {
      this.$utils.toUrl(
        `/pages/decoration/decorationMaterial/purchase/confirm-detail?id=${this.id}&materialId=${item.materialId}`
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./detail.less');
</style>
