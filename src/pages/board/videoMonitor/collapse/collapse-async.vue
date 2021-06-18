<template>
  <ul class="collapse-wrap">
    <li v-for="item in list" class="section">
      <div class="title" @click="showChild(item.id)">
        <slot name="title" :info="item"></slot>
        <uni-icons color="#999999" class size="20" :type="openId.includes(item.id) ? 'arrowdown' : 'arrowup'" />
      </div>
      <ul class="list" :class="openId.includes(item.id) ? 'show' : ''">
        <li v-for="child in item.children" class="item">
          <slot name="item" :info="child"></slot>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'index',
  // import引入的组件
  components: {},
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    // 这里存放数据
    return {
      openId: []
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    showChild(id) {
      let openId = this.openId
      this.openId = openId.includes(id) ? openId.filter(o => o !== id) : [...openId, id]
    }
  }
}
</script>

<style scoped lang="less">
.collapse-wrap {
  .section {
    margin-bottom: 20px;
    box-shadow: 0 0 10px #eee;
    border-radius: 20px;
    background: #fff;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 20px;
    font-size: 16px;
    font-weight: 500;
  }
  .list {
    padding: 0 20px;
    overflow: hidden;
    //max-height: 20rem;
    //transition: all 0.8s ease-in-out;
    &.show {
      height: 0;
      //max-height: 0;
    }
    .item {
      padding: 16px 10px;
      font-size: 14px;
      color: #3d3838;
      border-bottom: 1px solid #eeeaea;
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
