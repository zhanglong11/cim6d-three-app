<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules" class="border-top mt20">
        <uni-card isForm>
          <block v-if="id">
            <uni-form-item label="房间">
              <view class="disabled">
                {{ form.buildingName }}-{{ form.unitName }}-{{ form.floorName }}-{{ form.roomName }}
              </view>
            </uni-form-item>
            <uni-form-item label="问题描述" prop="problemDesc">
              <textarea v-model.trim="form.problemDesc" auto-height placeholder="请输入" />
            </uni-form-item>
            <uni-form-item class="file-item" label="照片">
              <uni-attachment v-model="form.fileId" uploadType="image" edit></uni-attachment>
            </uni-form-item>
            <uni-form-item label="整改期限" prop="rectifyDeadline" isRequired isLink>
              <uni-date-picker v-model="form.rectifyDeadline" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="整改人" isLink isRequired prop="rectifyPrincipal">
              <uni-select-user v-model="form.rectifyPrincipal" />
            </uni-form-item>
            <uni-form-item label="图纸">
              <view class="disabled">
                {{ form.drawingsName || '是的撒的撒' }}
              </view>
            </uni-form-item>
          </block>
          <block v-else>
            <uni-form-item label="楼栋" isLink isRequired prop="buildingId">
              <uni-select
                v-model="form.buildingId"
                placeholder="楼栋"
                :options="getOpts(form, 'building')"
                @change="handleChange('building', form)"
              >
              </uni-select>
            </uni-form-item>
            <uni-form-item label="单元" isLink isRequired prop="unitsId">
              <uni-select
                v-model="form.unitsId"
                placeholder="单元"
                :options="getOpts(form, 'unit')"
                @change="handleChange('unit', form)"
              >
              </uni-select>
            </uni-form-item>
            <uni-form-item label="楼层" isLink isRequired prop="floorId">
              <uni-select
                v-model="form.floorId"
                placeholder="楼层"
                :options="getOpts(form, 'floor')"
                @change="handleChange('floor', form)"
              >
              </uni-select>
            </uni-form-item>
            <uni-form-item label="房间" isLink isRequired prop="roomId">
              <uni-select
                v-model="form.roomId"
                placeholder="房间"
                :options="getOpts(form, 'room')"
                @change="handleChange('room', form)"
              >
              </uni-select>
            </uni-form-item>
            <uni-form-item label="图纸" isLink isRequired prop="floorId">
              <uni-select v-model="form.drawingsUnicode" placeholder="请选择图纸" :options="drawingList"> </uni-select>
            </uni-form-item>
          </block>
          <div class="mark-container">
            <div v-if="drawingUrl" class="common-btn-group">
              <span class="common-button" type="primary" @click="zoomOut">缩小</span>
              <span class="common-button" @click="zoomReset">复位</span>
              <span class="common-button" type="warning" @click.stop="zoomIn">放大</span>
            </div>
            <div class="img-container">
              <ImageMark
                v-if="drawingUrl"
                id="zoomImage"
                :imageSrc="drawingUrl"
                :pointList="pointList"
                :style="zoomStyle"
                @add="handleAdd"
                @pointClick="pointClick"
              ></ImageMark>
              <div v-else class="no-data">没有关联的图纸</div>
            </div>
          </div>
        </uni-card>
      </uni-form-custom>
      <view v-if="!id && pointList.length" class="problem-list">
        <view class="title">
          <h3>问题列表</h3>
        </view>
        <block v-for="(item, index) of pointList" :key="'pl' + index">
          <view class="item">
            <view class="item-line">
              <span class="desc"><span class="mr20">问题描述:</span> {{ item.problemDesc }} </span>
              <span class="tag">问题{{ index + 1 }}</span>
            </view>
            <view class="item-line file">
              <span class="mr20">照片:</span>
              <uni-attachment v-model="item.fileId" uploadType="image" class="ml20"></uni-attachment>
            </view>
            <view class="item-line"
              ><span> <span class="mr20">整改期限:</span> {{ item.rectifyDeadline | ymd }}</span>
            </view>
            <view class="item-line">
              <span><span class="mr20">整改人: </span>{{ item.rectifyPrincipalName }}</span>
              <span class="common-button no-radius" type="primary" @click="handleDeleteProblem(item)">删除</span></view
            >
          </view>
        </block>
      </view>
      <uni-popup ref="addPopup" type="center">
        <div class="popup-container">
          <h4 class="title">问题</h4>
          <div class="body">
            <uni-form-custom ref="addForm" :model="addForm" :rules="rules">
              <uni-form-item label="问题描述" prop="problemDesc">
                <textarea v-model.trim="addForm.problemDesc" auto-height placeholder="请输入" />
              </uni-form-item>
              <uni-form-item class="file-item" label="照片" prop="fileId">
                <uni-attachment v-model="addForm.fileId" uploadType="image" edit></uni-attachment>
              </uni-form-item>
              <uni-form-item label="整改期限" prop="rectifyDeadline" isRequired isLink>
                <uni-date-picker v-model="addForm.rectifyDeadline" fields="day" mode="date"></uni-date-picker>
              </uni-form-item>
              <uni-form-item label="整改人" isLink isRequired prop="rectifyPrincipal">
                <uni-select-user v-model="addForm.rectifyPrincipal" :name.sync="addForm.rectifyPrincipalName" />
              </uni-form-item>
            </uni-form-custom>
          </div>
          <view class="dialog-footer-btn-wrapper">
            <div class="common-button" type="default" @click="closePopup()">取消</div>
            <div class="common-button" type="primary" @click="confirmPopup()">确定</div>
          </view>
        </div>
      </uni-popup>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="handleSave(true)">保存</button>
        <button class="button" type="primary" @click="handleSave(false)">保存并下达</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from './api'
