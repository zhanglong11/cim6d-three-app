<template>
  <div class="main green-construction">
      <UTabs :list="equipList" @change="changEquip" />
    <!-- 实时环境监测 start -->
    <uni-card class="green-cart">
      <div slot="title" class="green-cart-title">
        <image class="title-icon" :src="require(`@/static/images/greenConstruction/title1.png`)" />
        <b class="title">实时环境监测</b>
        <span class="time">数据更新时间：{{ updateTime }}</span>
      </div>
      <div class="environment-chart">
        <EchartsBar container="environmentChart" :value="currentInfo.aqi" />
      </div>
      <div class="environment-info">
        <ul>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon1.png`)" />
            </div>
            <div class="right">
              <p>PM10</p>
              <b class="number">{{ currentInfo.pm10 }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon2.png`)" />
            </div>
            <div class="right">
              <p>PM2.5</p>
              <b class="number">{{ currentInfo.pm25 }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon3.png`)" />
            </div>
            <div class="right">
              <p>风速</p>
              <b class="number">{{ currentInfo.windSpeed }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon4.png`)" />
            </div>
            <div class="right">
              <p>噪音</p>
              <b class="number">{{ currentInfo.noise }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon5.png`)" />
            </div>
            <div class="right">
              <p>温度</p>
              <b class="number">{{ currentInfo.temperature }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon6.png`)" />
            </div>
            <div class="right">
              <p>湿度</p>
              <b class="number">{{ currentInfo.humidity }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon7.png`)" />
            </div>
            <div class="right">
              <p>风向</p>
              <b class="number">{{ currentInfo.windDirection }}</b>
            </div>
          </li>
          <li>
            <div class="left">
              <image class="icon" :src="require(`@/static/images/greenConstruction/icon8.png`)" />
            </div>
            <div class="right">
              <p>风级</p>
              <b class="number">{{ currentInfo.windPower }}</b>
            </div>
          </li>
        </ul>
      </div>
    </uni-card>
    <!-- 实时环境监测 end -->

    <!-- 今日数据（次） start -->
    <uni-card class="green-cart">
      <div slot="title" class="green-cart-title">
        <image class="title-icon" :src="require(`@/static/images/greenConstruction/title2.png`)" />
        <b class="title">今日数据（次） </b>
        <span class="time">数据更新时间：{{ updateTime }}</span>
      </div>
      <div class="environment-radare">
        <EchartsRadare container="RadareEchart" :dataList="aqiData[1]" />
      </div>
    </uni-card>
    <!-- 今日数据（次） end -->

    <!-- 最近30天  start -->
    <uni-card class="green-cart">
      <div slot="title" class="green-cart-title">
        <image class="title-icon" :src="require(`@/static/images/greenConstruction/title3.png`)" />
        <b class="title">最近30天</b>
        <span class="time">数据更新时间：{{ updateTime }}</span>
      </div>
      <div class="environment-pie">
        <EchartsPie container="EchartsPie" :dataList="aqiData[2]" />
      </div>
    </uni-card>
    <!-- 最近30天  end -->

    <!-- 本周污染TOP8  start -->
    <uni-card class="green-cart">
      <div slot="title" class="green-cart-title">
        <image class="title-icon" :src="require(`@/static/images/greenConstruction/title4.png`)" />
        <b class="title">本周污染TOP8</b>
        <span class="time">数据更新时间：{{ updateTime }}</span>
      </div>
      <div class="hot-top">
        <ul>
          <li v-for="(item, i) in pollutionList" :key="i">
            <b class="index">{{ i + 1 }}</b>
            <span class="title">{{ item.name }}</span>
            <span class="number" :class="{ active: i < 3 }">{{ item.type }} {{ item.number }}</span>
            <image class="hot-icon" :src="require(`@/static/images/greenConstruction/top${i < 3 ? 1 : 2}.png`)" />
          </li>
        </ul>
      </div>
    </uni-card>
    <!-- 本周污染TOP8  end -->
  </div>
</template>

<script>
import EchartsBar from './components/EchartsBar'
import EchartsRadare from './components/EchartsRadare'
import EchartsPie from './components/EchartsPie'
import UTabs from './components/tabs'
import Api from './api'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    EchartsBar,
    EchartsRadare,
    EchartsPie,
    UTabs
  },
  data() {
    //这里存放数据
    return {
      updateTime: '',
      aqiData: {
        1: {},
        2: []
      },
      currentInfo: {
        aqi: 0,
        humidity: 0,
        noise: 0,
        nsDevNo: 0,
        pm10: 0,
        pm25: 0,
        pmDevNo: 0,
        temperature: 0,
        thDevNo: 0,
        windDirection: 0,
        windPower: 0,
        windSpeed: 0,
        wpDevNo: 0,
        ts: ''
      },
      //本周污染点数据列表
      pollutionList: [
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 }
      ],
      equipList: [],
      productKey: null
    }
  },
  created() {
    let token = this.$utils.getUrlStr('token')
    if (token) {
      this.$store.commit('setWebViewDatas', {
        projectId: this.$utils.getUrlStr('projectId'),
        token
      })
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  watch: {
    productKey(v) {
      if (v) {
        this.queryYcCurrentInfo()
        this.queryYcSelectAqiYc(1)
        // 最近30天
        this.queryYcSelectAqiYc(2)
      }
    }
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.getList()

      // 今日数据
      this.queryYcSelectAqiYc(1)
      // 最近30天
      this.queryYcSelectAqiYc(2)

      this.queryYcCurrentInfo()
    },
    //获取设备列表
    async getList() {
      const res = await Api.getList({ productTemplateIdList: [69] })
      this.equipList = res.data
    },
    //选择设备
    changEquip(item) {
      this.productKey = item.productKey
    },
    // 查询时间段内AQI数据
    async queryYcSelectAqiYc(daysType) {
      let params = {
        daysType,
        productKey: this.productKey
      }
      let result = await Api.queryYcSelectAqiYc(params)
      let datas = result.data
      if (daysType === 1) {
        this.aqiData[daysType] = datas
      }

      if (daysType === 2) {
        this.aqiData[daysType] = [
          { name: '优秀', value: parseInt(datas.fineCts) || null },
          { name: '良好', value: parseInt(datas.goodCts) || null },
          { name: '轻度', value: parseInt(datas.mildCts) || null },
          { name: '中度', value: parseInt(datas.mediumCts) || null },
          { name: '重度', value: parseInt(datas.seriousCts) || null },
          { name: '严重', value: parseInt(datas.graveCts) || null }
        ]
      }
    },
    // 大屏实时环境监测
    async queryYcCurrentInfo() {
      let result = await Api.queryYcCurrentInfo({ productKey: this.productKey })
      let datas = result.data
      if (!datas) {
        return
      }
      this.currentInfo = datas
      this.updateTime = datas.ts.substring(11, 16)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.green-construction {
  padding: 0 24rpx 24rpx;
  .green-cart {
    padding: 24px;
  }
  .green-cart-title {
    display: flex;
    align-items: center;
    width: 100%;
    .title-icon {
      margin-right: 15px;
      width: 30px;
      height: 30px;
    }
    .title {
      flex: 1;
      font-weight: normal;
    }
    .time {
      color: #999;
      font-size: 12px;
    }
  }
  .environment-chart {
    height: 400px;
  }
  .environment-radare {
    height: 620px;
  }
  .environment-pie {
    height: 560px;
  }
  .environment-info {
    margin: -20px 0 -40px;
    ul {
      &:after {
        content: '';
        clear: both;
        display: table;
      }
      li {
        float: left;
        width: 25%;
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        height: 90px;
        .icon {
          width: 40px;
          height: 40px;
        }
        .left {
          margin-right: 10px;
        }
        .right {
          font-size: 14px;
          color: #666666;
          .number {
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .hot-top {
    ul {
      li {
        display: flex;
        align-items: center;
        border-bottom: 1px #e5e5e5 solid;
        height: 100px;
        font-size: 14px;
        .index {
          font-size: 20px;
          width: 60px;
          height: 100%;
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-weight: normal;
          &:before {
            content: '';
            width: 100%;
            height: 1px;
            background: #fff;
            position: absolute;
            left: 0;
            bottom: -1px;
          }
        }
        .title {
          flex: 1;
          .ellipsis;
        }
        .number {
          margin: 0 30px;
          color: #ff9d62;
          font-weight: bold;
          &.active {
            color: #ff4747;
          }
        }
        .hot-icon {
          width: 71px;
          height: 34px;
        }
      }
    }
  }
}
</style>
