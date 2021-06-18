<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <!--          <uni-form-item label="出库单编号" prop="code">-->
          <!--            <textarea v-model.trim="form.code" auto-height disabled />-->
          <!--          </uni-form-item>-->
          <uni-form-item label="领用人" prop="recipientId" isRequired isLink>
            <!--            <view :class="{ placeholder: !form.receiptMode }" @click="handleRecipientNameClick">-->
            <!--              {{ form.recipientName || '请选择领用人' }}-->
            <!--            </view>-->
            <uni-select-user
              v-model="form.recipientId"
              :name.sync="form.recipientName"
              :departName.sync="form.recipientCompanyName"
              :departId.sync="form.recipientCompanyId"
              isDepartment
              placeholder="请选择"
            />
          </uni-form-item>
          <uni-form-item label="领用单位">
            {{ form.recipientCompanyName }}
          </uni-form-item>
        </uni-card>

        <view class="card-title-outer">
          <view class="title">
            <view>出库明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleOpenDrawer"></uni-icons>
          </view>
        </view>
        <block v-if="list.length">
          <uni-card v-for="(item, index) in list" :key="item.id">
            <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
            <uni-form-item label="序号">
              <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
            </uni-form-item>
            <uni-form-item label="材料编码">
              <view>{{ item.code }}</view>
            </uni-form-item>
            <uni-form-item label="材料名称">
              <view>{{ item.name }}</view>
            </uni-form-item>
            <uni-form-item label="规格型号">
              <view>{{ item.models }}</view>
            </uni-form-item>
            <uni-form-item label="单位">
              <view>{{ item.unit }}</view>
            </uni-form-item>
            <uni-form-item label="品牌">
              <view>{{ item.brand }}</view>
            </uni-form-item>
            <uni-form-item label="供应商">
              <view>{{ item.supplier }}</view>
            </uni-form-item>
            <uni-form-item label="库存量">
              <view>{{ item.inventoryNumber }}</view>
            </uni-form-item>
            <uni-form-custom :ref="item.id" :model="item" :rules="subRules" class="border-top">
              <uni-form-item label="出库数量" isRequired prop="number">
                <input
                  v-model.number="item.number"
                  class="uni-input"
                  placeholder="请输入出库数量"
                  @change="handleCalSingleCost(item)"
                />
              </uni-form-item>
              <uni-form-item label="使用部位" isRequired prop="usePart">
                <input v-model.number="item.usePart" class="uni-input" placeholder="请输入使用部位" />
              </uni-form-item>
            </uni-form-custom>
          </uni-card>
          <!-- 备注信息开始 -->
          <uni-card isForm>
            <uni-form-item label="备注" align="right">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
          </uni-card>
          <!-- 备注信息结束 -->
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit">保存</button>
          </view>
        </block>
      </uni-form-custom>
    </scroll-view>
    <uni-drawer ref="productList" :width="750" mode="right">
      <inventory-select :checked="checkedValue" @selected="handleInventorySelected"></inventory-select>
    </uni-drawer>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { Api } from '@/api/material/stockOut'
import _ from 'lodash'
import InventorySelect from './inventory'

export default {
  components: {
    InventorySelect
  },
  data() {
    return {
      form: {
        projectId: wx.getStorageSync('projectId'),
        recipientId: '',
        recipientName: '',
        recipientCompanyId: '',
        recipientCompanyName: '',
        code: '',
        remark: ''
      },
      rules: {
        recipientId: { required: true },
        recipientCompanyId: { required: true }
      },
      subRules: {
        number: {
          required: true
        },
        usePart: {
          required: true
        }
      },
      list: [], //选中的材料
      checkedValue: [], //选中的 材料的id
      totalPrice: null,
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad() {
    this.init()
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
  methods: {
    init() {
      this.handleCreatecode()
    },
    // 自动生成入库单号
    handleCreatecode() {
      // this.form.code = '990610010'
    },
    //删除选中的入库产品
    handleDeleteItem(index) {
      console.log('删除')
      this.list.splice(index, 1)
    },
    // 点击保存按钮
    async handleSubmit() {
      // 开启表单验证
      await this.$refs.form.validate()

      // _.forEach(this.list, async item => {
      //   await this.$refs[item.id].validate()
      // })

      Promise.all(
        this.list.map(item => {
          return this.$refs[item.id][0].validate()
        })
      ).then(res => {
        let data = _.cloneDeep(this.form)
        data.materialOutputDetails = this.list.map(item => {
          return {
            materialId: item.id,
            number: item.number,
            usePart: item.usePart
          }
        })
        Api.getStackOutAdd(data).then(res => {
          this.$utils.showToast('操作成功')
          this.isSave = true
          setTimeout(() => {
            this.$utils.goBack()
          }, 1000)
        })
      })
    },
    // 打开物料选择框
    handleOpenDrawer() {
      this.$refs.productList.open()
    },
    // 选中物料后数据回传处理
    handleInventorySelected(data) {
      let { checked, checkedValue } = data
      let deleteItems = _.differenceBy(this.list, checked, 'id')
      let newItems = _.differenceBy(checked, this.list, 'id')
      _.pull(this.list, ...deleteItems)
      newItems.forEach(item => {
        this.list.push(
          Object.assign(item, {
            number: null,
            usePart: ''
          })
        )
      })
      this.checkedValue = _.map(this.list, 'id')
      this.$refs.productList.close()
    },
    // 计算总价
    handleTotalPriceCal() {
      let totalPrice = 0
      const base = 1000 //用来避免小数计算产生异常
      if (this.list.length) {
        _.forEach(this.list, item => {
          if (item.price && item.count) {
            totalPrice += item.price * base * (item.count * base)
          }
        })
        this.totalPrice = totalPrice / base / base
      }
    },
    // 计算单个物料的总价
    handleCalSingleCost(item) {
      if (!(item.count && item.price)) return
      let base = 1000
      item.singleCost = (item.count * base * (item.price * base)) / base / base
      this.handleTotalPriceCal()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
