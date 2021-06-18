<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="危险源名称/创建人/责任人/检查人/复查人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            {{ item.dangerSource }}
          </h2>
          <p>伤害类型：{{ $getLabel(harmTypeList, item.harmCategory) }}</p>
          <p>所在位置：{{ item.dangerSourcePlaceName }}</p>
          <p>创建人：{{ item.creatorName }}</p>
          <p>创建时间：{{ item.createTime }}</p>
          <aside>
            <uni-status :value="item.status" :options="dangerCheckStatusList"></uni-status>
          </aside>
        </section>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="$hasPower('SafetyDangerAppAroundInspectAdd')" @click="handlerAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">伤害类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.harmCategory" hasAll :options="harmTypeList" />
        <p class="item-line" />
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="dangerCheckStatusList" />
        <!--<p class="item-line" />
        <h6 class="label">创建人</h6>
        <uni-select-user v-model="drawerForm.userId" :mode="2" multiple></uni-select-user>-->
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from '@/pages/safety/api'
import dangerCheckStatusList from '../lib/dangerCheckStatusList'
export default {
  components: { EmptyTemplate },
  data() {
    return {
      dangerCheckStatusList,
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId,
        harmCategory: '',
        status: ''
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: []
    }
  },
  onLoad(options) {},
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
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
      let res = await Api.getDangerInspectList(this.filterForm).finally(() => {
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
    //添加
    handlerAdd() {
      this.$utils.toUrl(`/pages/safety/dangerCheck/add`)
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
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/safety/dangerCheck/detail?id=${row.id}`)
    }
  }
}
</script>

<style scoped lang="less">
@import url('~@/pages/quality/index.less');
.main {
  padding-top: 5px;
}
</style>
