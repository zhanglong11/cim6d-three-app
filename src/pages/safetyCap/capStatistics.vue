<template>
  <div class="main is-white">
    <div id="map" ref="map" class="map"></div>
    <div class="scroll-area">
      <scroll-view scroll-y class="scroll-roll" style="padding-bottom: 10px">
        <uni-card title="安全帽统计">
          <ring-chart
            v-if="capNumberOptions && capNumberOptions.series && capNumberOptions.series.length"
            :dataAs="capNumberOptions"
            :height="400"
            :colors="['#268dfe', '#ffcc69']"
          />
          <div class="common-legend">
            <span class="type type1"
              >在线 <strong>{{ onlineCapNum }}</strong></span
            >
            <span class="type type2"
              >离线<strong>{{ offlineCapNum }}</strong></span
            >
            <span class="type type3">上线率{{ onlineRate }}</span>
          </div>
        </uni-card>
        <uni-card title="近七天报警数据">
          <line-chart
            v-if="sevenDayAlarmOptions && sevenDayAlarmOptions.series && sevenDayAlarmOptions.series.length"
            :dataAs="sevenDayAlarmOptions"
            :xAxisAs="{
              xAxis: {
                itemCount: 8
              }
            }"
            :height="400"
            :colors="['#268dfe', '#ffcc69', '#f00']"
          ></line-chart>
        </uni-card>
        <uni-card title="近七天安全帽在线时长">
          <histogram-chart
            v-if="sevenDayTimeOptions && sevenDayTimeOptions.series && sevenDayTimeOptions.series.length"
            :dataAs="sevenDayTimeOptions"
            :legendAs="{
              legend: {
                show: false
              }
            }"
            :y-axis-as="{
              formatter: {
                unit: '分'
              },
              title: '分'
            }"
            :height="400"
          ></histogram-chart>
        </uni-card>
        <uni-card title="列表">
          <uni-table border stripe emptyText="暂无更多数据">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center">用户ID</uni-th>
              <uni-th align="center">姓名</uni-th>
              <uni-th align="left">设备编号</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr v-for="(item, index) of list" :key="'dl' + index">
              <uni-td>{{ item.userId }}</uni-td>
              <uni-td>{{ item.userName }}</uni-td>
              <uni-td>{{ item.deviceNum }}</uni-td>
            </uni-tr>
          </uni-table>
        </uni-card>
      </scroll-view>
    </div>
  </div>
</template>

