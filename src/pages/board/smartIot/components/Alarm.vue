<template>
  <view class="wrap">
    <view class="title">
      <span>报警内容</span>
      <span>报警时间</span>
      <span>处理状态</span>
    </view>
    <template>
      <div
        v-for="item in list"
        :key="item.id"
        class="table-th"
        :class="item.status === '1' ? 'red' : ''"
        @click="showDetail(item)"
      >
        <span>{{ item.alarmContent }}</span>
        <span>{{ item.ts }}</span>
        <span>{{ $getLabel(statusList, item.handleStatus) }}</span>
      </div>
    </template>
    <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
  </view>
</template>

<script>
import Api from '@/pages/board/smartIot/api'
export default {
  name: 'Alarm',
  // import引入的组件
  components: {},
  props: {
    id: {}
  },
  data() {
    // 这里存放数据
    return {
      list: [],
      filterForm: {
        page: 1,
        rows: 100
      },
      statusList: [
        { label: '处理中', value: '0' },
        { label: '已解决', value: '1' }
      ]
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const params = _.cloneDeep({ ...this.filterForm, devId: this.id })
      let res = await Api.alarmList(params)
      this.list = res.data.records
    },
    showDetail(item) {
      uni.showModal({
        title: '详情',
        content: item.alarmContent,
        showCancel: false,
        success: e => {
          if (e.confirm) {
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  .title {
    font-weight: 600;
    background: #eee;
    border-radius: 40px;
  }
  .title,
  .table-th {
    padding: 20px 10px;
    font-size: 12px;
    > span {
      display: inline-block;
      padding: 10px 16px;
      &:nth-child(1) {
        width: 30%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      &:nth-child(2) {
        width: 280px;
        text-align: center;
      }
      &:nth-child(3) {
        width: 25%;
        text-align: center;
      }
    }
  }
  .table-th {
    padding: 20px 10px;
    border-bottom: 1px solid #eee;
    &.red {
      color: red;
    }
    &:last-child {
      border: none;
      padding: 30px 10px 0 10px;
    }
  }
}
</style>
