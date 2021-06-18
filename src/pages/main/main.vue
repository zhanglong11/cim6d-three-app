<template>
  <view class="content main">
    <div class="bg">
      <div class="blue">
        <div class="projectWrap">
          <div
            v-if="token"
            class="select-project"
            @click="$utils.toUrl(`/pages/select-project/select-project?projectId=${projectId}`)"
          >
            <i></i>
            <b>{{ projectName }}</b>
          </div>
          <div v-else style="flex: 1; overflow: hidden"></div>
          <div class="new-message" @click="$utils.toUrl('/pages/message/index?readStatus=0')">
            <image src="@/static/images/main/new-message.png" class="img" />
            <span v-if="unread" class="unread">{{ unread > 99 ? '99+' : unread }}</span>
          </div>
        </div>
      </div>
      <div class="gray"></div>
    </div>
    <div class="weather-con">
      <!-- 施工天气模块 start -->
      <div v-if="projectType === 'construction3.0'" class="weather card">
        <image src="@/static/images/main/weather.png" alt="" />
        <div>
          <header>
            <div class="value">{{ weatherInfo.temperature | formatStr }}°C</div>
            <div class="date">{{ weatherInfo.temperatureTime | formatData }}</div>
          </header>
          <footer>
            <div class="info">
              {{ weatherInfo.weather | formatStr }} {{ weatherInfo.windDirection | formatStr }}
              {{ weatherInfo.windPower | formatStr }}
            </div>
            <div class="location">
              <uni-icons type="location-filled" size="16" color="#999"></uni-icons>{{ weatherInfo.city | formatStr }}
            </div>
          </footer>
        </div>
      </div>
      <!-- 施工天气模块 end -->
      <!-- 全景图模块  start   -->
      <view v-if="projectImgUrl" class="photo">
        <image :src="projectImgUrl" @click="$utils.toUrl(`/pages/main/photoBallWrap?fileUrl=${projectImgUrl}`)" />
      </view>

      <!-- 全景图模块  end -->
      <!-- 精装修进度统计 start -->
      <div v-if="projectType === 'decoration'" class="weather card">
        <div class="project-progress">
          <div class="progress-line">
            <span class="finish" :style="`width: ${scheduleTotal.completedNum}%`"></span>
            <span class="have-in" :style="`width: ${scheduleTotal.completedNum + scheduleTotal.inProgressNum}%`"></span>
            <span class="no-started"></span>
          </div>
          <div class="progress-title">
            <p class="finish">
              <b>{{ scheduleTotal.completedNum | formatMoney(1) }}%</b>
              <span>已完成</span>
            </p>
            <p class="have-in">
              <b>{{ scheduleTotal.inProgressNum | formatMoney(1) }}%</b>
              <span>装修中</span>
            </p>
            <p class="no-started">
              <b>{{ scheduleTotal.notStartedNum | formatMoney(1) }}%</b>
              <span>未开始</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 精装修进度统计 end -->
    </div>
    <scroll-view>
      <div class="main-body">
        <ul class="module-list card">
          <template v-if="!token">
            <!-- 未登录状态 默认菜单 start -->
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application-power/AppMeeting.png" />
              <p>会议管理</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application-power/AppTask.png" />
              <p>任务管理</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application-power/AppSafetyPlan.png" />
              <p>安全管理</p>
            </li>
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application-power/AppMessage.png" />
              <p>消息管理</p>
            </li>
          </template>
          <!-- 未登录状态 默认菜单 end -->
          <template v-else>
            <!-- 系统默认菜单 start -->
            <li v-for="item in systemMenuList" :key="item.powerKey" @click="$utils.toUrl(item.url)">
              <image class="list-icon" :src="require(`@/static/images/application-power/${item.powerKey}.png`)" />
              <p v-text="item.powerName"></p>
            </li>
            <!-- 系统默认菜单 end -->
            <!-- 自定义菜单 start -->
            <li v-for="item in menuList" :key="item.powerKey" @click="$utils.toUrl(item.url)">
              <image class="list-icon" :src="require(`@/static/images/application-power/${item.powerKey}.png`)" />
              <p v-text="item.powerName"></p>
            </li>
            <!-- 自定义菜单 end -->
          </template>
        </ul>
        <!-- 我的工作 start -->
        <template v-if="$hasPower('CenterHome') || $hasPower('DecorationCenter')">
          <uni-title title="我的工作">
            <div slot="extra" class="extra" @click="handleWorkSearch()">
              <image src="@/static/images/filter.png" class="read" />
            </div>
          </uni-title>

          <ul v-if="workList.length > 0" class="log-list my-work">
            <li
              v-for="(e, i) in workList"
              :key="i"
              class="card"
              :class="{ unread: e.readFlag === 2 }"
              @click="handleWorkClick(e)"
            >
              <p class="title">
                <span :class="`work-item-type work-type-${e.type}`">
                  {{ workType.filter(info => info.value === e.type)[0].label }}
                </span>
                <span>{{ e.title }}</span>
              </p>
              <p>
                <span v-if="e.type === 1 || e.type === 2" class="time"
                  >{{ e.startTime | ymd }} ~ {{ e.endTime | ymd }}</span
                >
                <span v-else class="time">{{ e.startTime }}</span>
              </p>
            </li>
          </ul>
          <!-- 无数据空载页 start -->
          <EmptyTemplate v-if="workList.length === 0" :noAbsolute="false" />
          <!-- 无数据空载页 end -->
        </template>
        <!-- 我的工作 end -->
        <!-- 消息通知 start -->
        <template v-else>
          <uni-title title="消息通知"></uni-title>

          <ul v-if="messageList.length > 0" class="log-list">
            <li
              v-for="(e, i) in messageList"
              :key="i"
              class="card"
              :class="{ unread: e.readStatus === 0 }"
              @click="toDetailsMessage(e)"
            >
              <p class="title">
                <span>{{ e.title }}</span>
              </p>
              <p>
                <span class="time">{{ e.sendTime }}</span>
              </p>
            </li>
          </ul>
          <!-- 无数据空载页 start -->
          <EmptyTemplate v-if="messageList.length === 0" :noAbsolute="false" />
          <!-- 无数据空载页 end -->
        </template>
        <!-- 消息通知 end -->
      </div>
    </scroll-view>
  </view>
