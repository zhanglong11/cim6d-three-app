<template>
  <div class="main">
    <ul class="record-list">
      <li v-for="record in form.recordList" :key="record.createTime">
        <uni-card :title="['延期解决方案', '延后所有关联任务', '提前所有关联任务'][record.type]">
          <uni-form-item label="发布时间">
            <span>{{ record.createTime }}</span>
          </uni-form-item>

          <uni-form-item v-if="record.type === 0" label="详细内容">
            <span>{{ record.changeReason || record.program }}</span>
          </uni-form-item>
          <uni-form-item v-if="record.type === 1" label="延长时长">
            <span>{{ record.changeDays }} 天</span>
          </uni-form-item>
          <uni-form-item v-if="record.type === 1" label="延后原因">
            <span>{{ record.changeReason }}</span>
          </uni-form-item>
          <uni-form-item v-if="record.type === 2" label="提前时长">
            <span>{{ record.changeDays }} 天</span>
          </uni-form-item>
          <uni-form-item v-if="record.type === 2" label="提前原因">
            <span>{{ record.changeReason }}</span>
          </uni-form-item>
        </uni-card>
      </li>
    </ul>
  </div>
</template>

<script>
import { getScheduleTaskByTaskId } from '@/pages/schedule/api'

export default {
  name: 'ChangeRecord',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        recordList: []
      },
      taskId: ''
    }
  },
  onLoad({ taskId }) {
    this.taskId = taskId
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
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
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
.main {
  padding: 10px 25px 25px;
}
</style>
