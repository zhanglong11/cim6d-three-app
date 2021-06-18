<template>
  <view class="main is-white">
    <!-- <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar> -->
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body" style="padding-top: 10px">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title flex-item">{{ item.name }}</view>
                <view class="flex-item">
                  <view class="left">
                    <view class="flex-item-label">年度：</view>
                    <view class="flex-item-content">{{ item.year }}</view>
                  </view>
                  <view class="left">
                    <view class="flex-item-label">月度：</view>
                    <view class="flex-item-content">{{ item.month }}</view>
                  </view>
                </view>
                <view class="flex-item">
                  <view class="left">
                    <view class="flex-item-label">编制人：</view>
                    <view v-for="(items, index) in item.authorList" :key="index" class="flex-item-content">
                      {{ items.name }}
                    </view>
                  </view>
                  <view class="left">
                    <view class="flex-item-label">编制日期：</view>
                    <view class="flex-item-content">{{ item.reportDate | formatData }}</view>
                  </view>
                </view>
              </view>
              <view v-if="item.creator === $store.state.user.userId" class="btn-right">
                <text
                  v-if="$hasPower('AppSupervisorWeeklyDelete')"
                  class="btn-delete"
                  @click.stop="handleDelete(item.id)"
                  >删除</text
                >
                <text v-if="$hasPower('AppSupervisorWeeklyEdit')" class="btn-update" @click.stop="handleUpdate(item.id)"
                  >修改</text
                >
              </view>
            </view>
            <view class="card-footer border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add v-if="$hasPower('AppSupervisorWeeklyAdd')" @click.native="handleAddItemInfo" />
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
    <uni-drawer-custom
      ref="filterRef"
      :isConfirm="isConfirm"
      @submit="handleDrawerFormChange"
      @reset="handleDrawerReset"
    >
      <div>
        <h6 class="label">输入检索</h6>
        <textarea
          v-model="filterForm.keyword"
          auto-height
          placeholder="监理月报名称/编制人/创建人"
          style="font-size: 13px; color: #757575"
        />
        <p class="item-line" />
        <h6 class="label">年度</h6>
        <uni-date-picker
          v-model="filterForm.year"
          valueFormat="YYYY"
          placeholder="请选择年度"
          fields="year"
          mode="date"
        ></uni-date-picker>
        <p class="item-line" />
        <h6 class="label">月度</h6>
        <uni-select
          v-model="filterForm.month"
          style="font-size: 13px; color: #757575"
          :options="monthList"
          placeholder="请选择月度"
        >
        </uni-select>
        <br />
        <p class="item-line" />
        <h6 class="label">创建时间</h6>
        <div style="display: flex; align-items: center; justify-content: center">
          <uni-date-picker
            v-model="filterForm.startTime"
            placeholder="开始时间"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px"> ~ </span>
          <uni-date-picker
            v-model="filterForm.endTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
        <!--        <h6 class="label">状态</h6>-->
        <!--        <uni-checkbox-button-group v-model="filterForm.status" :options="referStatus" />-->
        <!--        <h6 class="label">参与人员</h6>-->
        <!--        <uni-select-user v-model="drawerForm.participantId" :mode="2" multiple></uni-select-user>-->
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import monthList from '../lib/monthList'
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
import _ from 'lodash'
export default {
  components: { UniPopupDialog },
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
      isConfirm: true,
      drawerForm: {},
      monthlyItemId: ''
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
      Api.getMonthlyList(data).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
      })
    }, 100),
    async handleDelete(id) {
      this.monthlyItemId = id
      this.$refs.deletePopup.open()
    },
    //确认删除
    async deleteConfirm(done, value) {
      await Api.getMonthlyDelete(this.monthlyItemId)
      done()
      this.$utils.showToast('删除成功')
      await this.init()
    },
    //取消删除
    deleteClose() {
      this.$refs.deletePopup.close()
    },
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
      this.$utils.toUrl('/pages/decoration/decorationSupervisor/supervisorMonthly/add')
    },
    handlePreviewItemInfo(row) {
      this.$utils.toUrl(`/pages/decoration/decorationSupervisor/supervisorMonthly/detail?id=${row.id}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      // this.filterForm = this.drawerForm
      if (this.filterForm.month && !this.filterForm.year) {
        this.$utils.showToast('请先选择年份')
        return
      }
      this.isConfirm = false
      console.log('filter change', this.filterForm)
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    handleUpdate(id) {
      this.$utils.toUrl(`/pages/decoration/decorationSupervisor/supervisorMonthly/add?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../styles/list.less');
// @import url('../index.less');
.title {
  width: 640px;
}
.card-body {
  position: relative;
  .card-info {
    flex: 1;
    width: 50%;
    position: relative;
    .flex-item {
      padding: 0 10rpx;
      display: flex;
      align-items: flex-start;
      .left {
        flex: 1;
        .flex-item-label {
          display: inline-block;
          overflow: hidden;
        }
        .flex-item-content {
          width: 50%;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &.title {
        flex-basis: 100%;
      }
    }
  }
  .btn-right {
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    .btn-delete {
      display: inline-block;
      width: 80px;
      height: 44px;
      background: red;
      border-radius: 10%;
    }
    .btn-update {
      display: inline-block;
      width: 80px;
      height: 44px;
      background: #00aeff;
      border-radius: 10%;
      margin-left: 5px;
    }
  }
}
</style>
