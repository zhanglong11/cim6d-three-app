<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form">
        <view class="common-card mt20">
          <view class="common-card-title between">
            <span><strong> 领料内容 </strong></span>
            <span class="common-text-button" @click="addMaterial">添加材料</span>
          </view>
          <view class="common-card-body">
            <block v-if="materialList.length">
              <block v-for="(item, index) of materialList" :key="'picking' + index">
                <div class="card-item">
                  <div class="card-item-title"></div>
                  <div class="card-item-body">
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">领取材料{{ index + 1 }}:</span>
                        <span class="value">
                          {{ item.code }} <span class="split no-content"></span> {{ item.name
                          }}<span class="split no-content"></span> {{ item.models }}
                          <span class="split no-content"></span> {{ item.brand }}
                          <span class="split no-content"></span> {{ item.supplier }}
                          <span class="split no-content"></span>
                          {{ $getLabel(materialTypeList, item.type) }}
                        </span>
                      </div>
                    </div>
                    <div class="card-item-line">
                      <div class="line-item">
                        <div class="common-form-item">
                          <uni-form-item label="领取数量:" prop="number" align="left">
                            <input v-model.number="item.number" placeholder="请输入领取数量" style="width: 200px" />
                            <span>{{ item.unit }}</span>
                          </uni-form-item>
                        </div>
                      </div>
                      <div class="line-item" style="flex: 0 0 100rpx">
                        <span class="common-button" type="primary" @click="deleteMaterial(index)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </view>
        </view>
        <view class="common-card mt20">
          <view class="common-card-title between">
            <span><strong> 使用位置 </strong></span>
            <span class="common-text-button" @click="addPlace">添加位置</span>
          </view>
          <view class="common-card-body">
            <block v-if="placeList.length">
              <block v-for="(item, index) of placeList" :key="'picking' + index">
                <div class="card-item">
                  <div class="card-item-title"></div>
                  <div class="card-item-body">
                    <div class="card-item-line">
                      <div class="line-item">
                        <span class="label">使用位置{{ index + 1 }}:</span>
                        <span class="value">
                          {{ getLabel(item, 'building') }} <span class="split"></span> {{ getLabel(item, 'unit')
                          }}<span class="split"></span> {{ getLabel(item, 'floor') }} <span class="split"></span>
                          {{ getLabel(item, 'room') }}
                        </span>
                      </div>
                      <div class="line-item" style="flex: 0 0 100rpx">
                        <span class="common-button" type="primary" @click="handleDeletePlace(index)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </view>
        </view>
      </uni-form-custom>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并提交</button>
      </view>
      <uni-drawer ref="materialList" :width="700" mode="right">
        <MaterialList :checked="checkedValue" @selected="handleMaterialSelected"></MaterialList>
      </uni-drawer>
      <!--选择位置-->
      <uni-popup ref="placePopup" type="center" class="common-popup">
        <view class="pop-header">添加使用位置</view>
        <view class="pop-body with-border">
          <div>
            <block v-if="placeList.length">
              <block v-for="(item, index) of placeList" :key="'place' + index">
                <div class="block">
                  <uni-form-custom :ref="'placeForm' + index" :model="item" :rules="rules">
                    <div class="line">
                      <div class="line-item">
                        <p class="add-place-title">新增使用位置{{ index + 1 }}:</p>
                        <span class="common-button no-radius" type="primary" @click="handleDeletePlace(index)"
                          >删除</span
                        >
                      </div>
                    </div>
                    <div class="line">
                      <div class="line-item">
                        <uni-form-item label="" prop="buildingId" class="none-label" align="left">
                          <uni-select
                            v-model="item.buildingId"
                            placeholder="请选择楼栋"
                            :options="getOpts(item, 'building')"
                            @change="handleChange('building', item)"
                          ></uni-select>
                          <div class="form-link"></div>
                        </uni-form-item>
                      </div>
                      <div class="line-item">
                        <uni-form-item label="" prop="unitsId" class="none-label" align="left">
                          <uni-select
                            v-model="item.unitsId"
                            placeholder="请选择单元"
                            :options="getOpts(item, 'unit')"
                            @change="handleChange('unit', item)"
                          ></uni-select>
                          <div class="form-link"></div>
                        </uni-form-item>
                      </div>
                    </div>
                    <div class="line">
                      <div class="line-item">
                        <uni-form-item label="" prop="floorId" class="none-label" align="left">
                          <uni-select
                            v-model="item.floorId"
                            placeholder="请选择楼层"
                            :options="getOpts(item, 'floor')"
                            @change="handleChange('floor', item)"
                          ></uni-select>
                          <div class="form-link"></div>
                        </uni-form-item>
                      </div>
                      <div class="line-item">
                        <uni-form-item label="" prop="roomId" class="none-label" align="left">
                          <uni-select
                            v-model="item.roomId"
                            placeholder="请选择房间"
                            :options="getOpts(item, 'room')"
                            @change="handleChange('room', item, index)"
                          ></uni-select>
                          <div class="form-link"></div>
                        </uni-form-item>
                      </div>
                    </div>
                  </uni-form-custom>
                </div>
              </block>
            </block>
            <block v-else><p class="no-data">暂无数据</p></block>
          </div>
          <div class="line">
            <span class="common-button" type="primary" @click="handleAddPlace">添加位置</span>
          </div>
        </view>
        <view class="pop-footer">
          <span class="common-button mini" type="default" @click="handlePlaceClose">取消</span>
          <span class="common-button mini" type="primary" @click="handlePlaceSubmit">确定</span>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from './api'
