<template>
  <div class="main is-white">
    <uni-search-bar placeholder="" @confirm="handleSearchBarConfirmed" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>设备编号{{ item.deviceId }}</h2>
          <p>姓名：{{ item.userName }}</p>
        </section>
        <footer>
          <span>创建人:{{ item.adminName }}</span>
          <span>创建时间：{{ item.createTime | ymd }}</span>
        </footer>
      </div>
      <EmptyTemplate v-if="total === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from '@/pages/safetyCap/api'
export default {
  components: { EmptyTemplate },
  data() {
    return {
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId
      },
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
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getCapsList(this.filterForm).finally(() => {
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
    toDetail(row) {
      this.$utils.toUrl(`/pages/safetyCap/trackDetail?id=${row.userId}`)
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
