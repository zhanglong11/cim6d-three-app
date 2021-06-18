<template>
  <div>
    <div class="tabs-wrap">
      <uni-tabs v-model="tabIndex">
        <template v-for="(item, i) in tabsList">
          <uni-tab-pane :key="i" :name="item.name" :label="item.label" />
        </template>
      </uni-tabs>
    </div>

    <template v-for="(item, i) in tabsList">
      <template v-if="item.name === tabIndex">
        <WorkFormItem v-for="(col, j) in item.list" :key="i + '_' + j" :itemData="col" @change="onChange" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  components: {
    // WTable
  },
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
      tabsList: [],
      tabIndex: ''
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      // console.log(333, this.data)
      this.tabsList = _.cloneDeep(this.columns)
      if (this.columns.length) {
        this.tabIndex = this.columns[0].name
      }
      this.$emit('change', this.tabsList)
    },
    onChange(e) {
      this.$emit('change', this.tabsList)
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
