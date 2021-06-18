<template>
  <view class="main is-white">
    <view class="tooltip-info">
      设置首页显示的功能菜单及排序
      <span v-if="dataList.length > 5">，最多选中{{ maxSelect }}条</span>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item v-for="item in systemDataList" :key="item.powerKey" :label="item.powerName">
            <uni-font-awesome slot="icon" :size="14" type="fas fa-star" color="#496fe5"></uni-font-awesome>
            <switch class="switch switch-disabled" :checked="item.checked" :disabled="item.disabled" />
            <!-- <uni-font-awesome slot="footer" type="fas fa-bars" color="#999"></uni-font-awesome> -->
          </uni-form-item>
          <uni-form-item v-for="item in dataList" :key="item.powerKey" :label="item.powerName">
            <switch
              class="switch"
              :checked="item.checked"
              :disabled="selectNum === maxSelect && !item.checked"
              @change="changeChedked($event, item)"
            />
            <!-- <uni-font-awesome slot="footer" type="fas fa-bars" color="#999"></uni-font-awesome> -->
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from '../api/'
export default {
  name: 'HomeSetting',
  components: {},
  data() {
    return {
      systemDataList: [],
      dataList: [],
      selectNum: 0,
      maxSelect: 12 // 最多可以选择几条
    }
  },
  computed: {},
  onShow() {},
  // 下拉刷新
  onPullDownRefresh() {},
  computed: {
    // APP应用权限
    applicationPower() {
      return this.$store.state.userPower.applicationPower
    },
    // 默认首页应用
    systemApplication() {
      return this.$store.state.userPower.systemApplication
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
    },
    // 改变选项
    changeChedked(e, item) {
      let details = e.detail.value
      if (details) {
        this.selectNum++
      } else {
        this.selectNum--
      }
      item.checked = details
      this.saveOrUpdateAppIndexConfig()
    },
    // 获取全部设置列表
    queryList() {
      let list = []
      let systemDataList = []
      this.applicationPower.map(item => {
        if (item.children) {
          let itemChildren = []
          item.children.map(e => {
            if (this.systemApplication.includes(e.powerName)) {
              systemDataList.push(
                Object.assign(e, {
                  checked: true,
                  disabled: true
                })
              )
              this.selectNum++
            } else {
              list.push(
                Object.assign(e, {
                  checked: false,
                  disabled: false
                })
              )
            }
          })
        }
      })
      this.systemDataList = systemDataList
      this.queryAppIndexConfig(list)
    },
    // 查询个人配置
    async queryAppIndexConfig(list) {
      let result = await Api.queryAppIndexConfig()
      let datas = result.data || []
      datas.map(item => {
        if (item.showFlag) {
          let index = _.findIndex(list, { powerKey: item.powerKey })
          list[index].checked = true
          this.selectNum++
        }
      })
      this.dataList = list
    },
    // 更新或新增首页配置
    async saveOrUpdateAppIndexConfig() {
      let addList = []
      this.dataList.map((item, i) => {
        addList.push({
          powerKey: item.powerKey,
          showFlag: item.checked ? 1 : 0,
          sort: i
        })
      })
      await Api.saveOrUpdateAppIndexConfig(addList)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./home-setting.less');
</style>
