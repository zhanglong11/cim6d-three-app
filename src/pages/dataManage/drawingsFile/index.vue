<template>
  <view class="main is-white">
    <uni-search-bar
      v-if="showSearch"
      placeholder="输入文件名"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    />
    <UTabs :list="typeList" @change="changType" />
    <scroll-view class="scroll-roll" scroll-y>
      <DocList ref="docList" :type="type" parent-id="0" :name="keyword" />
    </scroll-view>
    <AddFolder :visible.sync="fileVisible" type="drawings" :categoryId="type" parentId="0" @refresh="docRefresh" />
  </view>
</template>

<script>
import Api from './api'
import DocList from '@/pages/dataManage/projectFile/components/docList'
import UTabs from '@/pages/dataManage/projectFile/components/tabs'
import AddFolder from '@/pages/dataManage/projectFile/components/addFolder'
import _ from 'lodash'
export default {
  name: 'index',
  // import引入的组件
  components: { DocList, UTabs, AddFolder },
  props: {},
  data() {
    // 这里存放数据
    return {
      keyword: '',
      type: 'quality',
      showSearch: false,
      typeList: [],
      activeType: 0,
      fileVisible: false
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'add') {
      let that = this
      uni.showActionSheet({
        itemList: ['上传文件', '新建文件夹'],
        success: function (res) {
          if (!res.tapIndex) {
            //新建文件
            that.$utils.toUrl(`/pages/dataManage/projectFile/uploadFile?type=${that.type}&id=0&isDrawings=1`)
            return
          }
          //新建文件夹
          that.fileVisible = true
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
    if (obj.key === 'search') {
      this.keyword = ''
      this.showSearch = !this.showSearch
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  onShow() {
    this.$refs.docList && this.$refs.docList.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getTypeList()
      this.$refs.docList && this.$refs.docList.refresh()
    },
    async getTypeList() {
      const res = await Api.getTypeList()
      this.typeList = res.data
    },
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput: _.debounce(function (e) {
      this.keyword = e.value.trim()
    }, 300),
    changType(item) {
      this.type = item.id
    },
    docRefresh() {
      this.$refs.docList.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.name-wrap {
  padding: 30px;
}
</style>
