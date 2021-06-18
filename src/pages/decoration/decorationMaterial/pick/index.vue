<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="领料单编号/材料名称/领料申请人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <div class="item-body">
          <div class="content">
            <h2 class="title">
              <span
                ><strong>{{ item.code }}</strong></span
              >
              <span><uni-status :value="item.status" :options="auditStatusList"></uni-status></span>
            </h2>
            <div class="body">
              <div class="left">
                <div class="line">
                  <div class="line-item">
                    <span class="label">领料内容:</span>
                    <span class="value">
                      <p v-for="(item, index) of item.contents" :key="'contents' + index">
                        {{ item.name }} <span class="split no-content"></span> {{ item.models }}
                        <span class="split no-content"></span>{{ item.brand }} <span class="split no-content"></span
                        >{{ item.supplier }}<span class="split no-content"></span>{{ item.number
                        }}<span class="split no-content"></span>{{ item.unit }}
                      </p>
                    </span>
                  </div>
                </div>
                <div class="line">
                  <div class="line-item">
                    <span class="label">使用位置:</span>
                    <span class="value">
                      <p v-for="(item, index) of item.places" :key="'places' + index">
                        {{ item.buildingName }} <span class="split"></span> {{ item.unitsName }}
                        <span class="split"></span>{{ item.floorName }} <span class="split"></span>{{ item.roomName }}
                      </p>
                    </span>
                  </div>
                </div>
                <div class="line">
                  <div class="line-item">
                    <span class="label light-color">领料申请人:</span>
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
                v-if="$hasPower('AppDecorationMaterialPickDelete')"
                class="common-button"
                type="error"
                @click.stop="handleDelete(item.id)"
                >删除</span
              >
              <span
                v-if="$hasPower('AppDecorationMaterialPickEdit')"
                class="common-button"
                type="primary"
                @click.stop="handleEdit(item)"
                >编辑</span
              >
            </template>
            <template v-if="item.status === 1">
              <!--<span class="common-button" type="primary" @click.stop="handleAudit(item.id)">审批</span>-->
            </template>
            <template v-if="item.status === 3">
              <span
                v-if="$hasPower('AppDecorationMaterialPickRestart')"
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
    <uni-add v-if="$hasPower('AppDecorationMaterialPickAdd')" @click="handleAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">房间号</h6>
        <div class="select-group">
          <div class="select-line">
            <div class="select-item">
              <uni-select
                v-model="drawerForm.buildingId"
                class="select-group"
                placeholder="楼栋"
                :options="getOpts(drawerForm, 'building')"
                @change="handleChange('building', drawerForm)"
              >
              </uni-select>
            </div>
            <div class="select-item">
              <uni-select
                v-model="drawerForm.unitsId"
                class="select-group"
                placeholder="单元"
                :options="getOpts(drawerForm, 'unit')"
                @change="handleChange('unit', drawerForm)"
              >
              </uni-select>
            </div>
          </div>
          <div class="select-line">
            <div class="select-item">
              <uni-select
                v-model="drawerForm.floorId"
                class="select-group"
                placeholder="楼层"
                :options="getOpts(drawerForm, 'floor')"
                @change="handleChange('floor', drawerForm)"
              >
              </uni-select>
            </div>
            <div class="select-item">
              <uni-select
                v-model="drawerForm.roomId"
                class="select-group"
                placeholder="房间"
                :options="getOpts(drawerForm, 'room')"
                @change="handleChange('room', drawerForm)"
              >
              </uni-select>
            </div>
          </div>
        </div>
        <p class="item-line" />
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="auditStatusList" />
        <p class="item-line" />
        <h6 class="label">创建时间</h6>
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
import treeFind from '@/utils/treeFind'
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
    this.getPlaceData()
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
      let res = await Api.getPickList(this.filterForm).finally(() => {
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
      await Api.deleteMaterialPick([this.selectItemId])
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
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/pick/add?id=${id}`)
    },
    //添加
    handleAdd() {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/pick/add`)
    },
    // 修改
    handleEdit(row) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/pick/add?id=${row.id}`)
    },
    toDetail(row) {
      if (!this.$hasPower('AppDecorationMaterialPickDetail')) {
        return
      }
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/pick/detail?id=${row.id}`)
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
        this.filterForm.createTimeStart = this.moment(this.drawerForm.dateRange[0]).format('YYYY-MM-DD 00:00:00')
        this.filterForm.createTimeEnd = this.moment(this.drawerForm.dateRange[1]).format('YYYY-MM-DD 23:59:59')
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    async getPlaceData() {
      let res = await Api.getBuildingList(this.projectId)
      let selectTreeDate = []
      for (let i = 0; i < res.data.length; i++) {
        let roomDataRes = await this.getRoomDataList(res.data[i].id)
        let child = roomDataRes.map(unit => {
          let unitChildren = unit.floorList.map(floor => {
            let roomChildren = floor.roomList.map(room => {
              return {
                type: 'room',
                value: room.id,
                label: room.roomName,
                name: room.roomName,
                id: room.id
              }
            })
            return {
              type: 'floor',
              value: floor.constructionFloorId,
              id: floor.constructionFloorId,
              label: floor.floorName,
              name: floor.floorName,
              children: roomChildren
            }
          })
          return {
            type: 'unit',
            value: unit.id,
            id: unit.id,
            label: unit.unitName,
            name: unit.unitName,
            children: unitChildren
          }
        })
        selectTreeDate.push({
          label: res.data[i].name,
          name: res.data[i].name,
          value: res.data[i].id,
          id: res.data[i].id,
          type: 'building',
          children: child
        })
      }
      this.selectTreeDate = selectTreeDate
    },
    async getRoomDataList(buildingId) {
      let res = await Api.getRoomList({ buildingId })
      let unitList = []
      unitList = res.data.map(item => {
        return {
          name: item.unitName,
          label: item.unitName,
          id: item.id,
          value: item.id,
          ...item
        }
      })
      return unitList
    },
    getOpts(row, type) {
      if (type === 'building') {
        return this.selectTreeDate || []
      }
      if (type === 'unit') {
        if (!row.buildingId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'building' && item.id === row.buildingId
        })
        return findArr.children || []
      }
      if (type === 'floor') {
        if (!row.unitsId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'unit' && item.id === row.unitsId
        })
        return findArr.children || []
      }
      if (type === 'room') {
        if (!row.floorId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'floor' && item.id === row.floorId
        })
        return findArr.children || []
      }
    },
    handleChange(type, data) {
      if (type === 'building') {
        this.$set(data, 'unitsId', '')
        this.$set(data, 'floorId', '')
        this.$set(data, 'roomId', '')
      }
      if (type === 'unit') {
        this.$set(data, 'floorId', '')
        this.$set(data, 'roomId', '')
      }
      if (type === 'floor') {
        this.$set(data, 'roomId', '')
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('./index.less');
.main {
  padding-top: 5px;
}
.select-group {
  .select-line {
    display: flex;
    flex-wrap: wrap;
    .select-item {
      flex: 1;
      margin: 10rpx;
      padding: 0 10rpx;
      border: 2rpx #9e9a9a solid;
      font-size: 12px;
      line-height: 40rpx;
    }
  }
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
