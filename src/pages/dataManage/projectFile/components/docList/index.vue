<template>
  <view class="wrap">
    <section v-for="item in list" :key="item.id" @click="toList(item)">
      <view class="item">
        <template v-if="!item.documentFlag">
          <view class="img isFolder" />
        </template>
        <template v-else>
          <view class="img png" v-if="imgReg.test(item.fileNameSuffix)" />
          <view class="img pdf" v-else-if="item.fileNameSuffix === 'pdf'" />
          <view class="img xls" v-else-if="xlsReg.test(item.fileNameSuffix)" />
          <view class="img doc" v-else-if="docReg.test(item.fileNameSuffix)" />
          <view class="img dwg" v-else-if="item.fileNameSuffix === 'dwg'" />
          <view class="img other" v-else />
        </template>
        <view class="item-info">
          <span class="name">{{ item.name }}</span>
          <p v-if="item.documentFlag" class="desc">
            <span>{{ item.creatorName }}</span>
            <span class="time">{{ item.createTime }}</span>
          </p>
        </view>
      </view>
      <uni-icons color="#999999" size="24" type="more-filled" @click.native.stop="showMore(item)" />
    </section>
    <PopUp :visible.sync="moreVisible" :activeInfo="activeItemInfo" @refresh="refresh" />
    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import PopUp from '../popUp'
import Api from '../../api'
export default {
  name: 'index',
  // import引入的组件
  components: {
    PopUp
  },
  props: {
    type: {},
    parentId: {},
    name: {},
    sortType: {}
  },
  data() {
    // 这里存放数据
    return {
      moreVisible: false,
      list: [],
      cloneData: [],
      activeItemInfo: {},
      total: 0,
      imgReg: /^(jpg|png|jpeg|gif|webp|bmp)$/i,
      videoReg: /^(mp4|mkv|ogg|webm)$/i,
      docReg: /^(doc|docx)$/i,
      xlsReg: /^(xls|xlsx)$/i,
      zipReg: /^(rar|zip|7z)$/i
    }
  },
  watch: {
    type: {
      handler: function () {
        this.refresh()
      },
      immediate: true
    },
    name() {
      this.refresh()
    },
    sortType() {
      this.sortData()
    }
  },
  // 生命周期 - 挂载完成
  onShow() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getList()
    },
    async getList() {
      const res = await Api.getList({ categoryId: this.type, parentId: this.parentId, name: this.name })
      this.cloneData = res.data
      this.list = [...this.cloneData]
      this.total = res.data.length || 0
    },
    showMore(item) {
      this.moreVisible = true
      this.activeItemInfo = item
    },
    toList(item) {
      if (item.documentFlag) {
        this.$utils.toUrl(`/pages/dataManage/projectFile/file-detail?id=${item.id}`)
        return
      }
      this.$utils.toUrl(`/pages/dataManage/projectFile/fileList?type=${this.type}&id=${item.id}`)
    },
    sortData() {
      if (!this.sortType) {
        this.list = this.cloneData
        return
      }
      let sortArr = _.sortBy(this.cloneData, [this.sortType])
      this.list = [...sortArr]
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  background: #fff;
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-top: 1px solid #eaeaea;
    .item {
      display: flex;
      flex: 1;
      align-items: center;
      font-size: 16px;
      overflow: hidden;
      .name {
        display: inline-block;
        width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .img {
        min-width: 80px;
        height: 80px;
        margin-right: 30px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        &.png {
          background-image: url('../../assets/png.png');
        }
        &.doc {
          background-image: url('../../assets/doc.png');
        }
        &.xls {
          background-image: url('../../assets/xls.png');
        }
        &.txt {
          background-image: url('../../assets/txt.png');
        }
        &.pdf {
          background-image: url('../../assets/pdf.png');
        }
        &.jpg {
          background-image: url('../../assets/jpg.png');
        }
        &.gif {
          background-image: url('../../assets/gif.png');
        }
        &.dwg {
          background-image: url('../../assets/dwg.png');
        }
        &.other {
          background-image: url('../../assets/other.png');
        }
        &.isFolder {
          background-image: url('../../assets/folder.png');
        }
      }
      .item-info {
        width: 100%;
        margin-right: 20px;
        .desc {
          margin-top: 10px;
          font-size: 12px;
          color: #cfcccc;
          .time {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
