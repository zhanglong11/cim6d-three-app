<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <view class="radio-con">
      <view
        v-for="(item, index) in typeList"
        :key="index"
        :class="['radio-item', item.value === filterForm.type ? 'active' : '']"
        @click="handleFilter(item.value)"
        >{{ item.label }}</view
      >
    </view>
    <scroll-view v-if="list.length" class="scroll-roll" scroll-y>
      <view class="main-body">
        <radio-group @change="radioChange">
          <uni-card v-for="item in list" :key="item.id">
            <view class="card-body">
              <radio :value="item.id" />
              <view class="card-info">
                <view class="text">{{
                  item.code +
                  '-' +
                  item.name +
                  '-' +
                  item.models +
                  '-' +
                  item.brand +
                  '-' +
                  item.supplier +
                  '-' +
                  (item.type === 1 ? '甲供' : '自购')
                }}</view>
              </view>
            </view>
          </uni-card>
        </radio-group>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="list.length === 0" />

    <view class="btn-wrapper">
      <view class="btn-item">
        <button class="button" @click="handleCancel">取消</button>
      </view>
      <view class="btn-item">
        <button class="button" type="primary" @click="handleEnter">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
export default {
  data() {
    return {
      filterForm: {
        keyword: '',
        type: ''
      },
      typeList: [
        { value: '', label: '全部' },
        { value: 1, label: '甲供' },
        { value: 2, label: '自购' }
      ],
      list: [],
      item: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    refresh: _.debounce(function () {
      Api.getAllMaterialList(this.filterForm).then(res => {
        // console.log(res)
        this.list = res.data.records
      })
    }, 100),
    // 初始化
    init() {
      this.list = []
      this.refresh()
    },
    // 根据材料类型过滤材料列表
    handleFilter(type) {
      this.filterForm.type = type
      this.init()
    },
    // 根据关键词搜索
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    //
    radioChange(event) {
      // console.log('选中项', event.detail.value)
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i]
        if (item.id === event.detail.value) {
          this.item = item
          break
        }
      }
    },
    // 确定
    handleEnter() {
      if (this.item === null) {
        this.$utils.showToast('请选择材料，再做该操作')
      } else {
        this.$emit('selected', this.item)
      }
    },
    // 取消
    handleCancel() {
      this.item = null
      this.$emit('selected', this.item)
    }
  }
}
</script>

<style lang="less" scoped>
.radio-con {
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 0px 20px;
  margin-bottom: 20px;
  .radio-item {
    color: #454545;
    background: rgba(223, 223, 223, 0.7);
    padding: 12px 0px;
    flex: 0 0 28%;
    text-align: center;
  }
  .active {
    color: #3558c8;
    background: #c5d2fc;
  }
}
@import '~@/styles/common.less';
@import '~@/styles/list.less';

.main {
  border-radius: 0;
  height: 100vh;
}

.card-body {
  justify-content: normal !important;
}

.card-info {
  .text {
    padding-left: 10px;
  }
}

.btn-wrapper {
  display: flex;
  .btn-item {
    flex: 0 0 50%;
  }
  .btn-item:nth-child(1) {
    padding-left: 20px;
    padding-right: 10px;
  }
  .btn-item:nth-child(2) {
    padding-left: 10px;
    padding-right: 20px;
  }
}
</style>
