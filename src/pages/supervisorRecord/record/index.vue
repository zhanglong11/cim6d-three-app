<template>
  <view class="main is-white">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">旁站{{ item.code }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">单位工程名称：</view>
                  <view class="flex-item-content">{{ item.engineeringName }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">旁站部位或工序：</view>
                  <view class="flex-item-content">{{ item.partProcedure }}</view>
                </view>
              </view>
              <!--              <view>-->
              <!--                <p>-->
              <!--                  <span class="circle" :style="{ backgroundColor: referStatus[item.status].color }"></span-->
              <!--                  >{{ referStatus[item.status].label }}-->
              <!--                </p>-->
              <!--              </view>-->
            </view>
            <view class="card-footer border-top">
              <text>旁站人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddItemInfo" />
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">旁站开始时间</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="filterForm.siteStationStartFromDate"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="filterForm.siteStationStartToDate"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
        <p class="item-line" />
        <h6 class="label">创建时间</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="filterForm.createTimeFromDate"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="filterForm.createTimeToDate"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/supervisorRecord'
import monthList from '../lib/monthList'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      monthList,
      loading: false,
      list: [],
      total: 0,
      drawerForm: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.getRecordList(data).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleAddItemInfo() {
      this.$utils.toUrl('/pages/supervisorRecord/record/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl(`/pages/supervisorRecord/record/detail?id=${row.id}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      // this.filterForm = this.drawerForm
      console.log('filter change', this.filterForm)
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../styles/list.less');
@import url('../index.less');
.card-info .flex-item.title {
  white-space: pre-wrap;
}
</style>
