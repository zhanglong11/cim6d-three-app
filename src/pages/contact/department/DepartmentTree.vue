<template>
  <div>
    <div v-for="(items, i) in data" :key="i">
      <h3 v-if="isGroup && items.children" v-text="items.dataName"></h3>
      <ul class="department-list">
        <li v-for="item in items.children" :key="item.id" :class="{ active: item.checked }">
          <div class="content" @click="handleClick(item)">
            <uni-avatar :user="{ name: item.dataName }" :size="80"></uni-avatar>
            <p>{{ item.dataName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepartmentTree',
  props: {
    // 显示分组名称
    isGroup: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {},
    remove() {},
    handleClick(item) {
      this.$emit('nodeClick', item)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
@import url('./department.less');
</style>
