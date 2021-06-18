<template>
  <view class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="type" class="default-tabs">
        <uni-tab-pane name="real" label="实时数据" />
        <uni-tab-pane name="alarm" label="报警信息" />
      </uni-tabs>
    </div>
    <Real :id="id" :type="itemType" v-if="type === 'real'" />
    <Alarm :id="id" v-if="type === 'alarm'" />
  </view>
</template>

<script>
import Real from '@/pages/board/smartIot/components/Real'
import Alarm from '@/pages/board/smartIot/components/Alarm'
export default {
  name: 'equipmentInfo',
  // import引入的组件
  components: {
    Real,
    Alarm
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      type: 'real',
      itemType: ''
    }
  },
  onLoad(options) {
    this.id = options.id
    this.itemType = options.type
    this.refresh()
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common.less';
</style>
