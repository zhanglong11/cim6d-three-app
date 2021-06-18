<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="检查人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            {{ item.problemDesc }}
          </h2>
          <p>问题部位：{{ item.problemArea }}</p>
          <p>检查性质：{{ $getLabel(inspectNatureList, item.inspectNature) }}</p>
          <p>检查人：{{ item.creatorName }}</p>
          <p>检查时间：{{ item.inspectTime }}</p>
          <aside>
            <uni-status :value="item.status" :options="issueStatusList"></uni-status>
          </aside>
        </section>
        <!--<footer>
          <span>测量人:{{ item.creatorName }}</span>
          <span>测量时间：{{ item.createTime | ymd }}</span>
        </footer>-->
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="$hasPower('QualityIssueAppAdd')" @click="handlerAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="issueStatusList" />
        <p class="item-line" />
        <h6 class="label">检查性质</h6>
        <uni-checkbox-button-group v-model="drawerForm.inspectNature" hasAll :options="inspectNatureList" />
        <p class="item-line" />
        <h6 class="label">计划时间</h6>
        <uni-date-picker
          v-model="drawerForm.planDate"
          valueFormat="YYYY-MM-DD"
          fields="day"
          mode="range"
        ></uni-date-picker>
        <!-- <p class="item-line" />
        <h6 class="label">创建人</h6>
        <uni-select-user v-model="drawerForm.userId" :mode="2" multiple></uni-select-user>-->
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from './api'
import issueStatusList from './lib/issueStatusList'
export default {
  components: { EmptyTemplate },
  data() {
    return {
      issueStatusList,
      inspectNatureList: [
        { label: '计划检查', value: 1 },
        { label: '日常巡检', value: 2 }
      ],
      filterForm: {
        inspectType: 1,
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId,
        status: '',
        inspectNature: '',
        planDate: []
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
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getIssueList(this.filterForm).finally(() => {
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

    handlerAdd() {
      this.$utils.toUrl(`/pages/quality/add`)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.search = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      if (this.drawerForm.planDate[0]) {
        this.filterForm.startDate = this.moment(this.drawerForm.planDate[0]).format('YYYY-MM-DD 00:00:00')
        this.filterForm.endDate = this.moment(this.drawerForm.planDate[1]).format('YYYY-MM-DD 23:59:59')
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/quality/detail?id=${row.id}`)
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
