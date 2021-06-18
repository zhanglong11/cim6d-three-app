<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="可根据验收名字搜索"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            {{ item.acceptanceName }}
          </h2>
          <p>施工负责人：{{ item.constructionDirectorName }}</p>
          <p>创建人：{{ item.creatorName }}</p>
          <p>检查时间：{{ item.createTime }}</p>
          <aside>
            <uni-status :value="item.status" :options="inspectStatus"></uni-status>
          </aside>
        </section>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add @click="handlerAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" :options="inspectStatus" />
        <p class="item-line" />
        <p class="item-line" />
        <h6 class="label">计划验收时间</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="drawerForm.acceptanceStartDate"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="drawerForm.acceptanceEndDate"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
        <p class="item-line" />
        <h6 class="label">创建人</h6>
        <uni-select-user v-model="drawerForm.creatorId" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from '@/pages/quality/api'
import inspectStatus from '../lib/inspectStatus'
export default {
  name: 'QualityInspectionList',
  components: { EmptyTemplate },
  data() {
    return {
      inspectStatus,
      filterForm: {
        acceptanceName: '',
        page: 1,
        rows: 10,
        status: '',
        projectId: this.$store.state.project.projectId
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: []
    }
  },
  onLoad(options) {},
  computed: {
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || []
    }
  },
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
      let res = await Api.getInspectionList(this.filterForm).finally(() => {
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
      this.$utils.toUrl(`/pages/quality/inspection/add`)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.acceptanceName = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.acceptanceName = ''
      this.refresh()
    },
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      if (this.filterForm.creatorId) {
        this.filterForm.creatorIds = this.filterForm.creatorId.split(',')
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/quality/inspection/detail?id=${row.id}&status=${row.status}`)
    }
  }
}
</script>

<style scoped lang="less">
@import url('index.less');
.main {
  padding-top: 5px;
}
</style>
