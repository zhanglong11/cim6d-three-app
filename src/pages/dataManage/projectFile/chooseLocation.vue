<template>
  <view class="wrap">
    <view class="crumb">
      <span v-for="route in routeAry">{{ route }}</span>
    </view>
    <section>
      <view>
        <span class="img"></span>
        <span>单位类型</span>
      </view>
      <uni-icons type="arrowright" size="16" color="#ccc" />
    </section>
    <section>
      <view>
        <span class="img"></span>
        <span>单位类型</span>
      </view>
      <uni-icons type="arrowright" size="16" color="#ccc" />
    </section>
  </view>
</template>

<script>
export default {
  name: 'chooseLocation',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      routeAry: ['集团资料', '单位类型']
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  background: #eee;
  .crumb {
    font-size: 14px;
    padding: 30px 20px;
    > span {
      position: relative;
      color: #6d6c6c;
      & + span {
        margin-left: 40px;
      }
      &:before {
        position: absolute;
        top: 0;
        right: -30px;
        content: '>';
      }
      &:last-child {
        &:before {
          position: absolute;
          content: '';
        }
      }
    }
  }
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 20px;
    background: #fff;
    .img {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: red;
      margin-right: 20px;
    }
    & + section {
      border-top: 1px solid #eee;
    }
  }
}
</style>
