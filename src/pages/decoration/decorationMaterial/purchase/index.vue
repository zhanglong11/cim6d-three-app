<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="采购单编号/材料名称/采购申请人"
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
                ><strong>{{ item.code }}</strong></span
              >
              <span><uni-status :value="item.purchaseType" :options="materialTypeList"></uni-status></span>
              <span><uni-status :value="item.status" :options="auditStatusList"></uni-status></span>
            </h2>
            <div class="body">
              <div class="left">
                <div v-for="(purchaseItem, index) of item.list" :key="'purchase' + index" class="item-block">
                  <div class="line">
                    <div class="line-item">
                      <span class="label">采购内容:</span>
                      <span class="value">
                        {{ purchaseItem.name }} <span class="split"></span> {{ purchaseItem.models }}
                        <span class="split"></span>{{ purchaseItem.brand }} <span class="split"></span
                        >{{ purchaseItem.supplier }}
                      </span>
                    </div>
                  </div>
                  <div class="line">
                    <div class="line-item light-color">
                      <span class="label">采购数量:</span>
                      <span class="value">
                        <span style="margin-right: 8rpx"> {{ purchaseItem.purchaseNumber }}</span
                        >{{ purchaseItem.unit }}</span
                      >
                    </div>
                    <div class="line-item light-color">
                      <span class="label">已到货确认:</span>
                      <span class="value">
                        <span style="margin-right: 8rpx">{{ purchaseItem.arrivalNumber }}</span
                        >{{ purchaseItem.unit }}</span
                      >
                    </div>
                    <div class="line-item light-color">
                      <span class="label">合格数量:</span>
                      <span class="value">
                        <span
                          :style="{
                            color: purchaseItem.qualifiedNumber < purchaseItem.purchaseNumber ? '#f00' : '',
                            marginRight: '8rpx'
                          }"
                          >{{ purchaseItem.qualifiedNumber }}</span
                        >{{ purchaseItem.unit }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="line">
                  <div class="line-item">
                    <span class="label light-color">采购申请人:</span>
                    <span class="value">{{ item.creatorName }}</span>
                  </div>
                  <div class="line-item">
                    <span class="label light-color">申请时间:</span>
                    <span class="value">{{ item.createTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div class="footer-left"></div>
          <div class="footer-right">
            <template v-if="item.status === 0">
              <span
                v-if="$hasPower('AppDecorationMaterialPurchaseDelete')"
                class="common-button"
                type="error"
                @click.stop="handleDelete(item.id)"
                >删除</span
              >
              <span
                v-if="$hasPower('AppDecorationMaterialPurchaseEdit')"
                class="common-button"
                type="primary"
                @click.stop="handleEdit(item)"
                >编辑</span
              >
            </template>
            <template v-if="item.status === 1">
              <!--<span class="common-button" type="primary" @click.stop="handleAudit(item.id)">审批</span>-->
            </template>
            <template v-if="item.status === 2">
              <span
                v-if="
                  $hasPower('AppDecorationMaterialPurchaseConfirm') &&
                  _.some(item.list, i => i.qualifiedNumber < i.purchaseNumber)
                "
                class="common-button"
                type="primary"
                @click.stop="handleConfirm(item.id)"
                >到货确认</span
              >
            </template>
            <template v-if="item.status === 3">
              <span
                v-if="$hasPower('AppDecorationMaterialPurchaseRestart')"
                class="common-button"
                type="primary"
                @click.stop="handleRestart(item.id)"
                >再次发起</span
              >
            </template>
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
    <uni-add v-if="$hasPower('AppDecorationMaterialPurchaseAdd')" @click="handleAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">材料类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.type" hasAll :options="materialTypeList" />
        <p class="item-line" />
        <h6 class="label">审批状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="auditStatusList" />
        <p class="item-line" />
        <h6 class="label">申请时间</h6>
        <div class="date">
          <uni-date-picker
            v-model="drawerForm.dateRange"
            valueFormat="YYYY-MM-DD"
            fields="day"
            mode="range"
          ></uni-date-picker>
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
import auditStatusList from './lib/auditStatusList'
export default {
  components: { EmptyTemplate, UniPopupDialog },
  data() {
    return {
      projectId: this.$store.state.project.projectId,
      userId: uni.getStorageSync('userId') || '',
      materialTypeList,
      auditStatusList,
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        type: '',
        status: '',
        dateRange: []
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: []
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
    refresh: _.debounce(async function () {
      this.loading = true
      let res = await Api.getPurchaseList(this.filterForm).finally(() => {
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
    },
    //删除
    async handleDelete(id) {
      this.selectItemId = id
      this.$refs.deletePopup.open()
    },
    //审批
    handleAudit(id) {},
    // 再次发起
    handleRestart(id) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/add?id=${id}`)
    },
    // 到货确认
    handleConfirm(id) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/confirm?id=${id}`)
    },
    //添加
    handleAdd() {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/add`)
    },
    // 修改
    handleEdit(row) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/add?id=${row.id}`)
    },
    toDetail(row) {
      if (!this.$hasPower('AppDecorationMaterialPurchaseDetail')) {
        return
      }
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/purchase/detail?id=${row.id}`)
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
.date {
  border: 2rpx #9e9a9a solid;
  line-height: 40rpx;
  /deep/ .label {
    margin-bottom: 0 !important;
    line-height: 50rpx;
    padding: 0 10rpx;
    font-size: 12px !important;
  }
}
</style>
