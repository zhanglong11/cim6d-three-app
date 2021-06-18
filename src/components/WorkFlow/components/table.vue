<template>
  <div>
    <template v-for="(item, i) in tableList">
      <template v-for="(col, j) in item">
        <WorkFormItem :key="i + '_' + j" :itemData="col" />
      </template>
    </template>

    <button v-if="!disabled" class="button" type="primary" @click="add">添加</button>
  </div>
</template>

<script>
// import WTable from '@/components/wTable/wTable' // table表单
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      tableList: []
    }
  },
  //监控data中的数据变化
  watch: {
    data(val) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      if (this.data) {
        let list = []
        if (this.data.length > 0) {
          this.data.map(e => {
            let item = []
            for (let key in e) {
              let params = _.find(this.columns, { model: key })
              params.options.defaultValue = e[key]
              item.push(params)
            }
            list.push(item)
          })
        }
        this.tableList = list
      }
    },
    // 添加数据
    add() {
      let list = []
      this.columns.map(item => {
        list.push(_.cloneDeep(item))
      })
      this.tableList.push(list)
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
