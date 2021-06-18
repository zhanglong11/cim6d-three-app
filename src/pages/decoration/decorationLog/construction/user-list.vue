<template>
  <view class="main">
    <div class="filter">
      <div class="line">
        <div style="width: 400rpx">
          <uni-search-bar
            ref="search"
            placeholder="人员卡号/姓名"
            @confirm="handleSearchBarConfirm"
            @input="handleSearchBarInput"
            @change="handleSearchBarChange"
          ></uni-search-bar>
        </div>
        <div class="work-type">
          <span class="common-label">工种:</span>
          <span class="is-picker">
            <div style="width: 100%">
              <uni-select v-model="filterForm.workType" placeholder="请选择工种" :options="workType"> </uni-select>
            </div>
            <div class="form-link"></div>
          </span>
        </div>
      </div>
      <div class="line">
        <div class="company-group">
          <span class="common-label">所属劳务公司及班组:</span>
          <span class="is-picker">
            <div style="width: 100%">
              <uni-select v-model="filterForm.labourCompanyId" placeholder="请选择公司" :options="companyList">
              </uni-select>
            </div>
            <div class="form-link"></div>
          </span>
          <span class="is-picker">
            <div style="width: 100%">
              <uni-select v-model="filterForm.groupId" placeholder="请选择工种" :options="groupList"> </uni-select>
            </div>
            <div class="form-link"></div>
          </span>
        </div>
      </div>
      <div class="line">
        <span class="common-button" type="primary" @click="init">搜索</span>
        <span class="common-button" @click="reset">重置</span>
      </div>
    </div>

    <scroll-view v-if="total" class="scroll-roll pd20" scroll-y>
      <view class="main-body">
        <checkbox-group>
          <uni-card v-for="item in list" :key="item.id" isHover @click="changeBox(item)">
            <view class="card-body">
              <checkbox :value="item.id" :checked="item.checked" />
              <view class="card-info">
                <!-- <view class="title flex-item">{{ item.name }}</view>
                <view class="flex-item">
                  <view class="flex-item-label">材料编码：</view>
                  <view class="flex-item-content">{{ item.code }}</view>
                </view>
                <view class="flex-item">
                  <view class="flex-item-label">品牌：</view>
                  <view class="flex-item-content">{{ item.brand }}</view>
                </view>-->
                <view class="line">
                  <span>{{ item.cardNumber }}</span>
                  <span>{{ item.name }}</span>
                  <span> {{ $getLabel(workType, item.workType) }}</span>
                  <span>{{ item.labourCompanyName }}</span>
                  <span>{{ item.groupName }}</span>
                </view>
              </view>
            </view>
          </uni-card>
        </checkbox-group>
      </view>
    </scroll-view>

    <EmptyTemplate v-if="total === 0" />
    <view class="btn-wrapper drawer-fix-btn">
      <button v-if="hasClose" class="button default" @click="close">返回</button>
      <button class="button" type="primary" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from './api'
import _ from 'lodash'
import treeFind from '@/utils/treeFind'
export default {
  name: 'UserList',
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
    }
  },
  data() {
    return {
      filterForm: {
        content: '',
        workType: '',
        labourCompanyId: '',
        groupId: '',
        page: 1,
        rows: 999, //一次性加载全部数据，避免打开窗口时无法渲染选中项
        projectId: wx.getStorageSync('projectId')
      },
      companyList: [],
      groupList: [],
      loading: false,
      list: [],
      total: 0,
      checkedValue: [],
      disabledList: this.disabledIds || [] // 禁用的列表
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    workType() {
      return this.$getArgList('workType') || []
    }
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
    },
    'filterForm.labourCompanyId': {
      deep: true,
      immediate: false,
      handler(val) {
        if (!val) {
          return
        }
        let selectCompany = treeFind(this.companyList, item => {
          return item.id === val
        })
        this.groupList = selectCompany.children.map(item => {
          return {
            id: item.id,
            value: item.id,
            name: item.name,
            label: item.name
          }
        })
      }
    }
  },
  created() {
    this.getCompanyGroupList()
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
      Api.getPersonList(data).then(res => {
        let datas = res.data
        let list = datas.records || []
        list.map(e => {
          e.checked = this.checkedValue.length > 0 && this.checkedValue.includes(e.id)
        })
        this.list = list.filter(e => !this.disabledList.includes(e.id))
        this.total = datas.total
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    reset() {
      this.filterForm = {}
      this.$refs.search.clear()
      this.init()
    },
    //获取公司小组列表
    async getCompanyGroupList() {
      let res = await Api.getCompanyGroupList({})
      this.companyList =
        res.data &&
        res.data.map(item => {
          return {
            id: item.id,
            value: item.id,
            name: item.name,
            label: item.name,
            children: item.groupList || []
          }
        })
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.content = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.content = ''
      this.init()
    },
    //输入是
    handleSearchBarChange(e) {
      this.filterForm.content = e.value.trim()
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
      // console.log(this.list)
      checked = this.list.filter(item => this.checkedValue.includes(item.id))
      // console.log('checked',checked)
      this.$emit('selected', {
        checkedValue: this.checkedValue,
        checked
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
@import url('user-list.less');
.pd20 {
  padding-bottom: 20rpx;
}
.drawer-fix-btn {
  bottom: 30rpx;
}
</style>
