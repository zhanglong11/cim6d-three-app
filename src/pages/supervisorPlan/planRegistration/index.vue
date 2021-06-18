<template>
  <view class="main is-white">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="toDetail(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title ellipsis">{{ item.name }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">编制人：</view>
                  <view class="flex-item-content">{{ item.writer }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">编制日期：</view>
                  <view class="flex-item-content">{{ item.writerDateStr }}</view>
                </view>
              </view>
              <!--<view>
                <p>
                  <span class="circle" :style="{ backgroundColor: auditStatus[item.status].color }"></span
                  >{{ auditStatus[item.status].label }}
                </p>
              </view>-->
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorStr }}</text>
              <text>创建时间： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAdd" />
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" isConfirm @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <!--<h6 class="label">状态</h6>
      <uni-checkbox-button-group v-model="drawerForm.status" :options="auditStatus" />-->
      <h6 class="label">创建时间</h6>
      <div style="display: flex; align-items: center; justify-content: center">
        <uni-date-picker
          v-model="drawerForm.startTime"
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
    </uni-drawer-custom>
  </view>
</template>

<script>
import Api from './api'
import auditStatus from '../lib/auditStatus'
import utils from '@/utils/utils'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      auditStatus,
      filterForm: {
        keyword: '',
        // status: undefined,
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
      let res = await Api.getPlanRegistrationList(data).finally(() => {
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
      this.$utils.toUrl(`/pages/supervisorPlan/planRegistration/detail?id=${row.id}&status=${row.status}`)
    },
    handleDrawerFormChange() {
      if (this.drawerForm.startTime || this.drawerForm.endTime) {
        if (!this.drawerForm.startTime) {
          utils.showToast('请选择开始时间')
          return
        } else if (!this.drawerForm.endTime) {
          utils.showToast('请选择结束时间')
          return
        } else if (moment(this.drawerForm.endTime).isBefore(this.drawerForm.startTime)) {
          utils.showToast('开始时间不能大于结束时间')
          return
        } else if (this.drawerForm.endTime === this.drawerForm.startTime) {
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
      this.$utils.toUrl('/pages/supervisorPlan/planRegistration/add')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/list.less';
@import url('../index.less');
</style>
