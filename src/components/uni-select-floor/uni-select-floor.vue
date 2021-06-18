<template>
  <view class="uni-select-floor">
    <view class="select-con">
      <view class="select-item">
        <xfl-select
          ref="ridgepole-select"
          :list="ridgepoleList"
          placeholder="楼栋"
          @change="handleChangeRidgepole"
          @clear="handleClearRidgepole"
        ></xfl-select>
      </view>
      <view class="select-item">
        <xfl-select
          ref="unit-select"
          :list="unitList"
          placeholder="单元"
          @change="handleChangeUnit"
          @clear="handleClearUnit"
        ></xfl-select>
      </view>
      <view class="select-item">
        <xfl-select
          ref="floor-select"
          :list="floorList"
          placeholder="楼层"
          @change="handleChangeFloor"
          @clear="handleClearFloor"
        ></xfl-select>
      </view>
      <view class="select-item">
        <xfl-select
          ref="room-select"
          :list="roomList"
          placeholder="房间"
          @change="handleChangeRoom"
          @clear="handleClearRoom"
        ></xfl-select>
      </view>
    </view>
  </view>
</template>

<script>
import xflSelect from '@/components/xfl-select/xfl-select'
import Api from '@/pages/decoration/decorationSchedule/scheduleManage/api'
export default {
  components: { xflSelect },
  props: {
    value: {
      type: Array,
      default: () => ['', '', '', '']
    }
  },
  data() {
    return {
      ridgepoleId: '',
      ridgepoleList: [],
      unitId: '',
      unitList: [],
      floorId: '',
      floorList: [],
      roomId: '',
      roomList: []
    }
  },
  async created() {
    await this.getBuildingDetail(this.$store.state.project.projectId)
    // console.log(this.value)
    // start--回显数据操作--start
    if (this.value.join('') !== '') {
      let roomInfo = this.value
      this.ridgepoleId = roomInfo[0]
      this.unitId = roomInfo[1]
      this.floorId = roomInfo[2]
      this.roomId = roomInfo[3]
      // 楼栋框回显
      this.ridgepoleList.map(item => {
        if (item.id === this.ridgepoleId) {
          this.recoverListItem('ridgepole-select', item.name)
        }
      })

      // 加载单元数据
      await this.getBuildingUnitFloorRoomDetail(this.ridgepoleId)

      // 存在单元时，单元框回显
      if (this.unitId) {
        this.unitList.map(item => {
          if (item.id === this.unitId) {
            this.recoverListItem('unit-select', item.unitName)
          }
        })

        let unitList = this.unitList
        for (let i = 0; i < unitList.length; i++) {
          if (unitList[i].id === this.unitId) {
            // 加载楼层数据
            this.floorList = unitList[i].floorList
            this.floorList.map(item => {
              item.value = item.floorName
            })
            break
          }
        }
      }

      // 存在楼层时，楼层框回显
      if (this.floorId) {
        this.floorList.map(item => {
          if (item.constructionFloorId === this.floorId) {
            this.recoverListItem('floor-select', item.floorName)
          }
        })

        let floorList = this.floorList
        for (let i = 0; i < floorList.length; i++) {
          if (floorList[i].constructionFloorId === this.floorId) {
            // 加载房间数据
            this.roomList = floorList[i].roomList
            this.roomList.map(item => {
              item.value = item.roomName
            })
            break
          }
        }
      }

      // 存在房间时，房间框回显
      if (this.roomId) {
        this.roomList.map(item => {
          if (item.id === this.roomId) {
            this.recoverListItem('room-select', item.roomName)
          }
        })
      }
    }
    // end--回显数据操作--end
  },
  methods: {
    // 获取楼栋信息
    async getBuildingDetail(projectId) {
      let res = await Api.getBuildingDetail(projectId)
      if (res.data && res.data.length) {
        res.data.map(item => {
          item.value = item.name
        })
        this.ridgepoleList = res.data
      }
    },
    // 获取单元(楼层、房间)信息
    async getBuildingUnitFloorRoomDetail(ridgepoleId) {
      let res = await Api.getBuildingUnitFloorRoomDetail({ buildingId: ridgepoleId })
      this.unitList = res.data
      this.unitList.map(item => {
        item.value = item.unitName
      })
    },
    // 楼栋变更
    async handleChangeRidgepole(e) {
      this.cleanUnit()
      this.cleanFloor()
      this.cleanRoom()
      this.ridgepoleId = e.orignItem.id
      await this.getBuildingUnitFloorRoomDetail(this.ridgepoleId) // 加载单元数据
      this.$emit('input', [this.ridgepoleId, '', '', ''])
    },
    // 楼栋清除按钮
    handleClearRidgepole() {
      this.cleanUnit()
      this.cleanFloor()
      this.cleanRoom()
      this.disposeListHideAndToggleFalse('ridgepole-select')
      this.$emit('input', ['', '', '', ''])
    },
    // 单元变更
    handleChangeUnit(e) {
      this.cleanFloor()
      this.cleanRoom()
      this.unitId = e.orignItem.id
      let unitList = this.unitList
      for (let i = 0; i < unitList.length; i++) {
        if (unitList[i].id === this.unitId) {
          // 加载楼层数据
          this.floorList = unitList[i].floorList
          this.floorList.map(item => {
            item.value = item.floorName
          })
          break
        }
      }
      this.$emit('input', [this.ridgepoleId, this.unitId, '', ''])
    },
    // 单元清除按钮
    handleClearUnit() {
      this.cleanFloor()
      this.cleanRoom()
      this.disposeListHideAndToggleFalse('unit-select')
      this.$emit('input', [this.ridgepoleId, '', '', ''])
    },
    // 楼层变更
    handleChangeFloor(e) {
      this.cleanRoom()
      this.floorId = e.orignItem.constructionFloorId
      let floorList = this.floorList
      for (let i = 0; i < floorList.length; i++) {
        if (floorList[i].constructionFloorId === this.floorId) {
          // 加载房间数据
          this.roomList = floorList[i].roomList
          this.roomList.map(item => {
            item.value = item.roomName
          })
          break
        }
      }
      this.$emit('input', [this.ridgepoleId, this.unitId, this.floorId, ''])
    },
    // 楼层清除按钮
    handleClearFloor() {
      this.cleanRoom()
      this.disposeListHideAndToggleFalse('floor-select')
      this.$emit('input', [this.ridgepoleId, this.unitId, '', ''])
    },
    // 房间变更
    handleChangeRoom(e) {
      this.roomId = e.orignItem.id
      this.$emit('input', [this.ridgepoleId, this.unitId, this.floorId, this.roomId])
    },
    // 房间清除按钮
    handleClearRoom() {
      this.disposeListHideAndToggleFalse('room-select')
      this.$emit('input', [this.ridgepoleId, this.unitId, this.floorId, ''])
    },

    // 清空单元下拉框"状态"
    cleanUnit() {
      this.disposeClearItemActiveAndInput('unit-select')
      this.disposeListHideAndToggleFalse('unit-select')
      this.unitId = '' // 清空单元id值
      this.unitList = [] // 清空单元集
    },
    // 清空楼层下拉框"状态"
    cleanFloor() {
      this.disposeClearItemActiveAndInput('floor-select')
      this.disposeListHideAndToggleFalse('floor-select')
      this.floorId = '' // 清空楼层id值
      this.floorList = [] // 清空楼层集
    },
    // 清空房间下拉框"状态"
    cleanRoom() {
      this.disposeClearItemActiveAndInput('room-select')
      this.disposeListHideAndToggleFalse('room-select')
      this.roomId = '' // 清空房间id值
      this.roomList = [] // 清空房间集
    },

    // 组件清除下拉菜单选中项、清除下拉框选中text值
    disposeClearItemActiveAndInput(select) {
      this.$refs[select].clearItemActive()
      this.$refs[select].clearInput()
    },
    // 组件下拉菜单隐藏、开关恢复操作
    disposeListHideAndToggleFalse(select) {
      this.$refs[select].onListHide()
      this.$refs[select].switchMgr.isOpen = false
    },

    // 回显选中的列表项操作
    recoverListItem(select, textVal) {
      this.$refs[select].clearInput()
      this.$refs[select].setInput(textVal)
      this.$refs[select].changeActiveIndex(textVal)
      this.$refs[select].getInputBoxHeight()
    }
  }
}
</script>

<style lang="less" scoped>
.uni-select-floor {
  .select-con {
    display: flex;
    flex-wrap: wrap;
    .select-item {
      flex: 50%;
      margin-bottom: 20px;
    }
    .select-item:nth-child(odd) {
      padding-right: 10px;
    }
    .select-item:nth-child(even) {
      padding-left: 10px;
    }
  }
  /deep/ .show-box {
    height: unset;
    font-size: 14px;
    .input {
      border: 0px;
    }
    .iconfont.clear {
      font-size: 12px;
    }
  }
}
</style>
