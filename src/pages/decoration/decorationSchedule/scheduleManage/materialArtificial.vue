<template>
  <view class="main">
    <view class="radio-con">
      <view
        v-for="(item, index) in statusList"
        :key="index"
        :class="['radio-item', item.value === status ? 'active' : '']"
        @click="handleFilter(item.value)"
        >{{ item.label }}</view
      >
    </view>
    <view class="main-body">
      <uni-card v-for="(item, index) in list" :key="index">
        <view class="card-body">
          <view class="card-info">
            <view class="header">
              <view class="titleText">{{ item.name }}</view>
              <view>
                <view v-if="item.status === 1">正常</view>
                <view v-else-if="item.status === 2" style="color: red">材料超标</view>
                <view v-else-if="item.status === 3" style="color: red">人工费用超标</view>
                <view v-else-if="item.status === 4" style="color: red">材料和人工费用均超标</view>
              </view>
            </view>
            <view v-for="(material, mIndex) in item.materials" :key="mIndex" class="material">
              <view class="titleText">耗费材料{{ mIndex + 1 }}：</view>
              <view class="info">
                <view class="info-name">{{ material.name }}</view>
                <view class="info-text">
                  <view>标准用量：{{ material.dosage }}</view>
                  <view>允许超出范围：{{ material.materialExceedScope }}</view>
                </view>
                <view class="info-text">
                  <view
                    >实际用量：<span class="normal-color">{{ material.realDosage }}</span></view
                  >
                  <view
                    >实际超出范围：<span :class="[material.singleMaterialExceedFlag ? 'red-color' : 'normal-color']">{{
                      material.realMaterialExceedScope
                    }}</span></view
                  >
                </view>
              </view>
            </view>
            <view class="artificial">
              <view class="titleText">人工费用：</view>
              <view class="info">
                <view class="info-text">
                  <view>标准费用：{{ item.staffCosts }}</view>
                  <view>允许超出范围：{{ item.costsExceedScope }}</view>
                </view>
                <view class="info-text">
                  <view
                    >实际费用：<span class="normal-color">{{ item.actualStaffCosts }}</span></view
                  >
                  <view
                    >实际超出范围：<span
                      :class="[item.status === 3 || item.status === 4 ? 'red-color' : 'normal-color']"
                      >{{ item.actualStaffCostsExceedScope }}</span
                    ></view
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </uni-card>
      <EmptyTemplate v-if="list.length === 0" />
      <view class="page-bottom"></view>
    </view>
  </view>
</template>

<script>
import Api from './api'

