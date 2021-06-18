<template>
  <view class="main">
    <uni-search-bar
      placeholder="规范名称/规范编号/创建人"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="toDetail(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">
                  <view class="ellipsis" style="max-width: 40%">{{ item.specificationName }}</view>
                </view>
                <view>类别：{{ $getLabel(norm, item.category) }}</view>
                <view>创建人：{{ item.creatorName }}</view>
                <view>创建时间：{{ item.createTime }}</view>
              </view>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAdd" />

    <EmptyTemplate v-if="total === 0" />

    <uni-drawer-custom ref="filterRef" isConfirm @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6 class="label">分类</h6>
      <uni-checkbox-button-group v-model="drawerForm.category" hasAll :options="norm" />
      <h6 class="label">创建时间</h6>
      <div style="display: flex; align-items: center; justify-content: center">
        <uni-date-picker
          v-model="drawerForm.beginTime"
          placeholder="开始时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          fields="second"
          mode="date"
        ></uni-date-picker>
        <span style="margin: 0 30px 10px"> ~ </span>
        <uni-date-picker
          v-model="drawerForm.endTime"
          placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          fields="second"
          mode="date"
        ></uni-date-picker>
      </div>
      <h6 class="label">创建人</h6>
      <uni-select-user v-model="drawerForm.userId" :mode="2" multiple></uni-select-user>
    </uni-drawer-custom>
  </view>
</template>

<script>
import Api from './api'
import norm from './lib/norm'
import utils from '@/utils/utils'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      norm,
      filterForm: {
        search: '',
        category: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId
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
  // 标题栏点击
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
      if (data.userId) {
        data.creatorIds = data.userId.split(',')
      } else {
        data.creatorIds = []
      }
      let res = await Api.getCheckSpecificList(data).finally(() => {
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
      this.filterForm.search = e.value
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    // 加载更多--无数据时scrollView不存在，滚动底部时，不会触发请求
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    toDetail(row) {
      this.$utils.toUrl('/pages/dataManage/qualityData/detail?id=' + row.id)
    },
    handleDrawerFormChange() {
      if (this.drawerForm.beginTime || this.drawerForm.endTime) {
        if (!this.drawerForm.beginTime) {
          utils.showToast('请选择开始时间')
          return
        } else if (!this.drawerForm.endTime) {
          utils.showToast('请选择结束时间')
          return
        } else if (moment(this.drawerForm.endTime).isBefore(this.drawerForm.beginTime)) {
          utils.showToast('开始时间不能大于结束时间')
          return
        } else if (this.drawerForm.endTime === this.drawerForm.beginTime) {
          utils.showToast('开始时间不能等于结束时间')
          return
        }
      }
      this.$refs.filterRef.close()
      this.filterForm = this.drawerForm
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    handleAdd() {
      this.$utils.toUrl('/pages/dataManage/qualityData/add')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
