<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="打卡地点/打卡人"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="(item, i) in list" :key="i" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">{{ item.patrolLocationName }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">打卡地点：</view>
                  <view class="flex-item-content">{{ item.clockInPlace }}</view>
                </view>
                <!-- <view>打卡地点：{{ item.clockInPlace }}</view> -->
              </view>
            </view>
            <view class="card-footer border-top">
              <text>打卡人：{{ item.creatorName }}</text>
              <text>打卡时间：{{ item.clockTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add v-if="$hasPower('AppPatrolAdd')" @click.native="handleAddItemInfo" />

    <EmptyTemplate v-if="total === 0" />
  </div>
</template>

<script>
import Api from './api'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId
      },
      loading: false,
      list: [],
      total: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.getClockList(data).then(res => {
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
      this.$utils.toUrl('/pages/patrol/patrolClock/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl(`/pages/patrol/patrolClock/detail?id=${row.patrolClockInId}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
@import url('../../../styles/list.less');
</style>
