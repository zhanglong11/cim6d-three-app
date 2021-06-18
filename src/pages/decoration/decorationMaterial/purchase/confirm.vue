<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="采购单编号">
            <view class="disabled"> {{ info.code }}</view>
          </uni-form-item>
          <uni-form-item label="采购申请人">
            <view class="disabled">{{ info.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="采购申请时间">
            <view class="disabled">{{ info.createTime }}</view>
          </uni-form-item>
          <uni-form-item label="采购材料类型">
            <view class="disabled">{{ $getLabel(materialTypeList, info.purchaseType) }}</view>
          </uni-form-item>
        </view>
        <view class="common-card">
          <view class="common-card-title between"> 到货确认内容 </view>
          <view class="common-card-body">
            <block v-if="info.list.length">
              <block v-for="(item, index) of info.list || []" :key="'input' + index">
                <div class="card-item">
                  <div class="card-item-title"></div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <span class="label">采购材料{{ index + 1 }}:</span>
                      <span class="value">
                        {{ item.code }} <span class="split no-content"></span> {{ item.name
                        }}<span class="split no-content"></span> {{ item.models }}
                        <span class="split no-content"></span> {{ item.brand }} <span class="split no-content"></span>
                        {{ item.supplier }}
                        <span class="split no-content"></span>
                        {{ $getLabel(materialTypeList, item.type) }}
                      </span>
                    </div>
                  </div>
                  <div class="card-item-line">
                    <div class="line-item">
                      <span class="label">采购数量:</span>
                      <span class="value"
                        ><strong>{{ item.purchaseNumber }}</strong></span
                      >
                    </div>
                    <div class="line-item" style="flex: inherit">
                      <span class="label">已到货确认数量:</span>
                      <span class="value"
                        ><strong>{{ item.arrivalNumber }}</strong></span
                      >
                    </div>
                    <div class="line-item">
                      <span class="label">合格数量:</span>
                      <span
                        class="value"
                        :style="{
                          color: item.qualifiedNumber < item.arrivalNumber ? '#f00' : ''
                        }"
                        ><strong>{{ item.qualifiedNumber }}</strong></span
                      >
                    </div>
                  </div>
                  <uni-form-custom :ref="'form' + index" :model="item" :rules="rules">
                    <div class="card-item-line">
                      <div class="line-item">
                        <div class="common-form-item width-input">
                          <uni-form-item label="本次到货确认数量:" prop="thisArrivalNumber" align="left">
                            <input v-model.number="item.thisArrivalNumber" placeholder="请输入本次到货确认量" />
                            <span>{{ item.unit }}</span>
                          </uni-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <div class="common-form-item width-input">
                          <uni-form-item label="本次合格数量:" prop="thisQualifiedNumber" align="left">
                            <input v-model.number="item.thisQualifiedNumber" placeholder="请输入本次合格数量" />
                            <span>{{ item.unit }}</span>
                          </uni-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item width-input">
                        <div class="common-form-item">
                          <uni-form-item label="不合格原因:" prop="reason" align="left">
                            <textarea
                              v-model.trim="item.reason"
                              :maxlength="200"
                              placeholder="请输入不合格原因"
                              auto-height
                            />
                            <!-- <input v-model.number="item.purchaseNumber" placeholder="请输入采购数量" />-->
                          </uni-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="common-form-item">
                        <uni-form-item class="file-item" label="附件:" prop="fileId">
                          <uni-attachment v-model="item.fileId" uploadType="image" edit></uni-attachment>
                        </uni-form-item>
                      </div>
                    </div>
                  </uni-form-custom>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </view>
        </view>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleConfirm">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
import { mapGetters } from 'vuex'
import materialTypeList from './lib/materialTypeList'
export default {
  name: 'DecorationMaterialPurchaseConfirm',
  components: {},
  data() {
    return {
      positiveNumber: /^(0|[1-9][0-9]*)(\.\d+)?$/,
      materialTypeList,
      info: {
        list: []
      },
      rules: {
        thisArrivalNumber: [{ required: true }],
        thisQualifiedNumber: [{ required: true }]
      },
      id: '',
      isSave: false, // 是否保存
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
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
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
    async handleConfirm(item) {
      await Promise.all(
        this.info.list.map((item, index) => {
          return this.$refs['form' + index][0].validate()
        })
      )
      let allRight = true
      this.info.list.forEach(item => {
        if (item.thisArrivalNumber < +item.thisQualifiedNumber) {
          allRight = false
        }
      })
      if (!allRight) {
        this.$utils.showToast('本次到货确认数量不能小于本次合格数量')
        return
      }
      let list = this.info.list.map(item => {
        return {
          code: this.info.code,
          id: item.id,
          fileIds: item.fileIds,
          materialId: item.materialId,
          materialPurchaseId: item.purchaseId,
          arrivalNumber: item.thisArrivalNumber,
          qualifiedNumber: item.thisQualifiedNumber,
          reason: item.reason
        }
      })
      await Api.saveMaterialPurchaseConfirm(list)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./detail.less');
</style>