</template>

<script>
import workType from './lib/workType'
import userApi from '../user/api/'
import { mainApi } from './api'
import { get, find } from 'lodash'
export default {
  components: {},
  data() {
    return {
      date: this.$utils.getDateStr(0, 'date'),
      unread: 0, // 未读消息
      workList: [],
      workCount: {},
      scheduleTotal: {
        completedNum: 0,
        inProgressNum: 0,
        notStartedNum: 0
      },
      workType,
      drawerForm: {
        workType: 0
      },
      messageList: [],
      systemMenuList: [], // 系统默认菜单
      menuList: [], // 自定义菜单
      projectImgUrl: null
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    projectName() {
      return this.$store.state.project.projectName
    },
    projectType() {
      return this.$store.state.project.projectType
    },
    project() {
      return uni.getStorageSync('project')
    },
    token() {
      return this.$store.state.user.token
    },
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    },
    userId() {
      return this.$store.state.user.userId
    },
    // APP应用权限
    applicationPower() {
      return this.$store.state.userPower.applicationPower
    },
    // 默认首页应用
    systemApplication() {
      return this.$store.state.userPower.systemApplication
    }
  },
  onLoad() {},
  onShow() {
    this.init()
    this.getProjectDetail()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (!uni.getStorageSync('guide')) {
        this.$utils.toUrl('/pages/guide/index', 1)
        uni.setStorageSync('guide', 1)
        return
      }
      // 监测热更新 IOS需要注释掉，否则审核不通过
      // #ifdef APP-PLUS
      this.checkUpdate()
      // #endif
      // #ifdef H5
      let routePath = this.$route.path
      // #endif
      if (this.$store.state.user.token && this.$store.state.project.projectId) {
        // 获取用户授权
        this.$store.commit('getPower', () => {
          this.getWeather()
          this.getUnreadMessage()
          if (this.projectType === 'decoration') {
            this.getScheduleOverallSchedule()
          }
          if (this.$hasPower('CenterHome') || this.$hasPower('DecorationCenter')) {
            this.getMyWork(0)
          } else {
            this.queryMessageRecord()
          }

          this.queryAppIndexConfig()
        })
      } else {
        this.$store.commit('user/logOut')
      }
    },

    //获取项目详情
    async getProjectDetail() {
      const res = await mainApi.getProjectDetail(this.projectId)
      this.projectImgUrl = get(find(res.data.imageList, { imageType: 2 }), 'fileUrl')
    },
    // 进度看板--整体进度
    async getScheduleOverallSchedule() {
      let result = await mainApi.getScheduleOverallSchedule()
      let datas = result.data
      let completedNum = datas.advanceNum + datas.onTimeNum + datas.timeoutNum // 已完工
      let inProgressNum = datas.inProgressNum || 0 // 装修中
      let notStartedNum = datas.notStartedNum || 0 // 未开始
      let roomTotalNum = datas.roomTotalNum || 0 // 总数
      this.scheduleTotal.completedNum = (completedNum / roomTotalNum) * 100
      this.scheduleTotal.inProgressNum = (inProgressNum / roomTotalNum) * 100
      this.scheduleTotal.notStartedNum = (notStartedNum / roomTotalNum) * 100
      console.log(444, notStartedNum)
    },
    // 检查APP是否有更新
    async checkUpdate() {
      let self = this
      let appTypeCode = plus.runtime.appid
      let result = await this.axios.admin.post('/app/appCheckUpdate', {
        appTypeCode
      })
      let datas = result.data
      if (!datas) {
        // 无可用版本
        return
      }
      // 获取本地应用资源版本号
      plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        let wgtVer = ''
        wgtVer = inf.version
        if (wgtVer !== datas.versionCode) {
          uni.showModal({
            title: '温馨提示',
            content: '检测到新版本，是否更新？',
            success: e => {
              if (e.cancel) {
                return
              }
              self.hotDown(datas.fileUrl)
            }
          })
        }
      })
    },
    // 热更新APP
    hotDown(wgtUrl) {
      if (!wgtUrl) {
        return
      }
      const installWgt = path => {
        plus.nativeUI.showWaiting('自动更新中...')
        plus.runtime.install(
          path,
          {},
          function () {
            plus.nativeUI.closeWaiting()
            // console.log('安装wgt文件成功！')
            plus.nativeUI.alert('应用资源更新完成！', function () {
              plus.runtime.restart()
            })
          },
          function (e) {
            plus.nativeUI.closeWaiting()
            // console.log('安装wgt文件失败[' + e.code + ']：' + e.message)
            plus.nativeUI.alert('安装wgt文件失败[' + e.code + ']：' + e.message)
          }
        )
      }
      plus.nativeUI.showWaiting('下载wgt文件...')
      plus.downloader
        .createDownload(wgtUrl, { filename: '_doc/update/' }, function (d, status) {
          if (status === 200) {
            // console.log('下载wgt成功：' + d.filename)
            installWgt(d.filename) // 安装wgt包
          } else {
            // '下载wgt失败！'
            plus.nativeUI.alert('下载wgt失败！')
          }
          plus.nativeUI.closeWaiting()
        })
        .start()
    },
    // 查询未读数量
    async getUnreadMessage() {
      let result = await userApi.getUnreadMessage()
      let datas = result.data || 0
      this.unread = datas
    },
    // 查询系统菜单和自定义菜单
    async queryAppIndexConfig() {
      let systemMenuList = []
      let list = []
      this.applicationPower.map(item => {
        if (item.children) {
          let itemChildren = []
          item.children.map(e => {
            if (this.systemApplication.includes(e.powerName)) {
              systemMenuList.push(e)
            } else {
              list.push(e)
            }
          })
        }
      })
      this.systemMenuList = systemMenuList
      let result = await userApi.queryAppIndexConfig()
      let datas = result.data || []
      let menuList = []
      datas.map(item => {
        if (item.showFlag) {
          let obj = _.find(list, { powerKey: item.powerKey })
          menuList.push(obj)
        }
      })
      this.menuList = menuList
    },
    // 获取天气
    getWeather() {
      if (!this.token) {
        return
      }
      this.fly.system.post('weather/info', { lng: this.project.longitude, lat: this.project.latitude }).then(res => {
        let datas = res.data || {}
        this.$store.commit('setWeatherInfo', datas)
      })
    },
    // 获取我的工作
    async getMyWork(type) {
      let params = {
        projectId: this.projectId,
        type
      }
      this.drawerForm.workType = type
      let result = ''
      if (this.projectType === 'construction3.0') {
        result = await mainApi.queryConstructionWork(params)
      }
      if (this.projectType === 'decoration') {
        result = await mainApi.queryDecorationWork(params)
      }
      let datas = result.data
      this.workList = datas.detailDTOList || []
      this.workCount = datas.workCount || {}
    },
    // 发给我的消息
    async queryMessageRecord() {
      let params = {
        page: 1,
        rows: 100,
        readStatus: 0
      }
      let result = await userApi.queryMessageRecord(params)
      let datas = result.data
      let list = datas.records || []
      this.messageList = list
    },
    // 按类型搜索我的工作
    handleWorkSearch() {
      let itemList = [`全部(${this.workCount[0]})`]
      if (this.projectType === 'construction3.0') {
        itemList.push(`进度(${this.workCount[1]})`)
      }
      itemList.push(`我的会议(${this.workCount[2]})`)
      itemList.push(`我的任务(${this.workCount[3]})`)
      itemList.push(`待我审核(${this.workCount[4]})`)
      itemList.push(`我发起的(${this.workCount[5]})`)
      uni.showActionSheet({
        itemList,
        success: res => {
          let tapIndex = this.projectType === 'construction3.0' ? res.tapIndex : res.tapIndex + 1
          console.log(333, tapIndex)
          this.getMyWork(tapIndex)
        },
        fail: res => {}
      })
      // this.$refs.filterRef.open()
    },
    // 点击我的工作
    handleWorkClick(item) {
      // 根据appUrl控制界面详情跳转
      if (item.appUrl) {
        this.$utils.toUrl(`${item.appUrl}?id=${item.targetId}`)
      } else {
        this.$utils.showToast('APP无详情页，请到PC端查看!')
        return
      }
    },
    // 消息详情
    toDetailsMessage(item) {
      // 根据appUrl控制界面详情跳转
      if (item.type) {
        this.$utils.toUrl(`/pages/message/detail?id=${item.dataId}&type=receive`)
        return
      }
      if (item.appUrl) {
        this.messageBatchRead(item.id)
        this.$utils.toUrl(`${item.appUrl}?id=${item.dataId}`)
      } else {
        this.$utils.showToast('APP无详情页，请到PC端查看!')
        return
      }
    },
    // 批量已读
    async messageBatchRead(id) {
      if (!id) {
        return
      }
      await userApi.messageBatchRead([id])
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./main.less');
</style>
