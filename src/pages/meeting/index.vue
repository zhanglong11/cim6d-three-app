<template>
  <view class="main is-white">
    <uni-search-bar
      ref="searchBar"
      placeholder="搜索"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    />
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <template>
        <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
          <section>
            <h2>
              {{ item.meetingSubject }}
            </h2>
            <p>会议地点：{{ item.meetingAddress }}</p>
            <p>会议开始时间：{{ item.startTime }}</p>
            <p>会议结束时间：{{ item.endTime }}</p>
            <p class="footer">
              <span>发起人：{{ item.initiatorName }}</span
              ><span>发起时间：{{ item.createTime }}</span>
            </p>
            <aside>
              <uni-status :value="item.status" :options="statusList" />
            </aside>
          </section>
        </div>
      </template>
      <EmptyTemplate v-if="!total" />
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add @click="handlerAdd" />
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">会议状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="statusList" />
        <p class="item-line" />
        <h6 class="label">会议类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.meetingType" hasAll :options="meetingType" />
        <p class="item-line" />
        <h6 class="label">会议开始时间</h6>
        <uni-date-range :startDate.sync="drawerForm.startTime" :endDate.sync="drawerForm.endTime" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import _ from 'lodash'
import Api from './api'
import statusList from './lib/statusList'
export default {
  data() {
    return {
      filterForm: {
        status: '',
        meetingType: '',
        keyword: '',
        page: 1,
        rows: 10
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0,
      statusList
    }
  },
  onLoad(options) {},
  onShow() {
    this.init()
  },
  computed: {
    meetingType() {
      return this.$getArgList('workMeetingType') || []
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
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
      let o = _.cloneDeep(this.filterForm)
      if (o.status === '') {
        delete o.status
      }
      if (o.meetingType === '') {
        delete o.meetingType
      }
      const data = _.cloneDeep(o)
      data.executeFlag = this.type === 'send'
      let res = await Api.list(data).finally(() => {
        this.loading = false
      })
      // console.log(res)
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
    handlerAdd() {
      this.$utils.toUrl(`/pages/meeting/add`)
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
      let startTime = this.drawerForm.startTime
      let endTime = this.drawerForm.endTime
      this.filterForm = this.drawerForm
      if (startTime) {
        this.filterForm.startTime += ' 00:00:00'
      }
      if (endTime) {
        this.filterForm.endTime += ' 23:59:59'
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/meeting/detail?id=${row.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./style');
</style>
