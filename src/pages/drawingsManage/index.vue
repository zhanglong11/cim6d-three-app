<template>
  <view class="main">
    <uni-search-bar @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="toDetail(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.drawingsName }}</view>
                <view>上传人：{{ item.creatorName }}</view>
                <view>上传时间：{{ item.createTime }}</view>
              </view>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAdd" />

    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import Api from './api'
export default {
  components: {},
  data() {
    return {
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: []
    }
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
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.list(data).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    // 加载更多--无数据时scrollView不存在，滚动底部时，不会触发请求
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/drawingsManage/detail?id=${row.id}`)
    },
    handleAdd() {
      this.$utils.toUrl('/pages/drawingsManage/add')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
