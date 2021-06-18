<template>
  <view class="main is-white">
    <uni-search-bar
      placeholder="需验收工序名称/负责班组/验收人"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll" @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card
            v-for="item in list"
            :key="item.id"
            :className="item.status === 3 ? ' no-pass-item' : ''"
            @click.native="toDetail(item)"
          >
            <view class="card-body">
              <view class="card-info">
                <view class="header">
                  <view class="room-name ellipsis">{{ item.roomDetail }}</view>
                  <view class="process-status">
                    <view v-if="item.status === 1" style="color: red">未验收</view>
                    <view v-if="item.status === 2">验收通过</view>
                    <view v-if="item.status === 3">验收不通过,整改中</view>
                  </view>
                </view>
                <view>需要验收工序名称：{{ item.procedureName }}</view>
                <view>工序完成时间：{{ item.completionTime }}</view>
                <view>工序负责班组：{{ item.labourGroup }}</view>
                <view class="operation">
                  <view>
                    <view v-if="item.status !== 1">{{ item.acceptancePersonName + ' ' + item.acceptanceTime }}</view>
                  </view>
                  <view>
                    <a
                      v-if="item.status !== 2 && $hasPower('AppAcceptResultEntering')"
                      @click.stop="handleEntering(item)"
                      >录入验收结果</a
                    >
                  </view>
                </view>
              </view>
            </view>
          </uni-card>
        </block>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" isConfirm @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <h6 class="label">房间号</h6>
      <uni-select-floor v-model="drawerForm.roomInfo" />
      <h6 class="label">验收状态</h6>
      <uni-checkbox-button-group v-model="drawerForm.status" :options="acceptList" hasAll />
      <h6 class="label">工序完成时间</h6>
      <view class="time-view">
        <view class="time-start">
          <uni-date-picker
            v-model="drawerForm.startTime"
            placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
        <view class="time-interval">
          <span> ~ </span>
        </view>
        <view class="time-end">
          <uni-date-picker
            v-model="drawerForm.endTime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            fields="second"
            mode="date"
          ></uni-date-picker>
        </view>
      </view>
    </uni-drawer-custom>

    <!--录入验收结果模态框组件--开始-->
    <uni-drawer ref="acceptInput" :width="750" mode="right">
      <accept-input :id="id" @closeAcceptInput="closeAcceptInput" />
    </uni-drawer>
    <!--录入验收结果模态框组件--结束-->
  </view>
</template>

<script>
import Api from './api'
import utils from '@/utils/utils'
import moment from 'moment'
import AcceptInput from './acceptInput'
export default {
  components: { AcceptInput },
  data() {
    return {
      filterForm: {
        keyword: '',
        roomInfo: ['', '', '', ''],
        buildingId: '',
        unitsId: '',
        floorId: '',
        roomId: '',
        startTime: '',
        endTime: '',
        status: undefined,
        page: 1,
        rows: 10
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: [],
      acceptList: [
        { value: 1, label: '未验收' },
        { value: 2, label: '验收通过' },
        { value: 3, label: '验收不通过,整改中' }
      ],
      id: '' // 工序验收记录id
    }
  },
  onShow() {
    this.init()
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  // 标题栏点击
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    // 刷新
    async refresh() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getAcceptanceList(data).finally(() => {
        this.loading = false
      })
      this.total = res.data.total
      if (this.id) {
        // 录入验收结果操作成功后，只更新当前页数据
        for (let i = 0; i < res.data.records.length; i++) {
          for (let j = 0; j < this.list.length; j++) {
            let oldItem = this.list[j]
            let newItem = res.data.records[i]
            if (oldItem.id === newItem.id) {
              this.list.splice(j, 1, _.cloneDeep(newItem))
            }
          }
        }
        this.id = ''
      } else {
        this.list = [...this.list, ...res.data.records]
      }
      this.list.map(item => {
        item.labourGroup = item.labourGroupNameList.join(',')
        item.roomDetail = item.buildingName + '-' + item.unitName + '-' + item.floorName + '-' + item.roomName
      })
    },
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    // 加载更多--无数据时scrollView不存在，滚动底部时，不会触发请求
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    // 根据关键词筛选列表
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    // 筛选查询
    handleDrawerFormChange() {
      if (this.drawerForm.startTime || this.drawerForm.endTime) {
        if (!this.drawerForm.startTime) {
          utils.showToast('请选择工序完成-开始时间')
          return
        } else if (!this.drawerForm.endTime) {
          utils.showToast('请选择工序完成-结束时间')
          return
        } else if (moment(this.drawerForm.endTime).isBefore(this.drawerForm.startTime)) {
          utils.showToast('开始时间不能大于结束时间')
          return
        } else if (this.drawerForm.endTime === this.drawerForm.startTime) {
          utils.showToast('开始时间不能等于结束时间')
          return
        }
      }
      this.$refs.filterRef.close()
      this.drawerForm.buildingId = this.drawerForm.roomInfo[0]
      this.drawerForm.unitsId = this.drawerForm.roomInfo[1]
      this.drawerForm.floorId = this.drawerForm.roomInfo[2]
      this.drawerForm.roomId = this.drawerForm.roomInfo[3]
      this.filterForm = this.drawerForm
      this.init()
    },
    // 重置筛选条件
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    // 打开-录入验收结果模态框
    handleEntering(item) {
      this.id = item.id
      this.$refs.acceptInput.open()
    },
    // 关闭-录入验收结果模态框
    closeAcceptInput(isRefresh) {
      if (isRefresh) {
        this.refresh()
      }
      this.$refs.acceptInput.close()
    },
    // 查看详情
    toDetail(item) {
      if (item.status !== 1 && this.$hasPower('AppAcceptDetail')) {
        // 验收通过、验收不通过(整改中)，可查看详情
        this.$utils.toUrl(`/pages/decoration/decorationSchedule/processAccept/acceptDetail?id=${item.id}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/list.less';
.main {
  padding-bottom: 20px;
}
/deep/ .no-pass-item {
  background: #fff6f6;
  border-radius: 20px;
}
.card-info {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    .room-name {
      font-weight: bold;
      font-size: 14px;
      color: #000000;
    }
    .process-status {
    }
  }
  .operation {
    margin-top: 8px;
    padding-top: 4px;
    border-top: solid 1px #e5e5e5;
    display: flex;
    justify-content: space-between;
  }
}

.time-view {
  display: flex;
  .time-start {
    flex: 40%;
    display: flex;
    justify-content: center;
    /deep/ .placeholder {
      color: #bbb;
    }
  }
  .time-interval {
    flex: 20%;
    display: flex;
    justify-content: center;
    color: #757575;
  }
  .time-end {
    flex: 40%;
    display: flex;
    justify-content: center;
    /deep/ .placeholder {
      color: #bbb;
    }
  }
}
</style>
