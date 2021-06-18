<template>
  <view class="main is-white">
    <!-- <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar> -->
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body" style="padding-top: 10px">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">{{ item.unitProjectName }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">周报编号：</view>
                  <view class="flex-item-content">{{ item.code }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">周报所属日期：</view>
                  <view class="flex-item-content"
                    >{{ item.reportStartDate | formatData }}~{{ item.reportEndDate | formatData }}</view
                  >
                </view>
              </view>
              <view>
                <p>
                  <span class="circle" :style="{ backgroundColor: referStatus[item.status].color }"></span
                  >{{ referStatus[item.status].label }}
                </p>
              </view>
            </view>
            <view class="card-btn">
              <view v-if="item.creator === $store.state.user.userId && item.status === 0">
                <span
                  v-if="$hasPower('AppSupervisorMonthlyDelete')"
                  class="btn-button"
                  style="background: red"
                  @click.stop="handleDelete(item.id)"
                  >删除</span
                >
                <span
                  v-if="$hasPower('AppSupervisorMonthlyUpdate')"
                  class="btn-button"
                  style="background: #00aeff"
                  @click.stop="toEdit(item.id)"
                  >修改</span
                >
              </view>
              <view v-if="item.signer === $store.state.user.userId && item.status === 0">
                <span
                  v-if="$hasPower('AppSupervisorMonthlySign')"
                  class="btn-button"
                  style="background: #00aeff"
                  @click.stop="toSign(item.id)"
                  >签阅</span
                >
              </view>
            </view>
            <view class="card-footer border-top">
              <text>周报填写人：{{ item.creatorName }}</text>
              <text>提交时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add v-if="$hasPower('AppSupervisorMonthlyAdd')" @click.native="handleAddItemInfo" />
    <EmptyTemplate v-if="total === 0" />
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
        mode="base"
        type="warn"
        title="确认删除?"
        :before-close="true"
        @close="deleteClose"
        @confirm="deleteConfirm"
      ></uni-popup-dialog>
    </uni-popup>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">输入检索</h6>
        <textarea v-model.trim="drawerForm.keyword" auto-height placeholder="单位工程名称/周报填写人" />
        <p class="item-line" />
        <br />
        <h6 class="label">周报所属日期</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="drawerForm.diaryStartTime"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="drawerForm.diaryEndTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
        <p class="item-line" />
        <br />
        <h6 class="label">提交日期</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="drawerForm.startTime"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="drawerForm.endTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
        <!-- <h6 class="label">周报填写人</h6>
        <uni-select-user v-model="drawerForm.creatorsId" :mode="2" multiple></uni-select-user> -->
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import referStatus from '../lib/referStatus'
import monthList from '../lib/monthList'
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
import _ from 'lodash'
export default {
  components: {
    UniPopupDialog
  },
  data() {
    return {
      filterForm: {
        content: '',
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      monthList,
      loading: false,
      list: [],
      total: 0,
      referStatus,
      drawerForm: {},
      weeklyItemId: ''
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.getWeeklyList(data).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.content = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.content = ''
      this.init()
    },
    handleAddItemInfo() {
      this.$utils.toUrl('/pages/decoration/decorationSupervisor/supervisorWeekly/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl(
        `/pages/decoration/decorationSupervisor/supervisorWeekly/detail?id=${row.id}&status=${row.status}`
      )
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      if (this.filterForm.creatorsId) {
        this.filterForm.creators = this.filterForm.creatorsId.split(',')
      }
      // console.log('filter change', this.filterForm)
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    //删除
    handleDelete(id) {
      this.weeklyItemId = id
      this.$refs.deletePopup.open()
    },
    //确认删除
    async deleteConfirm(done, value) {
      await Api.getWeeklyDelete(this.weeklyItemId)
      done()
      this.$utils.showToast('删除成功')
      await this.init()
    },
    //取消删除
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    //修改
    toEdit(id) {
      this.$utils.toUrl(`/pages/decoration/decorationSupervisor/supervisorWeekly/add?id=${id}`)
    },
    //签约
    toSign(id) {
      this.$utils.toUrl(`/pages/decoration/decorationSupervisor/supervisorWeekly/detail?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../styles/list.less');
@import url('index.less');
</style>