import materialTypeList from './lib/materialTypeList'
import MaterialList from './material-list'
import treeFind from '@/utils/treeFind'
export default {
  components: { MaterialList },
  data() {
    return {
      selectTreeDate: [],
      id: '',
      materialTypeList,
      form: {},
      rules: {
        buildingId: { required: true },
        unitsId: { required: true },
        floorId: { required: true },
        roomId: { required: true }
      },
      materialList: [],
      checkedValue: [],
      placeList: [],
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {},
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑领料单')
      this.getDetail()
    }
    let targetId = options.messageId || ''
    if (targetId) {
      this.$utils.toUrl(`/pages/decoration/decorationMaterial/pick/detail?id=${this.id}&isCheck=${options.isCheck}`, 2)
      return
    }
  },
  // 返回拦截
  onBackPress(obj) {
    if (!this.isSave) {
      this.$utils.addGoBack(() => {
        this.isSave = true
      })
    }
    return !this.isSave
  },
  created() {
    this.getPlaceData()
  },
  methods: {
    async getPlaceData() {
      let res = await Api.getBuildingList(this.projectId)
      let selectTreeDate = []
      for (let i = 0; i < res.data.length; i++) {
        let roomDataRes = await this.getRoomDataList(res.data[i].id)
        let child = roomDataRes.map(unit => {
          let unitChildren = unit.floorList.map(floor => {
            let roomChildren = floor.roomList.map(room => {
              return {
                type: 'room',
                value: room.id,
                label: room.roomName,
                name: room.roomName,
                id: room.id
              }
            })
            return {
              type: 'floor',
              value: floor.constructionFloorId,
              id: floor.constructionFloorId,
              label: floor.floorName,
              name: floor.floorName,
              children: roomChildren
            }
          })
          return {
            type: 'unit',
            value: unit.id,
            id: unit.id,
            label: unit.unitName,
            name: unit.unitName,
            children: unitChildren
          }
        })
        selectTreeDate.push({
          label: res.data[i].name,
          name: res.data[i].name,
          value: res.data[i].id,
          id: res.data[i].id,
          type: 'building',
          children: child
        })
      }
      this.selectTreeDate = selectTreeDate
    },
    async getRoomDataList(buildingId) {
      let res = await Api.getRoomList({ buildingId })
      let unitList = []
      unitList = res.data.map(item => {
        return {
          name: item.unitName,
          label: item.unitName,
          id: item.id,
          value: item.id,
          ...item
        }
      })
      return unitList
    },
    getOpts(row, type) {
      if (type === 'building') {
        return this.selectTreeDate || []
      }
      if (type === 'unit') {
        if (!row.buildingId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'building' && item.id === row.buildingId
        })
        return findArr?.children || []
      }
      if (type === 'floor') {
        if (!row.unitsId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'unit' && item.id === row.unitsId
        })
        return findArr?.children || []
      }
      if (type === 'room') {
        if (!row.floorId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'floor' && item.id === row.floorId
        })
        return findArr?.children || []
      }
    },
    getLabel(row, type) {
      let hash = {
        building: 'buildingId',
        unit: 'unitsId',
        floor: 'floorId',
        room: 'roomId'
      }
      if (!row[hash[type]]) return
      let result = treeFind(this.selectTreeDate, item => {
        return item.type === type && item.id === row[hash[type]]
      })
      return (result && result.label) || ''
    },
    handleChange(type, data, index = 0) {
      if (type === 'building') {
        this.$set(data, 'unitsId', '')
        this.$set(data, 'floorId', '')
        this.$set(data, 'roomId', '')
      }
      if (type === 'unit') {
        this.$set(data, 'floorId', '')
        this.$set(data, 'roomId', '')
      }
      if (type === 'floor') {
        this.$set(data, 'roomId', '')
      }
      if (type === 'room') {
        let arr = _.filter(this.placeList, (item, i) => {
          if (i !== index) {
            return true
          }
        })
        let alreadyHas = _.some(arr, item => {
          return (
            item.buildingId === data.buildingId &&
            item.unitsId === data.unitsId &&
            item.floorId === data.floorId &&
            item.roomId === data.roomId
          )
        })
        if (alreadyHas) {
          this.$utils.showToast('已有该房间')
          this.$set(data, 'roomId', '')
        }
      }
    },
    //获得详情
    async getDetail() {
      let res = await Api.getMaterialPickDetail(this.id)
      this.form = {
        ...res.data
      }
      this.materialList = [...res.data.contents]
      this.placeList = [...res.data.places]
      this.checkedValue = res.data.contents.map(item => item.materialId)
    },
    //添加材料
    addMaterial() {
      this.$refs.materialList.open()
    },
    // 删除材料
    deleteMaterial(index) {
      this.materialList = this.materialList.splice(index, 1)
      this.checkedValue = this.checkedValue.splice(index, 1)
    },
    //提交选择材料
    handleMaterialSelected(data) {
      let differenceArr = _.differenceBy(data.transRow, this.materialList, 'materialId')
      this.materialList = [...this.materialList, ...differenceArr]
      let idArr = this.materialList.map(item => item.materialId)
      this.checkedValue = [...idArr]
      this.$refs.materialList.close()
    },
    //打开添加位置弹窗
    addPlace() {
      this.$refs.placePopup.open()
    },
    //弹窗添加位置
    handleAddPlace() {
      this.placeList.push({})
    },
    handleDeletePlace(index) {
      this.placeList.splice(index, 1)
    },
    handlePlaceClose() {
      this.$refs.placePopup.close()
    },
    async handlePlaceSubmit() {
      await Promise.all(
        this.placeList.map((item, index) => {
          return this.$refs['placeForm' + index][0].validate()
        })
      )
      this.$refs.placePopup.close()
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      if (!this.materialList.length) {
        this.$utils.showToast('请选择要领取的材料')
        return
      }
      let details = this.materialList.map(item => {
        return {
          materialId: item.materialId ? item.materialId : item.id,
          number: +item.number
        }
      })
      let hasNull = _.some(details, item => item.number <= 0 || _.isNaN(item.number))
      if (hasNull) {
        this.$utils.showToast('请正确填写领取数量')
        return
      }
      if (!this.placeList.length) {
        this.$utils.showToast('请选择要使用的位置')
        return
      }
      let params = {
        id: this.id || '',
        contents: details,
        places: this.placeList
      }
      isSave ? await Api.saveMaterialPick(params) : await Api.saveAndSubmitMaterialPick(params)
      this.$utils.showToast('操作成功')
      this.isSave = true
      setTimeout(() => {
        this.$utils.goBack(1)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./index.less');
.mt20 + .mt20 {
  margin-top: 50rpx;
}
</style>
