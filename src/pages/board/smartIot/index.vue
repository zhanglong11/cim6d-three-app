<template>
  <view class="main">
    <view class="search-bar">
      <uni-select class="search" v-model="filterForm.productId" :options="equipmentTypeList" @change="changeType" />
    </view>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="toDetail(item)">
            <view class="card-body">
              <view class="back">
                <image class="img" :src="require(`../images/icon${item.productTemplateId}.png`)" />
              </view>
              <view class="content">
                <p class="title">{{ item.name }}</p>
                <p class="desc">
                  <image v-if="item.normal === 0" class="img" :src="require('../images/online-err.png')"></image>
                  <image v-if="item.normal === 1" class="img" :src="require('../images/online-normal.png')"></image>
                  <image v-if="item.normal === 2" class="img" :src="require('../images/online-off.png')"></image>
                  <span class="status">{{ $getLabel(statusList, item.normal) }}</span>
                </p>
              </view>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <EmptyTemplate v-if="total === 0" />
  </view>
</template>

<script>
import Api from './api'
import { cloneDeep } from 'lodash'
export default {
  name: 'index',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {
        productId: '',
        page: 1,
        rows: 100
      },
      statusList: [
        { label: '报警', value: 0 },
        { label: '正常', value: 1 },
        { label: '离线', value: 2 }
      ],
      loading: false,
      list: [],
      total: 1,
      equipmentTypeList: [],
      productTemplateIdList: [66, 67, 75, 76]
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getProductList()
      this.getList()
    },
    //获取设备类型
    async getProductList() {
      let res = await Api.getProductList({
        productTemplateIdList: this.productTemplateIdList
      })
      let cloneData = cloneDeep(res.data)
      let iniAry = cloneData.map(a => {
        let o = {}
        o.label = a.name
        o.value = a.id
        return o
      })
      this.equipmentTypeList = [{ label: '全部智能设备', value: '' }, ...iniAry]
    },
    //获取设备
    async getList(productId) {
      let params = {
        ...this.filterForm,
        productTemplateIdList: this.productTemplateIdList,
        productId
      }
      let res = await Api.list(params)
      this.list = res.data.records
      this.total = res.data.total
    },
    //切换类型
    changeType(type) {
      this.getList(type)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    toDetail(item) {
      if (item.productTemplateId === '66' || item.productTemplateId === '67') {
        this.$utils.toUrl(`/pages/board/smartIot/equipmentInfo?id=${item.id}&type=${item.productTemplateId}`)
        return
      }
      this.$utils.toUrl(`/pages/board/smartIot/waterElectric?id=${item.id}&type=${item.productTemplateId}`)
    }
  }
}
</script>

<style scoped lang="less">
.main {
  padding-top: 0;
}
.search-bar {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  .search {
  }
}
.card-body {
  padding: 20px;
  display: inline-flex;
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    border-radius: 40px;
    background: #edf5ff;
    > .img {
      width: 70%;
      height: 70%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 14px 0 14px 40px;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .desc {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      .img {
        width: 30px;
        height: 30px;
        margin-right: 30px;
      }
    }
  }
}
</style>
