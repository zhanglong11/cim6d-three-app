<template>
  <div class="main">
    <uni-search-bar
      placeholder="进度名称/进度文件名称"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <uni-card
      v-for="(item, index) in list"
      :key="index"
      :title="`计划开始时间:${moment(item.planStartDate).format('YYYYMMDD')}`"
    >
      <div
        v-for="task in item.baseList"
        :key="task.taskId"
        :class="{ isDelay: item.isDelay }"
        class="task"
        @click="$utils.toUrl('/pages/schedule/detail?taskId=' + task.taskId)"
      >
        <p>任务名称: {{ task.taskName }}</p>
        <p class="jcb">
          <span>领取状态：{{ task.status === 0 ? '未领取' : '已领取' }}</span>
          <span v-if="task.executePersonName">执行人: {{ task.executePersonName }}</span>
        </p>
      </div>
    </uni-card>
    <uni-drawer-custom
      ref="filter"
      class="drawer-custom"
      :width="500"
      @submit="handleDrawerFormSubmit"
      @reset="handleDrawerReset"
    >
      <uni-checkbox-button-group
        v-model="drawerForm.statusList"
        style="flex-wrap: nowrap"
        :multiple="false"
        hasAll
        :options="taskStatusList.slice(0, 2)"
      ></uni-checkbox-button-group>
      <h6 class="label">计划开始时间</h6>
      <uni-date-range :startDate.sync="drawerForm.startDate" :endDate.sync="drawerForm.endDate"></uni-date-range>
    </uni-drawer-custom>
  </div>
</template>

<script>
import { getUnfinishedTaskOwnList } from './api'
import { getTaskStatusByValue, taskStatusList } from './lib/taskStatusList'
import _ from 'lodash'

export default {
  name: 'Schedule',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      list: [],
      filterForm: {
        keyWord: '',
        statusList: ''
      },
      drawerForm: {},
      taskStatusList: taskStatusList
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  onShow() {
    this.refresh()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filter.open()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      const filterForm = _.cloneDeep(this.filterForm)
      if (filterForm.statusList === 0) {
        filterForm.statusList = [0]
      } else if (filterForm.statusList === 1) {
        filterForm.statusList = [1, 2]
      } else if (_.isEmpty(filterForm.statusList)) {
        filterForm.statusList = [0, 1, 2]
      }
      getUnfinishedTaskOwnList(filterForm).then(res => {
        this.list = res.data
      })
    },
    getTaskStatusByValue,
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.keyWord = e.value
      this.refresh()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyWord = ''
      this.refresh()
    },
    handleDrawerFormSubmit() {
      this.filterForm = _.cloneDeep(this.drawerForm)
      this.refresh()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding: 25px;
}
.uni-searchbar {
  margin: 0;
}
.task {
  font-size: 14px;
  margin: 15px 15px;
  color: #555;
  & + .task {
    margin-top: 10px;
    border-top: 1px solid #ddd;
  }
  > p {
    margin: 10px 0;
  }
}
.drawer-custom {
  /deep/ .w-picker-cnt {
    left: -250px;
    font-size: 40px;
    width: 750px !important;
  }
}
.isDelay {
  color: #e22b2b;
}
</style>
