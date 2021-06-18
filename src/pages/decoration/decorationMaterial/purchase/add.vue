<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="采购材料类型" prop="purchaseType" :disabled="!!purchaseType" isLink>
            <uni-select
              v-model="form.purchaseType"
              placeholder="请选择材料类型"
              :options="materialTypeList"
              @change="handleTypeChange"
            >
            </uni-select>
          </uni-form-item>
        </uni-card>
        <view class="common-card mt20">
          <view class="common-card-title between">
            <span><strong> 采购内容 </strong></span>
            <span class="common-text-button" @click="addMaterial">添加材料</span>
          </view>
          <view class="common-card-body">
            <block v-if="materialList.length">
              <block v-for="(item, index) of materialList" :key="'picking' + index">
                <div class="card-item">
                  <div class="card-item-title"></div>
                  <div class="card-item-body">
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">采购材料{{ index + 1 }}:</span>
                        <span class="value">
                          {{ item.code }} <span class="split no-content"></span> {{ item.name
                          }}<span class="split no-content"></span> {{ item.models }}
                          <span class="split no-content"></span> {{ item.brand }}
                          <span class="split no-content"></span> {{ item.supplier }}
                          <span class="split no-content"></span>
                          {{ $getLabel(materialTypeList, item.type) }}
                        </span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <div class="common-form-item">
                          <uni-form-item label="采购数量:" prop="purchaseNumber" align="left">
                            <input v-model.number="item.purchaseNumber" placeholder="请输入采购数量" />
                            <span>{{ item.unit }}</span>
                          </uni-form-item>
                        </div>
                      </div>
                      <div class="line-item" style="flex: 0 0 100rpx">
                        <span class="common-button" type="primary" @click="deleteMaterial(index)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </view>
        </view>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并提交</button>
      </view>
      <uni-drawer ref="materialList" :width="700" mode="right">
        <MaterialList
          :checked="checkedValue"
          :materialType="form.purchaseType"
          @selected="handleMaterialSelected"
        ></MaterialList>
      </uni-drawer>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from './api'
import materialTypeList from './lib/materialTypeList'
import MaterialList from './material-list'
export default {
  components: { MaterialList },
  data() {
    return {
      id: '',
      materialTypeList,
      purchaseType: '',
      form: {
        purchaseType: ''
      },
      rules: {
        purchaseType: { required: true }
      },
      materialList: [],
      checkedValue: [],
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    /*'form.purchaseType': {
      deep: true,
      immediate: false,
      handler() {
        this.checkedValue = []
        this.materialList = []
      }
    }*/
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑采购单')
      this.getDetail()
    }
    let purchaseType = parseInt(options.purchaseType)
    if (purchaseType) {
      this.purchaseType = purchaseType
      this.form.purchaseType = purchaseType
    }
    let targetId = options.messageId || ''
    if (targetId) {
      this.$utils.toUrl(
        `/pages/decoration/decorationMaterial/purchase/detail?id=${this.id}&isCheck=${options.isCheck}`,
        2
      )
      return
    }
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
  created() {},
  methods: {
    //获得详情
    async getDetail() {
      let res = await Api.getMaterialPurchaseDetail(this.id)
      this.form = {
        ...res.data
      }
      this.materialList = [...res.data.list]
      this.checkedValue = res.data.list.map(item => item.materialId)
    },
    //材料类型改变时
    handleTypeChange(val) {
      this.checkedValue = []
      this.materialList = []
    },
    //添加材料
    addMaterial() {
      if (!this.form.purchaseType) {
        this.$utils.showToast('请先选择材料类型')
        return
      }
      this.$refs.materialList.open()
    },
    // 删除材料
    deleteMaterial(index) {
      this.materialList = this.materialList.splice(index, 1)
      this.checkedValue = this.checkedValue.splice(index, 1)
    },
    //提交选择材料
    handleMaterialSelected(data) {
      let differenceArr = _.differenceBy(data.transRow, this.materialList, 'materialId')
      this.materialList = [...this.materialList, ...differenceArr]
      let idArr = this.materialList.map(item => item.materialId)
      this.checkedValue = [...idArr]
      this.$refs.materialList.close()
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      await this.$refs.form.validate()
      if (!this.materialList.length) {
        this.$utils.showToast('请选择要采购的材料')
        return
      }
      let details = this.materialList.map(item => {
        return {
          materialId: item.materialId ? item.materialId : item.id,
          purchaseNumber: +item.purchaseNumber
        }
      })
      let hasNull = _.some(details, item => item.purchaseNumber <= 0)
      if (hasNull) {
        this.$utils.showToast('请正确填写采购数量')
        return
      }
      let params = {
        ...this.form,
        details
      }
      isSave ? await Api.saveMaterialPurchase(params) : await Api.saveAndSubmitMaterialPurchase(params)
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
@import url('./index.less');
.mt20 + .mt20 {
  margin-top: 50rpx;
}
</style>
