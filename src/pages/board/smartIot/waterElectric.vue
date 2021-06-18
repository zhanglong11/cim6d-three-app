<template>
  <view class="main">
    <template v-if="type === '76'">
      <uni-card>
        <div class="back water">
          <div class="ring water">
            <p>
              <i class="water"></i>
              <span class="num">{{ info.currentAmount }}</span>
            </p>
            <p>当前用水量t</p>
          </div>
        </div>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/water-icon.png')" />
            <span class="label">本日用水量</span>
          </view>
          <p class="val water">
            <span class="num">{{ info.dayAmount }}</span>
            t
          </p>
        </section>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/water-icon.png')" />
            <span class="label">本月用水量</span>
          </view>
          <p class="val water">
            <span class="num">{{ info.monthAmount }}</span>
            t
          </p>
        </section>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/water-icon.png')" />
            <span class="label">本年用水量</span>
          </view>
          <p class="val water">
            <span class="num">{{ info.yearAmount }} </span>
            t
          </p>
        </section>
      </uni-card>
    </template>
    <template v-if="type === '75'">
      <uni-card>
        <div class="back electric">
          <div class="ring electric">
            <p>
              <i class="electric"></i>
              <span class="num">{{ info.currentAmount }}</span>
            </p>
            <p>当前功率KW/H</p>
          </div>
        </div>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/electric-icon.png')" />
            <span class="label">本日用电量</span>
          </view>
          <p class="val electric">
            <span class="num">{{ info.dayAmount }}</span>
            KW/H
          </p>
        </section>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/electric-icon.png')" />
            <span class="label">本月用电量</span>
          </view>
          <p class="val electric">
            <span class="num">{{ info.monthAmount }}</span>
            KW/H
          </p>
        </section>
      </uni-card>
      <uni-card>
        <section>
          <view class="content">
            <image class="img" :src="require('./images/electric-icon.png')" />
            <span class="label">本年用电量</span>
          </view>
          <p class="val electric">
            <span class="num">{{ info.yearAmount }}</span>
            KW/H
          </p>
        </section>
      </uni-card>
    </template>
  </view>
</template>

<script>
import Api from './api'
export default {
  name: 'WaterElectric',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      id: null,
      type: null,
      info: {}
    }
  },
  onLoad(options) {
    this.id = options.id
    this.type = options.type
    uni.setNavigationBarTitle({
      title: this.type === '76' ? '智能水表' : '智能电表'
    })
    this.refresh()
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getDetail()
    },
    async getDetail() {
      const res = this.type === '76' ? await Api.waterDetail(this.id) : await Api.eleDetail(this.id)
      this.info = res.data
    }
  }
}
</script>

<style scoped lang="less">
.main {
  padding: 0 20px;
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px;
    > .content {
      display: flex;
      align-items: center;
      font-size: 16px;
      .img {
        width: 35px;
        height: 35px;
        margin-top: 4px;
      }
      > .label {
        margin-left: 20px;
      }
    }
    > .val {
      font-size: 12px;
      color: #456add;
      &.water {
        color: #6fdec8;
      }
      &.electric {
        color: #ef8236;
      }
      .num {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .real {
    display: flex;
    justify-content: space-between;
    //align-items: center;
    padding: 34px;
    border-top: 1px solid #eee;
    color: #456add;
    > view {
      //flex: 1;
    }
    .line {
      width: 1px;
      background: #eee;
    }
    .label {
      width: 200px;
      font-size: 14px;
      background: #eef2ff;
      padding: 6px 20px;
      margin-bottom: 20px;
      border-radius: 20px;
      text-align: center;
    }
    .val {
      font-size: 20px;
    }
    .top {
      margin-left: 20px;
      font-size: 12px;
      color: #000;
    }
  }
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
    padding: 30px 0;
    &.water {
      background: url('./images/water-back.png') no-repeat center;
      background-size: 100% 100%;
    }
    &.electric {
      background: url('./images/electric-back.png') no-repeat center;
      background-size: 100% 100%;
    }
    .ring {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: green;
      &.water {
        background: url('./images/water-ring.png') no-repeat center;
        background-size: 100% 100%;
      }
      &.electric {
        background: url('./images/electric-ring.png') no-repeat center;
        background-size: 100% 100%;
      }
      > p {
        font-size: 12px;
        i {
          display: inline-block;
          width: 26px;
          height: 30px;
          margin-right: 10px;
          vertical-align: 4px;
          &.water {
            background: url('./images/water-i.png') no-repeat center;
            background-size: 100% 100%;
          }
          &.electric {
            background: url('./images/electric-i.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
        .num {
          font-size: 20px;
        }
        & + p {
          margin-top: 10px;
          color: #a19e9e;
        }
      }
    }
  }
}
</style>
