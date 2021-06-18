<template>
  <div class="main is-white">
    <uni-search-bar
      placeholder="危险源名称/创建人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @scrolltolower="handleScrollToLower">
      <radio-group @change="radioChange">
        <div v-for="item in list" :key="item.id" class="card item">
          <div class="radio-box">
            <radio :value="item.id" :checked="item.checked" />
          </div>
          <div class="content">
            <h2>
              {{ item.dangerSource }}
            </h2>
            <p>伤害类型：{{ $getLabel(harmTypeList, item.harmCategory) }}</p>
            <p>创建人：{{ item.creatorName }}</p>
            <p>创建时间：{{ item.createTime }}</p>
          </div>
        </div>
      </radio-group>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSubmit">确定</button>
      </view>
    </scroll-view>
  </div>
</template>

<script>
import EmptyTemplate from '@/components/empty-template'
import Api from '@/pages/safety/api'
export default {
  components: { EmptyTemplate },
  props: {
    checkedValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      selectDanger: {},
      filterForm: {
        keyword: ''
      }
    }
  },
  onLoad() {
    //this.init()
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  onShow() {
    this.init()
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.init()
  },
  mounted() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getAllDangerList(data).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      this.list = [...res.data.records]
      _.forEach(this.list, item => {
        _.set(item, 'checked', this.checkedValue === item.id)
      })
    }, 100),
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.refresh()
    },
    init() {
      this.refresh(true)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    //当用户清空关键词触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.refresh()
    },
    radioChange(event) {
      //this.checkedValue = event.detail.value
      this.$emit('update:checkedValue', event.detail.value)
    },
    handleSubmit() {
      if (!this.checkedValue) {
        this.$utils.showToast('请选择一条危险源')
        return
      }
      this.selectDanger = this.list.filter(item => item.id === this.checkedValue)[0] || {}
      this.$emit('update:checkedValue', this.checkedValue)
      this.$emit('submit', this.selectDanger)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.scroll-roll {
  max-height: 90vh;
  height: auto;
}
.item {
  display: flex;
  padding: 20rpx 40rpx;
  width: 600rpx;
  margin-right: 10px;
  .radio-box {
    flex: 0 0 100rpx;
    align-self: center;
  }
  .content {
    flex: 0 0 500rpx;
    h2 {
      font-size: 14px;
      font-weight: normal;
      display: flex;
      align-items: center;
      span {
        width: 5px;
        height: 26px;
        margin-right: 10px;
        border-radius: 2.5px;
      }
      .ellipsis;
    }
    p {
      font-size: 12px;
      //margin-top: 40px;
      color: #989898;
    }
  }
}
.btn-wrapper {
  position: fixed;
  bottom: 0;
}
/deep/ .uni-scroll-view-content {
  padding-bottom: 60rpx;
}
</style>
