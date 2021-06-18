<template>
  <div class="main is-white">
    <uni-form-item label="选择日期" prop="reportDate" isLink>
      <uni-date-picker v-model="filterForm.date" fields="day" mode="date" @change="refresh"></uni-date-picker>
    </uni-form-item>
    <div id="map" ref="map" class="map"></div>
    <div class="opt-line">
      <span @click="start"> 开始</span>
      <span @click="pause"> 暂停</span>
      <span @click="stop"> 结束</span>
      <span @click="showTrackDetail"> 轨迹详情</span>
      <!--<input type="button" value="暂停" onClick="carTrack&&carTrack.pause();" />
      <input type="button" value="结束" onClick="carTrack&&carTrack.stop();" />-->
    </div>
    <div class="scroll-area">
      <scroll-view v-if="total" scroll-y class="scroll-roll">
        <div v-show="showDetail" class="title">位置信息</div>
        <div v-if="showDetail">
          <div v-for="item in list" :key="item.id" class="item">
            <p>位置:{{ item.createTime }}</p>
            <p>({{ item.address }})</p>
          </div>
          <EmptyTemplate v-if="total === 0"></EmptyTemplate>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
const T = window.T
import Api from '@/pages/safetyCap/api'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      filterForm: {
        date: this.moment().format('YYYY-MM-DD'),
        projectId: this.$store.state.project.projectId
      },
      id: '',
      isLoading: false,
      stackList: [],
      list: [],
      total: 0,
      map: null,
      marker: null,
      carTrack: null,
      showDetail: false
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
      this.getStackList()
    },
    async getStackList() {
      this.loading = true
      let res = await Api.getTrackDetail({
        ...this.filterForm,
        /*      startDate: this.moment(this.filterForm.date).format('YYYY-MM-DD 00:00:00'),
        endDate: this.moment(this.filterForm.date).format('YYYY-MM-DD 23:59:59'),*/
        startDate: '2021-05-01 00:00:00',
        endDate: '2021-05-31 23:59:59',
        userId: this.id,
        adminId: this.userId
      }).finally(() => {
        this.loading = false
      })
      this.stackList = res.data || []
      this.total = this.stackList.length
      let arr =
        this.stackList.map(item => {
          let lnlat = new T.LngLat(item.ypoint, item.xpoint)
          return lnlat
        }) || []
      this.map.setViewport(arr)
      let that = this
      this.carTrack = new T.CarTrack(this.map, {
        interval: 1000,
        speed: 5,
        dynamicLine: true,
        carstyle: { display: false, iconUrl: '/track-point.png', width: 18, height: 18 },
        polylinestyle: { color: '#d02c2c', weight: 1, opacity: 0.6 },
        Datas: arr,
        passOneNode: function (lnglat, index, length) {
          that.getPositionDetail(lnglat, index, length)
        }
      })
    },
    async getPositionDetail(lnglat, index, length) {
      let res = await Api.getTrackListDetail({
        xpoint: lnglat.lat,
        ypoint: lnglat.lng
      })
      let obj = {
        xpoint: lnglat.lat,
        ypoint: lnglat.lng,
        createTime: this.stackList[index].createTime,
        address: res.data.formatted_address
      }
      this.list = [...this.list, obj]
    },
    start() {
      if (!this.carTrack) return
      this.carTrack.start()
    },
    pause() {
      if (!this.carTrack) return
      this.carTrack.pause()
    },
    stop() {
      if (!this.carTrack) return
      this.carTrack.stop()
    },
    showTrackDetail() {
      this.showDetail = !this.showDetail
      if (this.showDetail) {
        this.list = []
      }
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
  /*overflow: hidden;*/
  padding: 20px 0 20px 10px;
}
.item {
  padding: 10px 20px;
  margin-right: 20px;
  &:not(:last-child) {
    border-bottom: 4px #e8e8e8 solid;
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
/deep/ .form-item {
  padding: 10px;
  background-color: #fff;
  .form-link {
    top: 0;
  }
}
.opt-line {
  display: flex;
  justify-content: space-between;
  background-color: #3b4144;
  padding: 20px 30px;
  span {
    color: #fff;
    padding: 5px 10px;
    background-color: #00aeff;
    border-radius: 4px;
    font-size: 12px;
  }
}
uni-page-body {
  height: 100%;
}
.title {
  padding: 10px 20px;
  background-color: #cbcbcb;
}
</style>
