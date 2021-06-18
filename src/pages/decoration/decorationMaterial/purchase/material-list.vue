<template>
  <view class="main">
    <div class="filter">
      <div class="line">
        <uni-search-bar
          ref="search"
          placeholder="材料编码/材料名称/品牌"
          @confirm="handleSearchBarConfirm"
          @input="handleSearchBarInput"
          @change="handleSearchBarConfirm"
        ></uni-search-bar>
      </div>
      <div class="line">
        <span class="common-button" type="primary" @click="init">搜索</span>
        <span class="common-button" @click="reset">重置</span>
      </div>
    </div>

    <scroll-view v-if="total" class="scroll-roll" scroll-y>
      <view class="main-body">
        <checkbox-group>
          <uni-card v-for="item in list" :key="item.id" isHover @click="changeBox(item)">
            <view class="card-body">
              <checkbox :value="item.id" :checked="item.checked" />
              <view class="card-info">
                <view class="line">
                  <span>{{ item.code }}</span>
                  <span>{{ item.name }}</span>
                  <span>{{ item.models }}</span>
                  <span>{{ item.brand }}</span>
                  <span>{{ item.supplier }}</span>
                  <span> {{ $getLabel(materialTypeList, item.type) }}</span>
                </view>
              </view>
            </view>
          </uni-card>
        </checkbox-group>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />

    <view class="btn-wrapper">
      <button v-if="hasClose" class="button default" @click="close">返回</button>
      <button class="button" type="primary" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from './api'
import _ from 'lodash'
import materialTypeList from './lib/materialTypeList'
export default {
  name: 'MaterialList',
  props: {
    // 选中的ids
    checked: {
      type: Array,
      default() {
        return []
      }
    },
    // 禁止选择或隐藏的ids
    disabledIds: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否显示返回按钮
    hasClose: {
      type: Boolean,
      default: false
    },
    // 是否可以不选择
    hasChoice: {
      type: Boolean,
      default: false
    },
    materialType: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      materialTypeList,
      filterForm: {
        keyword: '',
        type: this.materialType,
        page: 1,
        rows: 999, //一次性加载全部数据，避免打开窗口时无法渲染选中项
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      checkedValue: [],
      disabledList: this.disabledIds || [] // 禁用的列表
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    checked(val) {
      this.checkedValue = [...val]
      this.list.map(e => {
        e.checked = this.checkedValue.length > 0 && this.checkedValue.includes(e.id)
      })
    },
    disabledIds(val) {
      this.disabledList = val
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
    this.checkedValue = [...this.checked]
  },
  mounted() {
    this.init()
  },

  methods: {
    refresh: _.debounce(async function () {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.getStoreListAll(data).then(res => {
        let list = res.data || []
        list.map(e => {
          e.checked = this.checkedValue.length > 0 && this.checkedValue.includes(e.id)
        })
        this.list = list.filter(e => !this.disabledList.includes(e.id))
        this.total = list.length || 0
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    reset() {
      this.filterForm = { type: this.materialType }
      this.$refs.search.clear()
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    // 选中或取消选中复选框时
    checkboxChange(event) {
      this.checkedValue = event.detail.value
    },
    // 选择
    changeBox(item) {
      let index = this.checkedValue.indexOf(item.id)
      if (index < 0) {
        this.checkedValue.push(item.id)
      } else {
        this.checkedValue.splice(index, 1)
      }
      item.checked = !item.checked
    },
    handleSubmit() {
      if (this.checkedValue.length === 0 && !this.hasChoice) {
        this.$utils.showToast('当前没有选中项')
        return
      }
      let checked = []
      checked = this.list.filter(item => this.checkedValue.includes(item.id))
      let transRow = checked.map(item => {
        return {
          materialId: item.id,
          ...item,
          purchaseNumber: 0
        }
      })
      this.$emit('selected', {
        checkedValue: this.checkedValue,
        transRow
      })
    },
    // 返回
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('material-list.less');
</style>
