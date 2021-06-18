<template>
  <div class="main">
    <div class="tabs-wrap">
      <uni-tabs v-model="tabIndex" class="default-tabs">
        <uni-tab-pane :name="0" label="最近使用" />
        <uni-tab-pane :name="1" label="自定义表单" />
        <uni-tab-pane :name="2" label="固定表单" />
      </uni-tabs>
    </div>
    <scroll-view scroll-y class="scroll-roll">
      <div class="wrap">
        <template v-if="tabIndex === 0">
          <ul class="list">
            <li v-for="(item, j) in userFormList" :key="j" @click="toDetails(item, true)">
              <div class="user-list">
                <div v-if="item.formType === 1" class="is-approval"></div>
                <image class="list-icon" :src="item.icon" />
                <p class="name" v-text="item.name"></p>
              </div>
            </li>
          </ul>
          <!-- <uni-card> </uni-card> -->
        </template>
        <template v-if="tabIndex === 1">
          <uni-card v-for="(items, i) in customFormList" :key="i" :title="items.name">
            <ul class="list">
              <li v-for="(item, j) in items.children" :key="j" @click="toDetails(item)">
                <div v-if="item.formType === 1" class="is-approval"></div>
                <image class="list-icon" :src="item.icon" />
                <p class="name" v-text="item.name"></p>
              </li>
            </ul>
          </uni-card>
        </template>
        <template v-if="tabIndex === 2">
          <uni-card v-for="(items, i) in systemFormList" :key="i" :title="items.name">
            <ul class="list">
              <li v-for="(item, j) in items.dataList" :key="j" @click="toDetails(item)">
                <div v-if="item.formType === 1" class="is-approval"></div>
                <image class="list-icon" :src="item.icon" />
                <p class="name" v-text="item.name"></p>
              </li>
            </ul>
          </uni-card>
        </template>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      tabIndex: 0,
      userFormList: [],
      customFormList: [],
      systemFormList: []
    }
  },
  computed: {
    // APP应用权限
    applicationPower() {
      return this.$store.state.userPower.applicationPower
    },
    projectType() {
      return this.$store.state.project.projectType
    },
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'myForm') {
      this.$utils.toUrl('/pages/projectOA/formList')
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.getRecentlyUsedList()
      this.queryList()
    },
    // 获取最近使用列表
    async getRecentlyUsedList() {
      let result = await Api.getRecentlyUsedList()
      let datas = result.data || []
      this.userFormList = datas.filter(e => e.name)
    },
    // 获取分组表单列表
    async queryList() {
      let params = {
        projectType: this.projectType,
        projectId: this.projectId
      }
      let result = await Api.getGroupFormList(params)
      let datas = result.data || []
      let customFormList = _.filter(datas, function (o) {
        return o.flag === 1 && o.children && o.children.length > 0
      })
      customFormList.map(e => {
        if (e.children) {
          let list = e.children.filter(f => f.startFlag === 1 && f.status === 1)
          e.children = list
        }
      })
      this.customFormList = customFormList
      let systemList = []
      let systemFormList = _.filter(datas, { flag: 2 })
      systemFormList.map(e => {
        let list = e.children.filter(
          f => f.appRouteUrl && f.startFlag === 1 && f.status === 1 && this.$hasPower(f.powerKey)
        )
        e.dataList = list
        if (list && list.length > 0) {
          systemList.push(e)
        }
      })
      console.log(444, systemList)
      this.systemFormList = systemList
    },
    // 跳转详情
    toDetails(item, isUser) {
      if (item.flag === 1) {
        let formId = isUser ? item.formId : item.id
        this.$utils.toUrl(`/pages/projectOA/addCustomForm?id=${formId}&name=${item.name}`)
        return
      }
      this.$utils.toUrl(item.appRouteUrl)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./oa.less');
</style>
