<template>
  <view class="uni-select-process-group">
    <xfl-select
      ref="process-group-select"
      :list="processGroupList"
      placeholder="工序组"
      @change="handleChangeProcessGroup"
      @clear="handleClearProcessGroup"
    ></xfl-select>
  </view>
</template>

<script>
import Api from '@/pages/decoration/decorationSchedule/scheduleManage/api'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      processGroupList: []
    }
  },
  async created() {
    await this.getProcedureGroupList()
    if (this.value) {
      this.processGroupList.map(item => {
        if (item.id === this.value) {
          // 回显选中的列表项
          this.$refs['process-group-select'].clearInput()
          this.$refs['process-group-select'].setInput(item.procedureGroupName)
          this.$refs['process-group-select'].changeActiveIndex(item.procedureGroupName)
          this.$refs['process-group-select'].getInputBoxHeight()
        }
      })
    }
  },
  methods: {
    // 获取工序组
    async getProcedureGroupList() {
      let res = await Api.getProcedureGroupList({})
      if (res.data && res.data.records && res.data.records.length) {
        this.processGroupList = res.data.records
        this.processGroupList.map(item => {
          item.value = item.procedureGroupName
        })
      }
    },
    // 工序组变更
    handleChangeProcessGroup(e) {
      this.$emit('input', e.orignItem.id)
    },
    // 工序组清除按钮
    handleClearProcessGroup() {
      this.$refs['process-group-select'].onListHide()
      this.$refs['process-group-select'].switchMgr.isOpen = false
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="less" scoped>
.uni-select-process-group {
  margin-bottom: 20px;
  /deep/ .show-box {
    height: unset;
    font-size: 14px;
    .input {
      border: 0px;
    }
    .iconfont.clear {
      font-size: 12px;
    }
  }
}
</style>
