<template>
  <div>
    <!--    <uni-drawer ref="entityRef" class="drawer" mode="right" :width="750">-->
    <div class="header">
      <span class="close" @click="hideModal">取消</span>
      <span class="title">选择验收名称</span>
      <span class="save" @click="changeEntity">完成</span>
    </div>
    <uni-form-item label="验收名称" prop="acceptanceName">
      <textarea v-model.trim="acceptanceName" auto-height placeholder="请输入" @input="changeVal" />
    </uni-form-item>
    <!--    <uni-search-bar v-model="filterText" placeholder="搜索" @input="changeKeyWordsEntity" />-->
    <scroll-view class="scroll-roll" scroll-y>
      <div class="content">
        <uni-tree
          ref="treeEntityRef"
          :treeData="treeData"
          defaultExpandAll
          :props="treeProps"
          node-key="taskId"
          checkOnlyLeaf
          :showRadio="showRadio"
          :defaultCheckedKeys="defaultCheckedKeys"
          :filterNodeMethod="filterNodeMethod"
          @check="handleNodeClick"
        />
      </div>
    </scroll-view>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
export default {
  name: 'SelectEntity',
  props: {
    // 接收选择的构件或其他服务使用
    taskUniqueId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      showRadio: true,
      acceptanceName: '',
      keyWordsEntity: '', // 单体搜索关键词
      treeData: [], // 选择楼层树
      filterText: '',
      result: [],
      treeProps: {
        label: 'synthesisTaskName',
        children: 'children'
      },
      defaultCheckedKeys: []
    }
  },

  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.treeEntityRef.filter(val)
    }
  },
  created() {
    if (this.taskUniqueId) {
      this.defaultCheckedKeys = this.taskUniqueId.split(',')
    }
  },
  mounted() {
    this.getNewTree()
  },
  methods: {
    handleNodeClick() {
      let nodes = this.$refs['treeEntityRef'].getCheckedNodes()
      this.acceptanceName = nodes[0].synthesisTaskName
      this.result = _.map(nodes, e => {
        return {
          name: e.synthesisTaskName,
          taskUniqueId: e.taskUniqueId,
          planUnicode: e.planUnicode
        }
      })
    },
    changeVal(e) {
      if (e.detail.value) {
        this.result = [{ name: e.detail.value }]
      }
    },
    filterNodeMethod(value, data) {
      if (!value) return true
      return data.synthesisTaskName.indexOf(value) !== -1
    },
    // 获取tree树
    async getNewTree() {
      const res = await this.fly.post(`/schedule/task/list`, { projectId: this.projectId, selectFlag: 1 })
      let list = toTree(res.data.baseList, 'parentTaskUniqueId', 'planStartDate', 'taskUniqueId')
      this.treeData = list
    },

    // 确定选择
    changeEntity() {
      this.$emit('selected', this.result)
    },
    // 显示选择模态框
    showModal(key) {
      this.$refs[key].open()
    },

    // 关闭选择模态框
    hideModal() {
      this.$emit('close')
    },
    // 搜索单体
    changeKeyWordsEntity({ value }) {
      this.keyWordsEntity = value
    }
  }
}
</script>

<style scoped lang="less">
@import url('select-schedule.less');
.scroll-roll {
  height: 80vh;
}
</style>
