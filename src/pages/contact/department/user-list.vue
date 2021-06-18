<template>
  <div class="main">
    <uni-search-bar placeholder="搜索用户名" @input="handleInput"></uni-search-bar>
    <scroll-view
      class="scroll-roll"
      scroll-with-animation
      scroll-y
      :scroll-into-view="activeAlpha"
      @click.stop
      @scroll="handleScroll"
    >
      <h3 v-if="isGroup" class="group-title">部门</h3>
      <DepartmentTree v-if="isGroup" :isGroup="false" :data="companyList" @nodeClick="selectGroup"></DepartmentTree>
      <div class="group-list">
        <div v-for="group in userList" :key="group.firstLetter" class="item">
          <h3 :id="group.firstLetter">{{ group.firstLetter }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked }"
              @click="handleClick(user)"
              @touchstart="handleTouchstart"
              @longpress="() => handleLongpress(user)"
            >
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">
                  {{ user.name }}
                </p>
                <p v-if="user.roleName" class="depart">
                  {{ user.roleName }}
                </p>
              </div>
              <div class="check"></div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
    <aside class="alpha-list" @click.stop>
      <ul>
        <li v-for="e in userList" :key="e.firstLetter" @click="activeAlpha = e.firstLetter">
          {{ e.firstLetter }}
          <div class="max">{{ e.firstLetter }}</div>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script>
import userApi from '@/api/user'
import DepartmentTree from './DepartmentTree'
export default {
  name: 'DepartmentUserList',
  components: { DepartmentTree },
  data() {
    return {
      departmentId: [],
      companyList: this.$store.state.project.companyList,
      isGroup: true,
      activeAlpha: '',
      realName: '',
      userList: [],
      userListLetter: [],
      moved: false //点击之后是否移动过,解决长按之后滑动页面的bug
    }
  },
  onLoad({ id, name }) {
    this.departmentId = id
    this.$utils.setTitle(name)
  },
  mounted() {
    this.quertUserList()
  },
  methods: {
    // 选择部门
    selectGroup(e) {
      let companyList = [e]
      companyList.map(item => {
        if (item.children && item.children[0].organType === 6) {
          this.isGroup = false
        }
      })
      this.companyList = companyList
      this.departmentId = e.id
      this.quertUserList()
    },
    // 查询节点下人员列表
    async quertUserList() {
      let params = {
        id: this.departmentId,
        realName: this.realName
      }
      userApi.getOrganizationUserList(params).then(res => {
        let userList = res || []
        userList.map(item => {
          item.name = item.realName
          item.userId = item.dataUnicode
          item.roleName = _.map(item.roleList, 'name').join(' / ')
        })
        let groupList = _.groupBy(userList, 'firstLetter')

        const result = _.map(groupList, (v, k) => ({ children: v, firstLetter: k }))
        this.userList = _.sortBy(result, 'firstLetter')
      })
    },
    handleClick(user) {
      this.$utils.toUrl('/pages/contact/user/detail?id=' + user.userId)
    },
    handleInput({ value }) {
      this.realName = value
      this.quertUserList()
    },
    handleScroll({ detail }) {
      if (detail.scrollTop > 20) {
        this.moved = true
      }
    },
    handleTouchstart() {
      this.moved = false
    },
    handleLongpress(user) {
      if (!this.moved) {
        this.$emit('longpress', user)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../components/UserList.less');
</style>
