<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="创建人/通知单位/联系单位"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll main-body list" @scrolltolower="handleScrollToLower">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>{{ $getLabel(formType, item.type) }}+{{ item.qualityProblemCode }}</h2>
          <p>表单类型：{{ $getLabel(formType, item.type) }}</p>
          <p style="width: 80%">通知/联系单位:{{ item.noticeContactCompany }}</p>
          <p>创建人:{{ item.creatorName }}</p>
          <p>创建时间：{{ moment(item.createTime).format('YYYY-MM-DD HH:ss') }}</p>
          <aside>
            <uni-status :value="item.status" :options="statusType"></uni-status>
          </aside>
        </section>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="$hasPower('QualityIssueAppAdds')" @click="handlerAdd"></uni-add>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="statusType" />
        <p class="item-line" />
        <h6 class="label">表单类型</h6>
        <uni-checkbox-button-group v-model="drawerForm.type" hasAll :options="formType" />
        <p class="item-line" />
        <h6 class="label">创建时间</h6>
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
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialogs
        mode="base"
        type=""
        width="165"
        :content="formType"
        title="新建质量问题类型"
        :before-close="true"
        @close="deleteClose"
        @confirm="deleteConfirm"
      ></uni-popup-dialogs>
    </uni-popup>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from '../api'
import { formType, statusType } from '../lib/issueStatusList'
import UniPopupDialogs from '@/components/uni-popup/uni-popup-dialogs'
import moment from 'moment'
export default {
  components: { EmptyTemplate, UniPopupDialogs },
  data() {
    return {
      statusType,
      formType,
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId,
        status: '',
        type: '',
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
      let res = await Api.getQualityProblem(this.filterForm).finally(() => {
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
      this.$refs.deletePopup.open()
      // this.$utils.toUrl(`/pages/quality/add`)
    },
    deleteClose() {
      this.$refs.deletePopup.close()
    },
    deleteConfirm(e) {
      //表单类型
      if (e === 1) {
        //工程质量通知
        this.$utils.toUrl(`/pages/quality/problemsz/addQuality`)
      } else if (e === 2) {
        //工程业务联系单
        this.$utils.toUrl(`/pages/quality/problemsz/addProject`)
      } else if (e === 3) {
        //工作业务联系
        this.$utils.toUrl(`/pages/quality/problemsz/addWork`)
      }
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
      console.log(row)
      if (row.type === 1) {
        //工程质量通知
        this.$utils.toUrl(
          `/pages/quality/problemsz/detailQuality?id=${row.qualityProblemId}&status=${row.status}&type=${row.type}`
        )
      } else if (row.type === 2) {
        //工程业务联系单
        this.$utils.toUrl(
          `/pages/quality/problemsz/detailProject?id=${row.qualityProblemId}&status=${row.status}&type=${row.type}`
        )
      } else if (row.type === 3) {
        //工作业务联系
        this.$utils.toUrl(
          `/pages/quality/problemsz/detailWork?id=${row.qualityProblemId}&status=${row.status}&type=${row.type}`
        )
      }

      // this.$utils.toUrl(`/pages/quality/inspection/detail?id=${row.id}&status=${row.status}`)
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
