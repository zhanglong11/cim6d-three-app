<template>
  <view class="main is-white">
    <div class="tabs-wrap">
      <uni-tabs v-model="type" class="default-tabs">
        <uni-tab-pane name="receive" label="发送我的消息" />
        <uni-tab-pane name="send" label="我发出的消息" />
        <uni-tab-pane name="wxSend" label="微信推送消息" />
      </uni-tabs>
    </div>
    <uni-search-bar
      v-if="type !== 'wxSend'"
      ref="searchBar"
      placeholder="搜索"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    />
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <template v-if="type === 'receive'">
        <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
          <section>
            <h2>
              <b>{{ item.title }}</b>
            </h2>
            <p>公告类型：{{ $getLabel(typeList, item.type) }}</p>
            <p>发送人：{{ item.sendName }}</p>
            <p>发送时间：{{ item.sendTime }}</p>
            <p>公告状态：{{ $getLabel(statusList, item.readStatus) }}</p>
          </section>
        </div>
      </template>
      <template v-if="type === 'send'">
        <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
          <section>
            <h2>
              <b>{{ item.title }}</b>
            </h2>
            <p>接收人：{{ item.receiveName }}</p>
            <p>发送时间：{{ item.sendTime }}</p>
          </section>
        </div>
      </template>
      <template v-if="type === 'wxSend'">
        <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
          <section>
            <h2>
              <b>{{ item.title }}</b>
            </h2>
            <p>功能模块：{{ getPowerName(item.powerKey) }}</p>
            <p>推送机制：{{ $getLabelFromArg('push_mechanism', item.mechanismType) }}</p>
            <p>推送时间：{{ item.sendTime }}</p>
            <p>消息数量：{{ item.sendCount }}</p>
          </section>
        </div>
      </template>
      <EmptyTemplate v-if="!total" />
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="type === 'send'" @click="handlerAdd" />
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div v-if="type === 'receive'">
        <h6 class="label">消息类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.type" hasAll :options="typeList" />
        <p class="item-line" />
        <h6 class="label">消息状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.readStatus" hasAll :options="statusList" />
        <p class="item-line" />
        <h6 class="label">发送时间</h6>
        <uni-date-range :startDate.sync="drawerForm.startTime" :endDate.sync="drawerForm.endTime" />
      </div>
      <div v-if="type === 'send'">
        <h6 class="label">发送时间</h6>
        <uni-date-range :startDate.sync="drawerForm.startTime" :endDate.sync="drawerForm.endTime" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import _ from 'lodash'
import Api from './api'
import statusList from './lib/statusList'
import typeList from './lib/typeList'
export default {
  data() {
    return {
      type: 'receive',
      filterForm: {
        type: '',
        readStatus: '',
        keyword: '',
        page: 1,
        rows: 10
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0,
      statusList,
      typeList
    }
  },
  computed: {
    powerList() {
      return this.$store.state.userPower.powerList
    }
  },
  watch: {
    type() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.$refs.searchBar.clear()
      this.init()
    }
  },
  onLoad(options) {
    this.filterForm.readStatus = options.readStatus
  },
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
      // this.loading = true
      let o = _.cloneDeep(this.filterForm)
      if (o.type === '') {
        delete o.type
      }
      if (o.readStatus === '') {
        delete o.readStatus
      }
      const data = _.cloneDeep(o)
      let res = ''
      if (this.type === 'receive') {
        res = await Api.receiveList(data)
      }
      if (this.type === 'send') {
        res = await Api.sendList(data)
      }
      if (this.type === 'wxSend') {
        res = await Api.queryWxSendMessage(data)
      }
      // this.loading = false
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    }, 100),
    // 获取功能模块
    getPowerName(powerKey) {
      return _.find(this.powerList, { powerKey })?.powerName ?? '-'
    },
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
      this.$utils.toUrl(`/pages/message/add`)
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
      this.$utils.toUrl(`/pages/message/detail?id=${row.id}&type=${this.type}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./style');
</style>
