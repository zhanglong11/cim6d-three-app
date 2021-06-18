<template>
  <div class="main is-white">
    <!-- <uni-search-bar placeholder="搜索部门名" @input="handleInput"></uni-search-bar> -->
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <!-- <h3>我的部门</h3>
        <ul class="department-list">
          <li
            v-for="item in computedListIncludeMe"
            :key="item.organId"
            @click="handleClick({ id: item.organId, name: item.organName })"
          >
            <div class="content">
              <uni-avatar :user="item" :size="80"></uni-avatar>
              <p>{{ item.organName }}</p>
            </div>
          </li>
        </ul> -->
        <DepartmentTree :data="computedList" @nodeClick="handleClick"></DepartmentTree>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import treeFilter from '@/utils/treeFilter'
import toFlat from '@/utils/toFlat'
import treeFind from '@/utils/treeFind'
import DepartmentTree from './DepartmentTree'
export default {
  name: 'Department',
  components: {
    DepartmentTree
  },
  props: {
    // 收藏夹id，设置此项将展示收藏夹用户
    collectionId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      q: '',
      activeAlpha: ''
    }
  },
  computed: {
    computedList() {
      let list = this.$store.state.project.departmentUserList
      if (this.q) {
        list = list.filter(e => e.name.includes(this.q))
      }
      return list
    },
    computedListIncludeMe() {
      let list = _.cloneDeep(
        this.$store.state.project.userList.filter(item => item.userId === this.$store.state.user.userId)
      )
      let newList = []
      list.map(item => {
        item.headImage = null
        item.name = item.organName || item.name
        if (!_.find(newList, { name: item.organName })) {
          // 排除重复部门
          newList.push(item)
        }
      })
      return newList
    }
  },
  methods: {
    handleClick(item) {
      this.$utils.toUrl(`/pages/contact/department/user-list?id=${item.id}&name=${item.dataName}`)
    },
    handleInput({ value }) {
      this.q = value
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./department.less');
</style>