<script>
const T = window.T
import Api from '@/pages/safetyCap/api'
import alarmType from './lib/alarmType'
import { mapGetters } from 'vuex'
import RingChart from '@/components/stan-ucharts/RingChart.vue'
import LineChart from '@/components/stan-ucharts/LineChart.vue'
import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue'
import UniTable from '@/components/table/uni-table/uni-table.vue'
import UniTr from '@/components/table/uni-tr/uni-tr.vue'
import UniTh from '@/components/table/uni-th/uni-th.vue'
import UniTd from '@/components/table/uni-td/uni-td.vue'
export default {
  components: { RingChart, LineChart, HistogramChart, UniTable, UniTh, UniTr, UniTd },
  data() {
    return {
      alarmType,
      filterForm: {
        search: '',
        page: 1,
        rows: 10,
        projectId: this.$store.state.project.projectId
      },
      id: '',
      isLoading: false,
      list: [{ name: '是是是' }, { name: '亚锡类' }],
      total: 0,
      map: null,
      marker: null,
      onlineCapNum: 0,
      offlineCapNum: 0,
      totalCapNum: 0,
      onlineRate: '0%',
      // 安全检查数据
      capNumberOptions: {
        title: {
          name: '安全帽总数',
          fontSize: 16
        },
        subtitle: {
          name: '',
          fontSize: 14
        },
        legend: {
          show: false
        },
        series: []
      },
      sevenDayAlarmOptions: {
        legend: {
          show: true
        },
        categories: [],
        series: []
      },
      sevenDayTimeOptions: {
        categories: [],
        series: []
      }
    }
  },
  computed: {
    ...mapGetters(['userId', 'projectId'])
  },
  onLoad() {},
  onShow() {},
  mounted() {
    this.initMap()
    this.init()
  },
  methods: {
    initMap() {
      if (this.map) return
      this.map = new T.Map('map', {
        projection: 'EPSG:4326'
      })
      this.map.centerAndZoom(new T.LngLat(this.lng || 116.23, this.lat || 39.55), 6)
    },
    //初始化页面参数
    init() {
      this.getCapPositions()
      this.getSevenDayAlarmInfo()
      this.getSevenDayTimeInfo()
      this.getDeviceList()
    },
    //安全帽统计
    async getCapPositions() {
      let res = await Api.getCapPositions(this.projectId)
      this.onlineCapNum = res.data.onlineNum || 0
      this.offlineCapNum = res.data.offlineNum || 0
      this.totalCapNum = res.data.total || 0
      this.onlineRate = `${this.totalCapNum ? ((res.data.onlineNum * 100) / this.totalCapNum).toFixed(2) : 0}%`
      this.capNumberOptions.subtitle.name = this.totalCapNum + '个' || 0 + '个'
      this.capNumberOptions.series = [
        { name: '在线', data: parseInt(this.onlineCapNum) },
        { name: '离线', data: parseInt(this.offlineCapNum) }
      ]
      let devicePositions = res.data.deviceInfos || []
      for (let i = 0; i < devicePositions.length; i++) {
        let point = new T.LngLat(devicePositions[i].ypoint, devicePositions[i].xpoint)
        let icon = new T.Icon({
          iconUrl: '/poi.png',
          iconSize: new T.Point(20, 20),
          iconAnchor: new T.Point(0, 0)
        })
        let marker = new T.Marker(point, {
          icon
        }) // 创建标注
        this.map.addOverLay(marker)
      }
    },
    //获取近七天报警数据
    async getSevenDayAlarmInfo() {
      let { data } = await Api.getSevenDayAlarmInfo(this.projectId)
      this.sevenDayAlarmOptions.categories = _.keys(data[_.keys(data)[0]]).map(item => item.slice(5))
      this.sevenDayAlarmOptions.series = _.keys(data).map(item => {
        return {
          name: item,
          data: _.values(data[item])
        }
      })
    },
    //获取近七天在线时长数据
    async getSevenDayTimeInfo() {
      let { data } = await Api.getSevenDayTimeInfo(this.projectId)
      this.sevenDayTimeOptions.categories = data.map(item => item.ctime.slice(5))
      this.sevenDayTimeOptions.series = [{ name: '时长(分)', color: '#73a0fa', data: data.map(item => item.ltime) }]
    },
    async getDeviceList() {
      let res = await Api.getCapsList(this.filterForm)
      this.list = res.data.records || []
    },
    showMarker(item) {
      const { xpoint, ypoint } = item
      if (this.marker) this.map.removeOverLay(this.marker)
      let lnglat = new T.LngLat(ypoint || 116.23, xpoint || 39.55)
      let icon = new T.Icon({
        iconUrl: '/poi.png',
        iconSize: new T.Point(20, 20),
        iconAnchor: new T.Point(0, 0)
      })
      this.marker = new T.Marker(lnglat, { icon })
      this.map.addOverLay(this.marker)
      this.map.centerAndZoom(lnglat, 14)
      let infoWin = new T.InfoWindow()
      let sContent = `
                <h4 class="info-title">${this.alarmType[item.sosType]}</h4>
                <p>姓名:${item.userName}</p>
                <p>设备:${item.deviceId}</p>
                <p>位置:${item.location}</p>
                <p>时间:${item.createTime}</p>`
      infoWin.setContent(sContent)
      this.marker.openInfoWindow(infoWin)
      let that = this
      this.marker.addEventListener('click', function () {
        that.marker.openInfoWindow(infoWin)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./detail.less');
.map {
  height: 600px;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.scroll-area {
  overflow: hidden;
  padding: 20px 0 20px 10px;
}
.item {
  padding: 10px 20px;
  margin-right: 20px;
  &:not(:first-child) {
    border-top: 4px #e8e8e8 solid;
  }
  .line {
    display: flex;
    .type {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
    .time {
      width: 300px;
      margin-right: 50px;
    }
    .opt-btn {
      width: 80px;
      color: #0079fe;
    }
  }
}
/deep/ .tdt-infoWindow-pane {
  .info-title {
    color: red;
    text-align: center;
  }
  p {
    margin: 10px 0;
  }
}
uni-page-body {
  height: 100%;
}
.common-legend {
  display: flex;
  padding: 10px 50px;
  justify-content: space-between;
  align-items: center;
  .type {
    height: 50px;
    line-height: 50px;
    position: relative;
    strong {
      margin-left: 5px;
    }
    &.type1 {
      strong {
        color: #268dfe;
      }
      &:before {
        content: '';
        position: absolute;
        display: block;
        left: -16px;
        top: 50%;
        transform: translateY(-15px);
        width: 4px;
        height: 30px;
        background-color: #268dfe;
      }
    }
    &.type2 {
      strong {
        color: #ffcc69;
      }
      &:before {
        content: '';
        position: absolute;
        display: block;
        left: -16px;
        top: 50%;
        transform: translateY(-15px);
        width: 4px;
        height: 30px;
        background-color: #ffcc69;
      }
    }
    &.type3 {
      strong {
        color: #79ef11;
      }
      &:before {
        content: '';
        position: absolute;
        display: block;
        left: -16px;
        top: 50%;
        transform: translateY(-15px);
        width: 4px;
        height: 30px;
        background-color: #79ef11;
      }
    }
  }
}
</style>
