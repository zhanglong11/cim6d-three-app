<template>
  <view class="main is-white">
    <div class="tabs-wrap">
      <uni-tabs v-model="type" class="default-tabs">
        <uni-tab-pane name="hand" label="我执行的" />
        <uni-tab-pane name="send" label="我发起的" />
      </uni-tabs>
    </div>
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
              {{ item.taskContent }}
            </h2>
            <p>任务类型：{{ item.taskType ? '多任务' : '单一任务' }}</p>
            <p>任务重要性：{{ $getLabel(importList, item.taskLevel) }}</p>
            <p>任务截止时间：{{ item.taskEndTime }}</p>
            <p v-if="type === 'hand'">发起人：{{ item.initiatorStr }}</p>
            <p v-else>接收人：{{ item.executorStr }}</p>
            <aside>
              <uni-status :value="item.status" :options="statusList" />
            </aside>
          </section>
        </div>
      </template>
      <EmptyTemplate v-if="!total" />
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="type === 'send'" @click="handlerAdd" />
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">任务分类</h6>
        <uni-checkbox-button-group v-model="drawerForm.taskType" hasAll :options="typeList" />
        <p class="item-line" />
        <h6 class="label">任务重要性</h6>
        <uni-checkbox-button-group v-model="drawerForm.taskLevel" hasAll :options="importList" />
        <p class="item-line" />
        <h6 class="label">任务状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="statusList" />
        <p class="item-line" />
        <h6 class="label">任务截止时间</h6>
        <uni-date-range :startDate.sync="drawerForm.startTime" :endDate.sync="drawerForm.endTime" />
        <p class="item-line" />
        <template v-if="type === 'hand'">
          <h6 class="label">任务发起人</h6>
          <uni-select-user v-model="drawerForm.initiator" :mode="2" multiple />
        </template>
        <template v-else>
          <h6 class="label">任务接收人</h6>
          <uni-select-user v-model="drawerForm.executor" :mode="2" multiple />
        </template>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import _ from 'lodash'
import Api from './api'
import typeList from './lib/typeList'
import importList from './lib/importList'
import statusList from './lib/statusList'
export default {
  data() {
    return {
      type: 'hand',
      filterForm: {
        taskType: '',
        taskLevel: '',
        status: '',
        taskContent: '',
        executeFlag: true,
        page: 1,
        rows: 10
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0,
      typeList,
      statusList,
      importList
    }
  },
  watch: {
    type() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.$refs.searchBar.clear()
      this.init()
    }
  },
  onLoad(options) {},
  onShow() {
    this.init()
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
      if (o.taskType === '') {
        delete o.taskType
      }
      if (o.status === '') {
        delete o.status
      }
      if (o.taskLevel === '') {
        delete o.taskLevel
      }
      const data = _.cloneDeep(o)
      data.executeFlag = this.type === 'send'
      let res = await Api.list(data).finally(() => {
        this.loading = false
      })
      console.log(this.list)
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
      this.$utils.toUrl(`/pages/task/add`)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.taskContent = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.taskContent = ''
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
      this.$utils.toUrl(`/pages/task/detail?id=${row.id}&type=${this.type}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./style');
</style>
