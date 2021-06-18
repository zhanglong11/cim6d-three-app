<template>
  <div class="main">
    <uni-card>
      <uni-form-item label="任务名称">{{ form.taskName }}</uni-form-item>
      <uni-form-item label="计划开始时间">{{ form.planStartDate | ymd }}</uni-form-item>
      <uni-form-item label="计划结束时间">{{ form.planEndDate | ymd }}</uni-form-item>
      <uni-form-item label="实际开始时间">{{ form.actualStartDate | ymd }}</uni-form-item>
      <uni-form-item label="实际结束时间">{{ form.actualEndDate | ymd }}</uni-form-item>
      <uni-form-item label="任务状态">{{ getTaskStatusByValue(form.status) }}</uni-form-item>
      <uni-form-item label="验收状态">{{ getAcceptStatusByValue(form.acceptanceStatus) }}</uni-form-item>
      <uni-form-item label="任务执行人">{{ form.executePersonName }}</uni-form-item>
      <uni-form-item label="关联状态">{{ ['未关联', '已关联'][form.isBind] }}</uni-form-item>
      <uni-form-item label="变更记录">
        <a v-if="form.recordList.length" @click="$utils.toUrl('/pages/schedule/changeRecord?taskId=' + taskId)">
          查看 >
        </a>
        <span v-else>无</span>
      </uni-form-item>
      <uni-form-item label="里程碑">{{ ['否', '是'][form.milestoneFlag] }}</uni-form-item>
    </uni-card>

    <view class="btn-wrapper">
      <uni-promise-button v-if="form.status === 0" type="primary" :click="handleReceive">领取任务</uni-promise-button>

      <template v-if="$store.state.user.userId === form.executePersonId">
        <uni-promise-button v-if="!form.actualStartDate" type="primary" :click="handleStart"
          >开始任务</uni-promise-button
        >
        <uni-promise-button
          v-if="[0, 1].includes(form.status)"
          type="primary"
          :click="() => $utils.toUrl('/pages/schedule/assign?taskId=' + taskId)"
        >
          分配任务
        </uni-promise-button>
        <template v-if="form.actualStartDate">
          <uni-promise-button
            type="primary"
            :click="() => $utils.toUrl('/pages/schedule/completeTask?taskId=' + taskId)"
            >结束任务</uni-promise-button
          >
        </template>
        <uni-promise-button
          v-if="form.isDelay"
          :click="() => $utils.toUrl('/pages/schedule/delayTaskPlan?taskId=' + taskId)"
          >延期解决方案</uni-promise-button
        >
        <uni-promise-button :click="() => $utils.toUrl('/pages/schedule/delayAllLinkTask?taskId=' + taskId)"
          >延后所有关联任务</uni-promise-button
        >
        <uni-promise-button :click="() => $utils.toUrl('/pages/schedule/advanceAllLinkTask?taskId=' + taskId)"
          >提前所有关联任务</uni-promise-button
        >
        <uni-promise-button type="primary" :click="() => $utils.toUrl('/pages/schedule/assignHistory?taskId=' + taskId)"
          >查看任务分配记录</uni-promise-button
        >
      </template>
    </view>
  </div>
</template>

<script>
import { getScheduleTaskByTaskId, getScheduleTaskReceive, startScheduleTask } from './api'
import { getTaskStatusByValue } from './lib/taskStatusList'
import { getAcceptStatusByValue } from './lib/acceptStatusList'

export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      taskId: '',
      form: {
        recordList: []
      },
      isLoading: false
    }
  },
  computed: {
    isReceiver() {
      return this.form.receiver
    }
  },
  onLoad(options) {
    this.taskId = options.taskId || options.id
  },
  onShow() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      getScheduleTaskByTaskId(this.taskId).then(res => {
        this.form = res.data
      })
    },
    getTaskStatusByValue,
    getAcceptStatusByValue,
    //领取任务
    async handleReceive() {
      await getScheduleTaskReceive(this.taskId)
      this.$utils.showToast('领取成功')
      this.refresh()
    },
    //开始任务
    async handleStart() {
      await startScheduleTask(this.taskId)
      this.$utils.showToast('开始任务成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.button + .button {
  margin-top: 15px;
}
.main {
  padding: 10px 25px 25px;
}
</style>