export default {
  data() {
    return {
      status: '',
      statusList: [
        { value: '', label: '全部' },
        { value: 1, label: '正常' },
        { value: 2, label: '材料超标' },
        { value: 3, label: '人工费用超标' },
        { value: 4, label: '双超标' }
      ],
      detailData: {},
      oldProcessList: [], // 原始数据，包含所有(是否超标状态)的信息
      list: [] // 材料及人工清单
    }
  },
  onLoad(options) {
    this.scheduleId = options.id || ''
  },
  created() {
    if (this.scheduleId) {
      this.getMaterialArtificialDetail(this.scheduleId)
    }
  },
  methods: {
    // 获取材料及人工详情
    getMaterialArtificialDetail(id) {
      uni.showLoading()
      Api.getMaterialArtificialDetail(id).then(res => {
        // console.log(res)
        uni.hideLoading()
        this.detailData = res.data
        let procedureList = this.detailData.procedureList
        // console.log(procedureList)

        this.oldProcessList = this.disposeProcessList(procedureList)
        this.list = this.oldProcessList
      })
    },
    // 材料及人工清单：迭代数据处理
    disposeProcessList(procedureList) {
      let processList = []
      for (let i = 0; i < procedureList.length; i++) {
        let process = procedureList[i]
        let materials = process.materialStandardList // 标准材料
        let realMaterials = process.materialActualList // 实际材料

        let sameMaterials = [] // 把重复的材料添加进来，并进行数据合并
        for (let j = 0; j < materials.length; j++) {
          for (let k = 0; k < realMaterials.length; k++) {
            if (materials[j].materialId === realMaterials[k].materialId) {
              sameMaterials.push(this.wrapperMaterialAndRealMaterial(materials[j], realMaterials[k]))
            }
          }
        }

        let diffMaterials = []
        if (materials.length > realMaterials.length) {
          if (sameMaterials.length) {
            // 存在重复材料时，把不重复的标准材料添加进来
            for (let j = 0; j < materials.length; j++) {
              let flag = true
              for (let k = 0; k < sameMaterials.length; k++) {
                if (materials[j].materialId === sameMaterials[k].id) {
                  flag = false
                  break
                }
              }
              if (flag) {
                diffMaterials.push(this.wrapperMaterial(materials[j]))
              }
            }
          } else if (realMaterials.length) {
            // 不存在重复材料，实际材料数量不为空集，标准材料和实际材料都添加进来
            for (let j = 0; j < materials.length; j++) {
              diffMaterials.push(this.wrapperMaterial(materials[j]))
            }
            for (let j = 0; j < realMaterials.length; j++) {
              diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
            }
          } else {
            // 不存在重复材料，实际材料数量为空集，仅添加标准材料
            for (let j = 0; j < materials.length; j++) {
              diffMaterials.push(this.wrapperMaterial(materials[j]))
            }
          }
        } else if (materials.length < realMaterials.length) {
          if (sameMaterials.length) {
            // 存在重复材料时，把不重复的实际材料添加进来
            for (let j = 0; j < realMaterials.length; j++) {
              let flag = true
              for (let k = 0; k < sameMaterials.length; k++) {
                if (realMaterials[j].materialId === sameMaterials[k].id) {
                  flag = false
                  break
                }
              }
              if (flag) {
                diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
              }
            }
          } else if (materials.length) {
            // 不存在重复材料，标准材料数量不为空集，标准材料和实际材料都添加进来
            for (let j = 0; j < materials.length; j++) {
              diffMaterials.push(this.wrapperMaterial(materials[j]))
            }
            for (let j = 0; j < realMaterials.length; j++) {
              diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
            }
          } else {
            // 不存在重复材料，标准材料为空集，仅添加实际材料
            for (let j = 0; j < realMaterials.length; j++) {
              diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
            }
          }
        } else if (materials.length === realMaterials.length) {
          if (sameMaterials.length) {
            // 存在重复材料
            if (sameMaterials.length === materials.length && sameMaterials.length === realMaterials.length) {
              // 标准材料与实际材料完全一致时，diffMaterials不做任何操作
            } else {
              // 标准材料与实际材料不完全一致时，把不重复的标准材料和实际材料都添加进来
              // 添加不重复的标准材料
              for (let j = 0; j < materials.length; j++) {
                let flag = true
                for (let k = 0; k < sameMaterials.length; k++) {
                  if (materials[j].materialId === sameMaterials[k].id) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  diffMaterials.push(this.wrapperMaterial(materials[j]))
                }
              }
              // 添加不重复的实际材料
              for (let j = 0; j < realMaterials.length; j++) {
                let flag = true
                for (let k = 0; k < sameMaterials.length; k++) {
                  if (realMaterials[j].materialId === sameMaterials[k].id) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
                }
              }
            }
          } else {
            // 不存在重复材料
            if (sameMaterials.length === materials.length && sameMaterials.length === realMaterials.length) {
              // 标准材料与实际材料均为空集时，diffMaterials不做任何操作
            } else {
              // 添加标准材料
              for (let j = 0; j < materials.length; j++) {
                diffMaterials.push(this.wrapperMaterial(materials[j]))
              }
              // 添加实际材料
              for (let j = 0; j < realMaterials.length; j++) {
                diffMaterials.push(this.wrapperRealMaterial(realMaterials[j]))
              }
            }
          }
        }

        let newProcess = {
          name: process.procedureName, // 工序名称
          materials: [...sameMaterials, ...diffMaterials], // 标准材料和实际材料都存在
          staffCosts: process.staffCosts, // 人工：标准费用
          costsExceedScope: process.costsExceedScope + '%', // 人工：允许超出范围
          actualStaffCosts: process.actualStaffCosts, // 人工：实际费用
          actualStaffCostsExceedScope: process.actualStaffCostsExceedScope * 100 + '%', // 人工：实际超出范围
          status: process.exceedFlag // 1：正常，2：材料超标，3：人工费用超标，4：材料和人工费用均超标(双超标)
        }
        processList.push(newProcess)
      }

      // console.log(processList)
      return processList
    },
    // 材料数据包装(标准材料和实际材料都存在时，进行合并包装)
    wrapperMaterialAndRealMaterial(material, realMaterial) {
      return {
        id: material.materialId,
        name:
          material.code +
          '-' +
          material.name +
          '-' +
          material.models +
          '-' +
          material.brand +
          '-' +
          material.supplier +
          '-' +
          (material.type === 1 ? '甲供' : '自购'), // 材料全称
        dosage: material.dosage + material.unit, // 标准用量+单位名称
        materialExceedScope: material.materialExceedScope + '%', // 允许超出范围
        realDosage: realMaterial.dosage + realMaterial.unit, // 实际用量+单位名称
        realMaterialExceedScope: realMaterial.materialExceedScope * 100 + '%', // 实际超出范围
        singleMaterialExceedFlag: realMaterial.singleMaterialExceedFlag // 单个材料是否超标(true：超标  false：未超标)
      }
    },
    // 材料数据包装(仅包装标准材料)
    wrapperMaterial(material) {
      return {
        id: material.materialId,
        name:
          material.code +
          '-' +
          material.name +
          '-' +
          material.models +
          '-' +
          material.brand +
          '-' +
          material.supplier +
          '-' +
          (material.type === 1 ? '甲供' : '自购'), // 材料全称
        dosage: material.dosage + material.unit, // 标准用量+单位名称
        materialExceedScope: material.materialExceedScope + '%', // 允许超出范围
        realDosage: '-', // 实际用量+单位名称
        realMaterialExceedScope: '-' // 实际超出范围
      }
    },
    // 材料数据包装(仅包装实际材料)
    wrapperRealMaterial(realMaterial) {
      return {
        id: realMaterial.materialId,
        name:
          realMaterial.code +
          '-' +
          realMaterial.name +
          '-' +
          realMaterial.models +
          '-' +
          realMaterial.brand +
          '-' +
          realMaterial.supplier +
          '-' +
          (realMaterial.type === 1 ? '甲供' : '自购'), // 材料全称
        dosage: '-', // 标准用量+单位名称
        materialExceedScope: '-', // 允许超出范围
        realDosage: realMaterial.dosage + realMaterial.unit, // 实际用量+单位名称
        realMaterialExceedScope: realMaterial.materialExceedScope * 100 + '%', // 实际超出范围
        singleMaterialExceedFlag: realMaterial.singleMaterialExceedFlag // 单个材料是否超标(true：超标  false：未超标)
      }
    },
    // 过滤是否超标
    handleFilter(status) {
      this.status = status
      if (status) {
        this.list = this.oldProcessList.filter(item => item.status === status)
      } else {
        this.list = this.oldProcessList
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/list.less';
.radio-con {
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 0px 20px;
  margin-bottom: 20px;
  .radio-item {
    color: #454545;
    background: rgba(223, 223, 223, 0.7);
    padding: 12px 20px;
    text-align: center;
  }
  .active {
    color: #3558c8;
    background: #c5d2fc;
  }
}

.card-info {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    .titleText {
      font-weight: bold;
      color: #333333;
      width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .material {
    display: flex;
    line-height: 40px;
    margin-bottom: 16px;
    .titleText {
      flex: 0 0 138px;
    }
    .info {
      flex: 1;
      .info-name {
        color: #333333;
      }
      .info-text {
        display: flex;
        > view {
          flex: 1;
        }
        .normal-color {
          color: #333333;
        }
        .red-color {
          color: red;
        }
      }
    }
  }
  .artificial {
    display: flex;
    line-height: 40px;
    .titleText {
      flex: 0 0 138px;
    }
    .info {
      flex: 1;
      .info-text {
        display: flex;
        > view {
          flex: 1;
        }
        .normal-color {
          color: #333333;
        }
        .red-color {
          color: red;
        }
      }
    }
  }
}
.page-bottom {
  height: 30px;
}
</style>