import treeFind from '@/utils/treeFind'
import ImageMark from 'vue-image-mark'
export default {
  components: { ImageMark },
  data() {
    return {
      //申请到货日期
      id: '',
      selectTreeDate: [],
      drawingList: [],
      form: {
        drawingsUnicode: ''
      },
      drawingUrl: '',
      addForm: {},
      addFormRules: {},
      zoomConStyle: '', // 默认高度
      zoomStyle: '', // 放大/缩小
      zoomSize: 1, // 图纸初始大小
      zoomStep: 0.2, // 每次放大或缩小倍数
      pointList: [],
      pointData: {},
      pointEditFlag: false,
      rules: {
        // applicantName: { required: true },
        buildingId: { required: true },
        unitsId: { required: true },
        floorId: { required: true },
        roomId: { required: true },
        problemDesc: { required: true },
        fileId: { required: true },
        rectifyDeadline: { required: true },
        rectifyPrincipal: { required: true }
      },
      isSave: false // 是否保存
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.$utils.setTitle('编辑')
      this.getDetail()
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
  watch: {
    'form.drawingsUnicode'() {
      if (this.form.drawingsUnicode) {
        this.drawingUrl = this.drawingList.filter(item => item.id === this.form.drawingsUnicode)[0].imgUrl || ''
      } else {
        this.drawingUrl = ''
      }
    }
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
        return findArr.children || []
      }
      if (type === 'floor') {
        if (!row.unitsId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'unit' && item.id === row.unitsId
        })
        return findArr.children || []
      }
      if (type === 'room') {
        if (!row.floorId) return []
        let findArr = treeFind(this.selectTreeDate, item => {
          return item.type === 'floor' && item.id === row.floorId
        })
        return findArr.children || []
      }
    },
    handleChange(type, data) {
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
        this.$set(data, 'drawingsUnicode', '')
        this.getDrawingList(data.roomId)
      }
    },
    // 获取图纸列表
    async getDrawingList(id) {
      let res = await Api.getDrawingList(id)
      let list =
        res.data &&
        res.data.map(item => {
          return {
            id: item.id,
            value: item.id,
            name: item.drawingsName,
            label: item.drawingsName,
            imgUrl: item.modelUrls ? JSON.parse(item.modelUrls)[0] : ''
          }
        })
      this.drawingList = list
    },
    //获得详情
    async getDetail() {
      let res = await Api.getQualityProblemDetail(this.id)
      this.form = {
        ...this.form,
        ...res.data
      }
      this.drawingUrl = res.data.modelUrls ? JSON.parse(res.data.modelUrls)[0] : ''
      let x = (res.data.coordinate && res.data.coordinate.split(',')[0]) || 0
      let y = (res.data.coordinate && res.data.coordinate.split(',')[1]) || 0
      this.pointList = [
        {
          id: 1,
          positionNum: 1,
          x,
          xCoordinate: x,
          yCoordinate: y,
          y,
          problemDesc: res.data.problemDesc,
          fileId: res.data.fileId,
          rectifyDeadline: res.data.rectifyDeadline,
          rectifyPrincipal: res.data.rectifyPrincipal,
          rectifyPrincipalName: res.data.rectifyPrincipalName,
          color: '#e63030',
          status: 0
        }
      ]
    },
    // 放大图纸
    zoomIn() {
      let zoomSize = this.zoomSize + this.zoomStep
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 缩小图纸
    zoomOut() {
      let zoomSize = this.zoomSize - this.zoomStep
      if (zoomSize < 0.2) {
        return
      }
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 复位图纸
    zoomReset() {
      let zoomSize = 1
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 图纸点击触发事件
    handleAdd(point) {
      if (this.id) return
      this.pointEditFlag = false
      this.pointData = {
        positionNum: point.id,
        id: point.id,
        xCoordinate: point.x,
        yCoordinate: point.y,
        x: point.x,
        y: point.y,
        color: '#f00',
        status: 0
      }
      this.addForm = {}
      this.$refs.addPopup.open()
    },
    closePopup() {
      this.$refs.addPopup.close()
    },
    //弹窗提交事件
    async confirmPopup() {
      await this.$refs.addForm.validate()
      this.pointData = { ...this.pointData, ...this.addForm }
      if (this.pointEditFlag) {
        this.pointList = this.pointList.map(item => {
          if (item.positionNum === this.pointData.positionNum) {
            return { ...item, ...this.pointData }
          } else {
            return { ...item }
          }
        })
      } else {
        // 渲染实测点
        this.pointList.push(this.pointData)
      }
      this.$refs.addPopup.close()
    },
    // 实测点点击事件
    pointClick(point) {
      if (this.id) return
      this.pointData = this.pointList.filter(e => e.positionNum === point.id)[0]
      this.addForm = { ...this.pointData }
      this.pointEditFlag = true
      this.$refs.addPopup.open()
    },
    //表格删除点
    handleDeleteProblem(row) {
      const positionNum = row.positionNum
      this.pointList = this.pointList.filter(e => e.positionNum !== positionNum)
      // 更新点号字段
      this.pointList.map(item => {
        if (item.positionNum > positionNum) {
          item.positionNum--
        }
      })
      this.pointList.forEach((item, index) => {
        item.id = index + 1
        item.positionNum = index + 1
      })
    },
    // 点击保存按钮
    async handleSave(isSave = true) {
      await this.$refs.form.validate()
      let pointArr = this.pointList.map(item => {
        return {
          ...item,
          coordinate: `${item.x},${item.y}`
        }
      })
      let params = {
        ...this.form,
        details: pointArr
      }
      if (this.id) {
        await Api.updateQualityProblem(this.form)
      } else {
        isSave ? await Api.addQualityProblem(params) : await Api.addAndReleaseQualityProblem(params)
        this.$utils.showToast('成功')
      }
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
.no-data {
  font-size: 12px;
  color: #6e6e6e;
}
</style>
