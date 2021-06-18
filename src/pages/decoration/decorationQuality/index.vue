<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="创建人/整改人/复检人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <div class="item-body">
          <div class="content">
            <h2>
              {{ item.problemDesc }}
            </h2>
            <p>问题部位：{{ item.buildingName }}-{{ item.unitName }}-{{ item.floorName }}-{{ item.roomName }}</p>
            <p>图纸名称：{{ item.drawingsName }}</p>
            <p class="line">
              <span>复检人：{{ item.reviewPrincipalName }}</span
              ><span>复检时间：{{ item.reviewTime }}</span>
            </p>
            <p class="line">
              <span>整改人：{{ item.rectifyPrincipalName }}</span
              ><span>整改时间：{{ item.rectifyDeadTime }}</span>
            </p>
            <p>整改期限：{{ item.rectifyDeadline | ymd }}</p>
            <p class="line">
              <span>创建人：{{ item.creatorName }}</span>
              <span>创建时间：{{ item.createTime }}</span>
            </p>
          </div>
          <aside>
            <uni-status :value="item.status" :options="problemStatusList"></uni-status>
          </aside>
        </div>
        <footer v-if="[0, 1, 2].includes(item.status)">
          <template v-if="item.status === 0">
            <span
              v-if="$hasPower('AppDecorationQualityInspectDelete')"
              class="common-button"
              type="error"
              @click.stop="handleDelete(item.id)"
              >删除</span
            >
            <span
              v-if="$hasPower('AppDecorationQualityInspectRelease')"
              class="common-button"
              type="primary"
              @click.stop="handleRelease(item)"
              >下达</span
            >
            <span
              v-if="$hasPower('AppDecorationQualityInspectEdit')"
              class="common-button"
              type="primary"
              @click.stop="handleEdit(item)"
              >编辑</span
            >
          </template>
          <template
            v-if="
              item.status === 1 && $hasPower('AppDecorationQualityInspectRectify') && userId === item.rectifyPrincipal
            "
          >
            <span class="common-button" type="primary" @click.stop="toRectify(item)">整改</span>
          </template>
          <template
            v-if="item.status === 2 && $hasPower('AppDecorationQualityInspectReview') && userId === item.creator"
          >
            <span class="common-button" type="primary" @click.stop="toReview(item)">复检</span>
          </template>
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
    <uni-add v-if="$hasPower('AppDecorationQualityInspectAdd')" @click="handleAdd"></uni-add>
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
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="problemStatusList" />
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
import problemStatusList from './lib/problemStatusList'
import treeFind from '@/utils/treeFind'
export default {
  components: { EmptyTemplate, UniPopupDialog },
  data() {
    return {
      projectId: this.$store.state.project.projectId,
      userId: uni.getStorageSync('userId') || '',
      problemStatusList,
      selectTreeDate: [],
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
      list: []
    }
  },
  onLoad(options) {},
  onShow() {
    this.init()
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
    },
    refresh: _.debounce(async function () {
      this.loading = true
      let res = await Api.getProblemList(this.filterForm).finally(() => {
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
    //下达
    async handleRelease(row) {
      await Api.releaseQualityProblemById(row.id)
      this.$utils.showToast('删除成功')
      await this.init()
    },
    //取消删除
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    //确认删除
    async deleteConfirm(done, value) {
      await Api.deleteQualityProblemById(this.selectItemId)
      done()
      this.$utils.showToast('删除成功')
      await this.init()
    },
    //删除
    async handleDelete(id) {
      this.selectItemId = id
      this.$refs.deletePopup.open()
    },
    handleAdd() {
      this.$utils.toUrl(`/pages/decoration/decorationQuality/add`)
    },
    handleEdit(row) {
      this.$utils.toUrl(`/pages/decoration/decorationQuality/add?id=${row.id}`)
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/decoration/decorationQuality/detail?id=${row.id}`)
    },
    toRectify(row) {
      this.$utils.toUrl(`/pages/decoration/decorationQuality/detail?id=${row.id}&type=rectify`)
    },
    toReview(row) {
      this.$utils.toUrl(`/pages/decoration/decorationQuality/detail?id=${row.id}&type=review`)
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
