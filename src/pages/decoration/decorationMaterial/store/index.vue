<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="材料编号/材料名称/材料型号"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div
        v-for="item in list"
        :key="item.id"
        class="card item"
        :class="{ 'danger-item': item.type === 1 && item.inventoryNumber + item.consumeNumber >= item.budgetNumber }"
        @click="toDetail(item)"
      >
        <div class="item-body">
          <div class="content">
            <h2 class="title">
              <span
                ><strong>{{ item.name }}</strong></span
              >
              <span>{{ item.models }}</span>
              <span>{{ item.code }}</span>
            </h2>
            <div class="body">
              <div class="left has-aside">
                <div class="line">
                  <div class="line-item">
                    <span class="label">库存量:</span>
                    <span class="value"
                      ><strong>{{ item.inventoryNumber }}</strong></span
                    >
                  </div>
                  <div class="line-item">
                    <span class="label">已消耗数量:</span>
                    <span class="value">{{ item.consumeNumber }}</span>
                  </div>
                </div>
                <div class="line">
                  <div class="line-item">
                    <span class="label">数量单位:</span>
                    <span class="value">{{ item.unit }}</span>
                  </div>
                  <div class="line-item">
                    <span class="label">累计采购量:</span>
                    <span class="value">{{ item.purchaseNumber }}</span>
                  </div>
                </div>
                <div class="line">
                  <div class="line-item">
                    <span class="label">品牌及供应商:</span>
                    <span class="value">
                      {{ item.brand }} <span class="split no-content"></span>{{ item.supplier }}</span
                    >
                  </div>
                </div>
              </div>
              <aside class="right">
                <uni-status :value="item.type" :options="materialTypeList"></uni-status>
              </aside>
            </div>
          </div>
        </div>
        <footer>
          <div class="footer-left">
            <span v-if="item.type === 1">预算量:</span>
            <span v-if="item.type === 1" class="value">{{ item.budgetNumber }}</span>
          </div>
          <div class="footer-right">
            <span
              v-if="
                !(item.inventoryNumber > 0 || item.consumeNumber > 0) && $hasPower('AppDecorationMaterialStoreDelete')
              "
              class="common-button"
              type="error"
              @click.stop="handleDelete(item.id)"
              >删除</span
            >
            <span
              v-if="$hasPower('AppDecorationMaterialStoreInventory')"
              class="common-button"
              type="primary"
              @click.stop="handleInventory(item)"
              >库存盘点</span
            >
            <span
              v-if="$hasPower('AppDecorationMaterialStoreEdit')"
              class="common-button"
              type="primary"
              @click.stop="handleEdit(item)"
              >编辑</span
            >
          </div>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
        mode="base"
        type="warn"
        title="确认删除?"
        :before-close="true"
        @close="deleteClose"
        @confirm="deleteConfirm"
      ></uni-popup-dialog>
    </uni-popup>
    <uni-add v-if="$hasPower('AppDecorationMaterialStoreAdd')" @click="handleAdd"></uni-add>
    <!--添加/修改-->
    <uni-popup ref="addPopup" type="center" class="common-popup">
      <view class="pop-header">{{ isAdd ? '新增材料种类' : '编辑材料种类' }}</view>
      <view class="pop-body">
        <uni-form-custom ref="form" :model="form" :rules="rules">
          <uni-form-item label="材料名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入材料名称" />
          </uni-form-item>
          <uni-form-item label="材料型号" prop="models">
            <textarea v-model.trim="form.models" auto-height placeholder="请输入材料型号" />
          </uni-form-item>
          <uni-form-item label="数量单位" prop="unit">
            <textarea v-model.trim="form.unit" auto-height placeholder="请输入数量单位" />
          </uni-form-item>
          <uni-form-item label="材料类型" isLink prop="type">
            <uni-select v-model="form.type" placeholder="请选择材料类型" :options="materialTypeList"> </uni-select>
          </uni-form-item>
          <uni-form-item v-if="form.type === 1" label="预算量" prop="budgetNumber">
            <input v-model.number="form.budgetNumber" placeholder="请输入预算量" />
          </uni-form-item>
          <uni-form-item label="材料品牌" prop="brand">
            <textarea v-model.trim="form.brand" auto-height placeholder="请输入材料品牌" />
          </uni-form-item>
          <uni-form-item label="供应商" prop="supplier">
            <textarea v-model.trim="form.supplier" auto-height placeholder="请输入供应商" />
          </uni-form-item>
        </uni-form-custom>
      </view>
      <view class="pop-footer">
        <span class="common-button mini" type="default" @click="addTypeClose">取消</span>
        <span class="common-button mini" type="primary" @click="addTypeSubmit">确定</span>
      </view>
    </uni-popup>
    <!--库存盘点-->
    <uni-popup ref="inventoryPopup" type="center" class="common-popup">
      <view class="pop-header">库存盘点</view>
      <view class="pop-body">
        <div class="line">
          <div class="line-item">
            <span class="label">材料编号:</span>
            <span class="value">{{ selectItem.code }}</span>
          </div>
          <div class="line-item">
            <span class="label">数量单位:</span>
            <span class="value">{{ selectItem.unit }}</span>
          </div>
        </div>
        <div class="line">
          <div class="line-item">
            <span class="label">材料名称:</span>
            <span class="value">{{ selectItem.name }}</span>
          </div>
          <div class="line-item">
            <span class="label">材料类型:</span>
            <span class="value">{{ $getLabel(materialTypeList, selectItem.type) }}</span>
          </div>
        </div>
        <div class="line">
          <div class="line-item">
            <span class="label">材料型号:</span>
            <span class="value">{{ selectItem.code }}</span>
          </div>
          <div class="line-item">
            <span class="label">材料品牌:</span>
            <span class="value">{{ selectItem.brand }}</span>
          </div>
        </div>
        <div class="line">
          <div class="line-item">
            <span class="label">供应商:</span>
            <span class="value">{{ selectItem.supplier }}</span>
          </div>
        </div>
        <div class="line">
          <div class="line-item">
            <span class="label"><strong>系统库存数量:</strong></span>
            <span class="value"
              ><strong>{{ selectItem.inventoryNumber }}</strong></span
            >
          </div>
        </div>
        <uni-form-custom ref="inventoryForm" :model="inventoryForm" :rules="inventoryFormRules" class="popup-form">
          <uni-form-item label="实际库存数量:" prop="realNumber" align="left">
            <input v-model.number="inventoryForm.realNumber" placeholder="请输入实际库存数量" />
          </uni-form-item>
          <div class="line">
            <div class="line-item">
              <span class="label">盘点变化:</span>
              <span class="value">{{ changeNumber > 0 ? '+' + changeNumber : changeNumber }}</span>
            </div>
          </div>
          <uni-form-item label="盘点变化原因:" prop="changeReason" align="left">
            <textarea v-model.trim="inventoryForm.changeReason" auto-height placeholder="请输入盘点变化原因" />
          </uni-form-item>
        </uni-form-custom>
      </view>
      <view class="pop-footer">
        <span class="common-button mini" type="default" @click="inventoryClose">取消</span>
        <span class="common-button mini" type="primary" @click="inventorySubmit">确定</span>
      </view>
    </uni-popup>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">材料类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.type" hasAll :options="materialTypeList" />
        <p class="item-line" />
        <h6 class="label">材料品牌</h6>
        <div class="brand">
          <uni-checkbox-button-group v-model="drawerForm.brand" hasAll :options="brandList" />
        </div>
        <p class="item-line" />
        <h6 class="label">供应商</h6>
        <div class="supplier">
          <uni-checkbox-button-group v-model="drawerForm.supplier" hasAll :options="supplierList" />
        </div>
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
import Api from './api'
import materialTypeList from './lib/materialTypeList'
export default {
  components: { EmptyTemplate, UniPopupDialog },
  data() {
    return {
      projectId: this.$store.state.project.projectId,
      userId: uni.getStorageSync('userId') || '',
      materialTypeList,
      brandList: [],
      supplierList: [],
      selectItemId: '',
      filterForm: {
        inspectType: 1,
        keyword: '',
        page: 1,
        rows: 10,
        status: '',
        inspectNature: '',
        dateRange: []
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: [],
      form: {},
      rules: {
        name: { required: true },
        models: { required: true },
        unit: { required: true },
        type: { required: true },
        budgetNumber: { required: true },
        brand: { required: true },
        supplier: { required: true }
      },
      isAdd: true,
      selectItem: {}, //要编辑或库存盘点的材料
      inventoryForm: {},
      inventoryFormRules: {
        realNumber: { required: true },
        changeReason: { required: true }
      }
    }
  },
  onLoad(options) {},
  onShow() {
    this.init()
  },
  computed: {
    changeNumber() {
      return this.inventoryForm.realNumber ? this.inventoryForm.realNumber - this.selectItem.inventoryNumber : 0
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.getBrandAndSupplierList()
  },
  mounted() {},
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    //获取品牌列表
    async getBrandAndSupplierList() {
      let res = await Api.getBrandAndSupplierList({})
      this.brandList =
        (res.data.brands &&
          res.data.brands.map(item => {
            return {
              value: item,
              label: item
            }
          })) ||
        []
      this.supplierList =
        (res.data.suppliers &&
          res.data.suppliers.map(item => {
            return {
              value: item,
              label: item
            }
          })) ||
        []
    },
    refresh: _.debounce(async function () {
      this.loading = true
      let res = await Api.getStoreList(this.filterForm).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    }, 100),
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh(true)
    },
    //取消删除
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    //确认删除
    async deleteConfirm(done, value) {
      await Api.deleteMaterialType([this.selectItemId])
      done()
      this.$utils.showToast('删除成功')
      await this.init()
      await this.getBrandAndSupplierList()
    },
    //删除
    async handleDelete(id) {
      this.selectItemId = id
      this.$refs.deletePopup.open()
    },
    handleAdd() {
      this.isAdd = true
      this.form = {}
      this.$refs.addPopup.open()
    },
    //取消添加
    addTypeClose() {
      this.$refs.addPopup.close()
    },
    //提交添加材料类型
    async addTypeSubmit() {
      await this.$refs.form.validate()
      this.isAdd ? await Api.addMaterialType(this.form) : await Api.updateMaterialType(this.form)
      this.$utils.showToast('操作成功')
      this.$refs.addPopup.close()
      await this.init()
      await this.getBrandAndSupplierList()
    },
    //盘点
    handleInventory(item) {
      this.inventoryForm = {}
      this.selectItem = item
      this.selectItemId = item.id
      this.$refs.inventoryPopup.open()
    },
    inventoryClose() {
      this.$refs.inventoryPopup.close()
    },
    async inventorySubmit() {
      await this.$refs.inventoryForm.validate()
      await Api.updateMaterialStoreInventory({
        ...this.inventoryForm,
        changeNumber: this.changeNumber,
        materialId: this.selectItemId,
        currentNumber: this.selectItem.inventoryNumber
      })
      this.$utils.showToast('操作成功')
      this.$refs.inventoryPopup.close()
      await this.init()
    },
    // 修改
    handleEdit(row) {
      this.isAdd = false
      this.selectItem = row
      this.form = { ...row }
      this.$refs.addPopup.open()
    },
    toDetail(row) {
      if (!this.$hasPower('AppDecorationMaterialStoreDetail')) {
        return
      }
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/store/detail?id=${row.id}`)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      if (this.drawerForm.dateRange[0]) {
        this.filterForm.startDate = this.moment(this.drawerForm.dateRange[0]).format('YYYY-MM-DD 00:00:00')
        this.filterForm.endDate = this.moment(this.drawerForm.dateRange[1]).format('YYYY-MM-DD 23:59:59')
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    }
  }
}
</script>

<style scoped lang="less">
@import url('./index.less');
.main {
  padding-top: 5px;
}
</style>
