<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="材料编号">
            <view class="disabled"> {{ info.code }}</view>
          </uni-form-item>
          <uni-form-item label="材料名称">
            <view class="disabled">{{ info.name }}</view>
          </uni-form-item>
          <uni-form-item label="材料型号">
            <view class="disabled">{{ info.models }}</view>
          </uni-form-item>
          <uni-form-item label="数量单位">
            <view class="disabled">{{ info.unit }}</view>
          </uni-form-item>
          <uni-form-item label="材料类型">
            <view class="disabled">{{ $getLabel(materialTypeList, info.type) }}</view>
          </uni-form-item>
          <uni-form-item v-if="info.type === 1" label="预算量">
            <view class="disabled">{{ info.budgetNumber }}</view>
          </uni-form-item>
          <uni-form-item label="材料品牌">
            <view class="disabled">{{ info.brand }}</view>
          </uni-form-item>
          <uni-form-item label="供应商">
            <view class="disabled">{{ info.supplier }}</view>
          </uni-form-item>
          <uni-form-item label="库存数量">
            <view class="disabled">{{ info.inventoryNumber }}</view>
          </uni-form-item>
        </view>
        <view class="common-card">
          <view class="common-card-title">
            <div class="tab-container">
              <span class="common-tab" :class="{ active: activeName === 'first' }" @click="activeName = 'first'"
                >入库记录</span
              >
              <span class="common-tab" :class="{ active: activeName === 'second' }" @click="activeName = 'second'"
                >已消耗记录</span
              >
              <span class="common-tab" :class="{ active: activeName === 'third' }" @click="activeName = 'third'"
                >库存盘点记录</span
              >
            </div>
          </view>
          <view class="common-card-body">
            <block v-if="activeName === 'first'">
              <block v-if="info.inputs.length">
                <block v-for="(item, index) of info.inputs || []" :key="'input' + index">
                  <div class="card-item">
                    <div class="card-item-title">{{ index + 1 }}</div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">采购申请人:</span>
                        <span class="value">{{ item.purchaseManName }}</span>
                      </div>
                      <div class="line-item">
                        <span class="label">采购数量:</span>
                        <span class="value">{{ item.purchaseNumber }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">采购申请时间:</span>
                        <span class="value">{{ item.purchaseTime }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">到货确认人:</span>
                        <span class="value">{{ item.confirmManName }}</span>
                      </div>
                      <div class="line-item">
                        <span class="label">合格数量:</span>
                        <span class="value">{{ item.qualifiedNumber }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">到货确认时间:</span>
                        <span class="value">{{ item.confirmTime }}</span>
                      </div>
                    </div>
                  </div>
                </block>
              </block>
              <block v-else><p class="no-data">暂无数据 </p></block>
            </block>
            <block v-if="activeName === 'second'">
              <block v-if="info.pickings.length">
                <block v-for="(item, index) of info.pickings || []" :key="'picking' + index">
                  <div class="card-item">
                    <div class="card-item-title">
                      <span>{{ index + 1 }}</span>
                      <span class="common-text-button">领料单</span>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">领料申请人:</span>
                        <span class="value">{{ item.creatorName }}</span>
                      </div>
                      <div class="line-item">
                        <span class="label">申请数量:</span>
                        <span class="value">{{ item.number }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">申请时间:</span>
                        <span class="value">{{ item.createTime }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">使用房间:</span>
                        <span class="value"
                          ><p v-for="(subItem, index) of item.places || []" :key="'place' + index">
                            {{ subItem.buildingName }}-{{ subItem.unitsName }}-{{ subItem.floorName }}-{{
                              subItem.roomName
                            }}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </block>
              </block>
              <block v-else><p class="no-data">暂无数据 </p></block>
            </block>
            <block v-if="activeName === 'third'">
              <block v-if="info.checks.length">
                <block v-for="(item, index) of info.checks || []" :key="'checks' + index">
                  <div class="card-item">
                    <div class="card-item-title">
                      <span>{{ index + 1 }}</span>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">盘点人:</span>
                        <span class="value">{{ item.creatorName }}</span>
                      </div>
                      <div class="line-item">
                        <span class="label">盘点变化:</span>
                        <span class="value">{{ item.changeNumber }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">盘点时间:</span>
                        <span class="value">{{ item.createTime }}</span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">盘点变化原因:</span>
                        <span class="value">{{ item.changeReason }}</span>
                      </div>
                    </div>
                  </div>
                </block>
              </block>
              <block v-else><p class="no-data">暂无数据 </p></block>
            </block>
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
  name: 'DecorationMaterialStoreDetail',
  components: {},
  data() {
    return {
      materialTypeList,
      activeName: 'first',
      info: {
        inputs: [],
        pickings: [],
        checks: []
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
      let res = await Api.getMaterialStoreDetail(this.id)
      this.info = {
        ...res.data
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./detail.less');
</style>
