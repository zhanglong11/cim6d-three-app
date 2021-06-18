<template>
  <div>
    <template v-for="(item, i) in tableList">
      <template v-for="(col, j) in item.list">
        <WorkFormItem :key="i + '_' + j" :itemData="col" @change="onChange" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * data要传入的数据数组
     */
    data: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    //这里存放数据
    return {
      tableList: []
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.tableList = _.cloneDeep(this.columns)
      this.$emit('change', this.tableList)
    },
    onChange(e) {
      this.$emit('change', this.tableList)
    }
  }
}
</script>
<style lang="less" scoped>
.button {
  font-size: 14px;
  line-height: 2 !important;
  border-radius: 10px;
}
</style>
