<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view class="card">
          <uni-form-item label="领料单编号" isCell>
            {{ info.code }}
          </uni-form-item>
          <uni-form-item label="领料申请人" isCell>
            {{ info.creatorName }}
          </uni-form-item>
          <uni-form-item label="领料申请时间" isCell>
            {{ info.createTime }}
          </uni-form-item>
        </view>
        <!-- 领料内容 start -->
        <uni-title v-if="info.contents && info.contents.length > 0" title="领料内容"></uni-title>
        <template v-for="(item, index) of info.contents || []">
          <uni-card :key="index">
            <uni-form-item label="材料编号" isCell align="left"> {{ item.code }}</uni-form-item>
            <uni-form-item label="材料名称" isCell align="left"> {{ item.name }}</uni-form-item>
            <uni-form-item label="材料型号" isCell align="left"> {{ item.models }}</uni-form-item>
            <uni-form-item label="材料品牌" isCell align="left"> {{ item.brand }}</uni-form-item>
            <uni-form-item label="供应商" isCell align="left"> {{ item.supplier }}</uni-form-item>
            <uni-form-item label="材料类型" isCell align="left">
              {{ $getLabel(materialTypeList, item.type) }}</uni-form-item
            >
            <uni-form-item label="领取数量" isCell align="left"> {{ item.number }} {{ item.unit }} </uni-form-item>
          </uni-card>
        </template>
        <!-- 领料内容 end -->
        <!-- 使用位置 start -->
        <uni-title v-if="info.places && info.places.length > 0" title="使用位置"></uni-title>
        <uni-card v-if="info.places && info.places.length > 0">
          <template v-for="(item, index) of info.places || []">
            <uni-form-item :key="'label' + index" :label="`使用位置${index + 1}`" isCell align="left">
              {{ item.buildingName }} / {{ item.unitsName }}/ {{ item.floorName }} /
              {{ item.roomName }}
            </uni-form-item>
          </template>
        </uni-card>
        <!-- 使用位置 end -->
        <!-- 通用审批 start -->
        <uni-common-check-flow :id="id" />
        <!-- 通用审批 end -->
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
import { mapGetters } from 'vuex'
import materialTypeList from './lib/materialTypeList'
import UniCard from '../../../../components/uni-card/uni-card.vue'
export default {
  name: 'DecorationMaterialPickDetail',
  components: { UniCard },
  data() {
    return {
      materialTypeList,
      info: {
        contents: [],
        places: []
      },
      id: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.getDetail()
  },
  onShow() {},
  mounted() {},
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getMaterialPickDetail(this.id)
      this.info = {
        ...res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
@import url('./detail.less');
</style>
