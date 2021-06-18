<template>
  <view class="main is-white">
    <uni-search-bar
      v-if="showSearch"
      placeholder="输入文件名"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    />
    <view class="crumb">
      <view class="item" v-for="(route, i) in routeAry" :key="i">
        <span v-if="i" class="symbol"> > </span>
        <span>{{ route }}</span>
      </view>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <DocList ref="docList" :type="type" :parentId="id" :name="keyword" :sortType="sortType" />
    </scroll-view>
    <AddFolder :visible.sync="fileVisible" :categoryId="type" :parentId="id" @refresh="docRefresh" />
  </view>
</template>

<script>
import PopUp from './components/popUp'
import DocList from './components/docList'
import AddFolder from './components/addFolder'
import Api from './api'
import _ from 'lodash'
export default {
  name: 'fileList',
  // import引入的组件
  components: { PopUp, DocList, AddFolder },
  props: {},
  data() {
    // 这里存放数据
    return {
      keyword: '',
      routeAry: [],
      type: 'quality',
      showSearch: false,
      id: 0,
      fileVisible: false,
      sortType: ''
    }
  },
  onLoad(options) {
    this.type = options.type
    this.id = options.id
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'add') {
      let that = this
      uni.showActionSheet({
        itemList: ['上传文件', '新建文件夹'],
        success: function (res) {
          if (!res.tapIndex) {
            //新建文件
            that.$utils.toUrl(`/pages/dataManage/projectFile/uploadFile?type=${that.type}&id=${that.id}`)
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
    if (obj.key === 'sort') {
      this.showSortDialog()
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
      this.getParent()
    },
    async getParent() {
      const res = await Api.getParent(this.id)
      this.routeAry = res.data
    },
    toList() {
      this.$utils.toUrl(`/pages/dataManage/projectFile/fileList`)
    },
    handleSearchBarConfirm(e) {
      this.keyword = e.value.trim()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput: _.debounce(function (e) {
      this.keyword = e.value.trim()
    }, 300),
    showMore(item) {
      this.moreVisible = true
      this.activeItemInfo = item
    },
    showSortDialog() {
      uni.showActionSheet({
        itemList: ['创建时间', '文件名称'],
        success: res => {
          if (res.tapIndex === 0) {
            this.sortType = 'createTime'
          } else {
            this.sortType = 'name'
          }
        },
        fail: res => {
          this.sortType = null
          console.log(res.errMsg)
        }
      })
    },
    docRefresh() {
      this.$refs.docList.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.crumb {
  font-size: 14px;
  padding: 30px 20px;
  background: #eee;
  .item {
    display: inline-block;
    margin-right: 10px;
    color: #ccc;
    .symbol {
      margin: 10px;
    }
  }
}
</style>
