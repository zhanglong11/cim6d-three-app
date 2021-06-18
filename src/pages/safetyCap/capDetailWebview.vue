<template>
  <div class="main is-white">
    <div id="map" ref="map" class="map"></div>
    <div class="scroll-area">
      <scroll-view v-if="total" scroll-y class="scroll-roll list" @scrolltolower="handleScrollToLower">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="line">
            <span class="type">{{ alarmType[item.sosType] }}</span
            ><span class="time">{{ item.createTime }}</span
            ><span class="opt-btn" @click="showMarker(item)">查看</span>
          </div>
        </div>
        <EmptyTemplate v-if="total === 0"></EmptyTemplate>
        <uni-more :listLength="list.length" :total="total" :loading="loading" />
      </scroll-view>
    </div>
  </div>
</template>

<script>
const T = window.T
import Api from '@/pages/safetyCap/api'
import alarmType from './lib/alarmType'
import { mapGetters } from 'vuex'
export default {
  components: {},
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
      list: [],
      total: 0,
      map: null,
      marker: null
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {},
  mounted() {
    this.initMap()
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
      this.filterForm.page = 1
      this.list = []
      this.refresh(true)
    },
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getCapDetail({ ...data, deviceNum: this.id }).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    }, 100),
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
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
</style>
