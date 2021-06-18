<template>
  <view class="tab-wrap">
    <scroll-view class="tab-scroll" scroll-x :scroll-into-view="id" scroll-with-animation>
      <view class="item-wrap">
        <view
          :id="`tab_${i}`"
          class="tab-item"
          :class="{ active: activeId === item.id, fix: list.length < 5 }"
          v-for="(item, i) in list"
          :key="item.id"
          @click="changeTab(item, i)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'index',
  // import引入的组件
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    list(v) {
      if (v && v.length) {
        this.changeTab(v[0])
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      id: 'tab_0',
      activeId: null
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    changeTab(item, i) {
      this.$emit('change', item)
      this.activeId = item.id
      this.id = `tab_${i}`
    }
  }
}
</script>

<style scoped lang="less">
.tab-wrap {
  width: 100%;
  padding: 10px 10px 0 10px;
  background: #fff;
  /deep/ .tab-scroll {
    > .uni-scroll-view {
      .uni-scroll-view {
        padding-bottom: 18px;
      }
    }
  }
  .item-wrap {
    display: flex;
    .tab-item {
      position: relative;
      white-space: nowrap;
      padding: 14px;
      text-align: center;
      color: #94a2af;
      font-size: 13px;
      &.fix {
        flex: 1;
      }
      &.active {
        color: #496fe5;
        &:after {
          content: '';
          width: 40px;
          height: 1px;
          background: #496fe5;
          position: absolute;
          z-index: 1;
          bottom: 0;
          left: 50%;
          margin-left: -20px;
        }
      }
    }
  }
}
</style>
