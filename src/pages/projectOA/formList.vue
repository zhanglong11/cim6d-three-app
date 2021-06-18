<template>
  <div class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="tabIndex" class="default-tabs" noLine>
        <uni-tab-pane :name="0" label="待审批" :count="count.taskCount" icon>
          <image src="./images/form1.png" class="icon-close" />
          <image src="./images/form1-hover.png" class="icon-hover" />
        </uni-tab-pane>
        <uni-tab-pane :name="1" label="已审批" icon>
          <image src="./images/form2.png" class="icon-close" />
          <image src="./images/form2-hover.png" class="icon-hover" />
        </uni-tab-pane>
        <uni-tab-pane :name="2" label="我发起的" icon>
          <image src="./images/form3.png" class="icon-close" />
          <image src="./images/form3-hover.png" class="icon-hover" />
        </uni-tab-pane>
        <uni-tab-pane :name="3" label="抄送给我的" :count="count.ccCount" icon>
          <image src="./images/form4.png" class="icon-close" />
          <image src="./images/form4-hover.png" class="icon-hover" />
        </uni-tab-pane>
      </uni-tabs>
      <div class="search-con">
        <uni-search-bar
          ref="searchBarRef"
          placeholder="表单名称"
          bgColor="#f5f5f5"
          @confirm="handleSearchBarConfirmed"
          @input="handleSearchBarInput"
        ></uni-search-bar>
        <!-- <div v-if="!tabLoading" class="condition">
          <span>
            <uni-date-picker mode="range" @input="changeTime">发起时间</uni-date-picker>
          </span>
          <span>
            <uni-select v-model.trim="queryForm.formGroupId" :options="groupList" @input="changeGroup"
              >所属模块</uni-select
            >
          </span>
        </div> -->
      </div>
    </div>
    <scroll-view scroll-y class="scroll-roll main-body" @scrolltolower="handleScrollToLower">
      <div class="list">
        <uni-card v-for="(item, i) in dataList" :key="i" @click="toDetails(item)">
          <div class="card-header">
            <div class="left-item">
              <span class="title">
                <image :src="item.icon" class="icon" />
                <span class="form-name">{{ item.processDefinitionName || item.formName }}</span>
              </span>
              <p class="type" :class="`type-${item.flag}`">
                <span>{{ item.formGroupName }}</span>
              </p>
            </div>
            <uni-btn v-if="!tabIndex" type="primary">审批</uni-btn>
            <uni-status v-if="tabIndex && tabIndex < 3" :value="item.status" :options="statusList"></uni-status>
            <uni-status v-if="tabIndex === 3" :value="item.status" :options="ccListStatus"></uni-status>
          </div>
          <div v-if="item.applyUserName" class="desc-time">发起人：{{ item.applyUserName }}</div>
          <div class="desc-time">发起时间：{{ item.createTime || item.startTime }}</div>
          <!-- <p class="card-footer">
            <span class="time"> {{ item.applyUserName }} {{ item.createTime || item.startTime }} </span>
            <span class="type">{{ item.formGroupName }}</span>
          </p> -->
        </uni-card>
      </div>
      <EmptyTemplate v-if="dataList.length === 0"></EmptyTemplate>
      <uni-more :listLength="dataList.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="changeDrawer" @reset="resetQuery">
      <div>
        <uni-form-item label="发起时间" isLink class="drawer-form-item">
          <uni-date-picker
            v-model="drawerForm.planDate"
            valueFormat="YYYY-MM-DD"
            fields="day"
            mode="range"
          ></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="所属模块" isLink class="drawer-form-item">
          <uni-select v-model.trim="drawerForm.formGroupId" :options="groupList"></uni-select>
        </uni-form-item>
        <template v-if="tabIndex === 2">
          <p class="item-line" />
          <h6 class="label">表单类型</h6>
          <uni-checkbox-button-group v-model="drawerForm.formType" :options="formTypeList" />
        </template>
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import statusList from './lib/statusList'
import { ccListStatus } from './lib/statusList'
import Api from './api'
export default {
  data() {
    //这里存放数据
    return {
      tabIndex: 0,
      tabLoading: false,
      ccListStatus,
      statusList,
      formTypeList: [
        {
          label: '需审批',
          value: 1
        },
        {
          label: '无需审批',
          value: 2
        }
      ],
      queryForm: {
        applyUserName: '',
        formGroupId: '',
        formType: 1,
        page: 1,
        formName: '',
        planDate: [],
        processDefinitionName: '',
        projectId: this.$store.state.project.projectId,
        rows: 10,
        startTimeBegin: '',
        startTimeEnd: '',
        taskStatus: 0
      },
      drawerForm: {},
      queryFormBack: {},
      count: {
        taskCount: 0,
        ccCount: 0
      },
      groupList: [],
      dataList: [],
      total: 0,
      loading: false
    }
  },
  watch: {
    tabIndex() {
      this.resetQuery()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.queryForm)
      this.$refs.filterRef.open()
    }
  },
  onShow() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.getFormCount()
      this.getGroupFormList()
      this.search()
    },
    // 表单统计
    async getFormCount() {
      let result = await Api.getFormCount()
      let datas = result.data
      this.count = {
        taskCount: datas.taskCount > 99 ? '99+' : datas.taskCount,
        ccCount: datas.ccCount > 99 ? '99+' : datas.ccCount
      }
    },
    // 获取分组表单列表
    async getGroupFormList() {
      let result = await Api.getGroupFormList()
      let datas = result.data || []
      let groupList = [{ label: '全部', value: '' }]
      datas.map(e => {
        groupList.push({
          label: e.name,
          value: e.id
        })
      })
      this.groupList = groupList
    },
    // 选择所属模块
    changeGroup(e) {
      this.search()
    },
    // 查询
    search() {
      this.queryForm.page = 1
      this.dataList = []
      this.total = 0
      this.queryList()
    },
    // 重置
    resetQuery() {
      this.tabLoading = true
      this.$refs.searchBarRef.searchVal = ''
      Object.assign(this.queryForm, this.queryFormBack)
      this.search()
      setTimeout(() => {
        this.tabLoading = false
      }, 20)
    },
    // 改变发起时间
    changeTime() {
      if (this.drawerForm.planDate.length === 0) {
        return
      }
      let startTimeBegin = this.drawerForm.planDate[0] + ' 00:00:00'
      let startTimeEnd = this.drawerForm.planDate[1] + ' 23:59:59'
      this.drawerForm.startTimeBegin = startTimeBegin
      this.drawerForm.startTimeEnd = startTimeEnd
    },
    // 筛选改变
    changeDrawer() {
      this.changeTime()
      Object.assign(this.queryForm, this.drawerForm)
      this.search()
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.queryForm.processDefinitionName = e.value
      if (this.tabIndex === 3) {
        this.queryForm.formName = e.value
      }
      this.search()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.queryForm.formName = ''
      this.queryForm.processDefinitionName = ''
      this.search()
    },
    // 获取审核待审核列表
    async queryList() {
      try {
        this.loading = true
        this.queryForm.taskStatus = this.tabIndex
        let result = ''
        if (this.tabIndex < 2) {
          // 待审批/已审批
          result = await Api.getTaskList(this.queryForm)
        }
        if (this.tabIndex === 2) {
          // 我发起的列表
          result = await Api.getCreatedByMeList(this.queryForm)
        }
        if (this.tabIndex === 3) {
          // 抄送给我的
          result = await Api.getCopyToMeList(this.queryForm)
        }
        let datas = result.data
        let list = datas.records || []
        this.dataList = [...this.dataList, ...list]
        this.total = datas.total
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.dataList.length) return
      this.queryForm.page++
      this.queryList()
    },
    // 跳转详情
    async toDetails(item) {
      let targetId = item.targetId || item.dataId
      if (this.tabIndex === 3 && !item.status) {
        // 抄送已读
        await Api.getCcUpdate(item.id)
      }
      // console.log(444, targetId, item)
      if (item.flag === '1' || item.flag === 1) {
        this.$utils.toUrl(`/pages/projectOA/customFormDetail?id=${targetId}&isCheck=${!this.tabIndex}`)
      } else {
        let appRouteUrl = item.appRouteUrl.split('?')[0]
        if (!appRouteUrl) {
          this.$utils.showToast('APP无此功能，请到PC端操作或查看!')
          return
        }
        // console.log(5555, targetId, `${appRouteUrl}?id=${targetId}&isCheck=${!this.tabIndex}&messageId=${targetId}`)
        this.$utils.toUrl(`${appRouteUrl}?id=${targetId}&isCheck=${!this.tabIndex}&messageId=${targetId}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.drawer-form-item {
  padding-left: 0;
  padding-right: 0;
  /deep/.label {
    margin-bottom: 0 !important;
  }
  /deep/.form-label {
    color: #757575;
    font-size: 13px;
  }
}
.list {
  padding-top: 22px;
  padding-bottom: 22px;
  .card-header,
  .card-footer {
    padding: 22px;
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .card-header {
    .left-item {
      flex: 1;
      overflow: hidden;
      .type {
        font-size: 9px;
        font-weight: normal;
        background: #d7dff9;
        color: #3e8afb;
        display: inline-flex;
        padding: 6px 16px;
        border-radius: 6px;
        max-width: 200px;
        span {
          .ellipsis;
        }
        &.type-2 {
          background: #fdebd3;
          color: #fb7d3e;
        }
      }
    }
    .title {
      flex: 1;
      display: block;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .icon {
        width: 36px;
        height: 36px;
        margin-right: 20px;
      }
      .form-name {
        flex: 1;
        .ellipsis;
      }
    }
    /deep/.btn-wrap {
      width: auto;
      border-radius: 20px;
      border-color: @headerColor;
      background: @headerColor;
      font-size: 14px;
      padding: 6px 30px;
    }
  }
  .desc-time {
    padding: 0 22px;
    font-size: 13px;
    color: #424651;
    margin-bottom: 15px;
  }
  .card-footer {
    font-size: 14px;
    .time {
      color: #999;
      flex: 1;
    }
  }
}
.tabs-wrap {
  height: 260px;
  flex-direction: column;
}
.search-con {
  width: 100%;
  .condition {
    display: flex;
    align-items: center;
    padding: 6px;
    span {
      flex: 1;
      text-align: center;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: '';
        border-bottom: 3px#555 solid;
        border-left: 3px#555 solid;
        width: 16px;
        height: 16px;
        transform: rotate(-45deg);
        margin-left: 30px;
        margin-top: -6px;
      }
      /deep/.placeholder {
        color: #333;
      }
      &.active {
        color: @mainColor;
        /deep/.placeholder {
          color: @mainColor;
        }
        &:after {
          border-color: @mainColor;
          transform: rotate(135deg);
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
