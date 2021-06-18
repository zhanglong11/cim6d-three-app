<template>
  <view class="wrap">
    <view class="form">
      <textarea class="name" v-model.trim="name" placeholder="文件夹名称" auto-height />
    </view>
    <view class="location" @click="toChoose">
      <span>所在位置</span>
      <view>
        <span>文档管理</span>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AddFile',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      name: ''
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    toChoose() {
      this.$utils.toUrl(`/pages/dataManage/projectFile/chooseLocation`)
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  background: #eee;
  .form {
    margin: 40px 0;
    background: #fff;
    padding: 30px 0;
    .name {
      padding: 0 20px;
    }
  }
  .location {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 30px 20px;
    font-size: 14px;
  }
}
</style>
