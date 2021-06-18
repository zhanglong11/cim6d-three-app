<template>
  <view class="main is-white">
    <uni-search-bar bgColor="#F9F9F9" placeholder="搜索项目名" @input="handleInput"></uni-search-bar>
    <div class="arc" style="margin-top: 15px"></div>
    <view class="legend">
      <view class="item owner">主导项目</view>
      <view class="item">参与项目</view>
    </view>
    <div v-if="computedList.length > 0" class="project-list-wrap">
      <ul class="project-list">
        <li
          v-for="item in computedList"
          :key="item.id"
          :class="{ active: activeId === item.id, owner: item.projectUserCategory === 1 }"
          @click="handlerProjectClick(item)"
        >
          <span class="title">{{ item.name }}</span>
          <span class="check"></span>
        </li>
      </ul>
    </div>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
    <!-- #ifdef MP -->
    <div class="footer-btn">
      <button type="primary" @click="setSelectedProjectInfo()">确定</button>
    </div>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { projectAPI } from '@/api/project'
export default {
  data() {
    return {
      activeId: '',
      activeName: '',
      keyWords: '', //搜索关键字
      list: [] //全部项目数组
    }
  },
  computed: {
    computedList() {
      if (this.keyWords) {
        return this.list.filter(e => e.name.toLowerCase().includes(this.keyWords.toLowerCase()))
      } else {
        return this.list
      }
    },
    userId() {
      return this.$store.state.user.userId
    }
  },
  onLoad(options) {
    this.activeId = options.projectId || ''
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.text === '确定') {
      this.setSelectedProjectInfo()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.handleQueryProjectListInfo()
    },
    // 获取项目数据
    async handleQueryProjectListInfo() {
      let listinfo = await projectAPI.queryProjectListInfo()
      let list = listinfo.data || []
      this.list = list
      if (this.activeId) {
        const activeProject = _.find(this.list, { id: this.activeId })
        if (!activeProject) this.activeId = null
        this.activeName = activeProject.name
        this.activeProject = activeProject
      }
    },
    // 设置项目缓存
    setSelectedProjectInfo() {
      if (this.activeId) {
        let projectInfo = {
          id: this.activeId,
          name: this.activeName,
          type: this.activeProject.type,
          projectUserCategory: this.activeProject.projectUserCategory
        }
        uni.setStorageSync('project', this.activeProject)

        this.$store.commit('setSelectedProjectInfo', projectInfo)
        this.$store.dispatch('getUserList', this.activeId)
        this.$store.commit('getPower') // 获取用户授权
        this.$store.commit('getTaskTodo') // 获取我的待办
        this.$utils.toUrl('/pages/main/main', 1)
        // this.$utils.toUrl("/pages/process-progress/progress")
        //获取项目参数
        this.$store.dispatch('systemConfig/getArgTree')
      } else {
        this.$utils.showToast('请先选择项目')
      }
    },
    // 搜索
    handleInput({ value }) {
      this.keyWords = value
    },
    // 选择项目
    handlerProjectClick(project) {
      this.activeId = project.id
      this.activeName = project.name
      this.activeProject = project
    }
  }
}
</script>

<style lang="less" scope>
@import url('./select-project.less');
</style>
