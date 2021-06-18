<template>
  <uni-form-item
    :label="itemData.name"
    :noLobel="noLobel || !!labelAlign()"
    :isRequired="itemData.options.required"
    :disabled="disabled || itemData.options.disabled"
    :labelAlign="labelAlign()"
    align="left"
    :isLink="showLink()"
    :prop="itemData.model"
    :class="{ 'file-item': itemData.el === 'uploadImage' || itemData.el === 'uploadFile' }"
  >
    <!-- 扩展组件渲染 start -->
    <template v-if="itemData.type === 'custom'">
      <!-- 审核结果 start -->
      <template v-if="itemData.el === 'flag'">
        <radio-group class="radio-group item-flag" @change="onChange">
          <label class="item-radio">
            <view>
              <radio value="1" :checked="formValue === '1'" />
            </view>
            <view>通过</view>
          </label>
          <label class="item-radio">
            <view>
              <radio value="2" :checked="formValue === '2'" />
            </view>
            <view>驳回</view>
          </label>
        </radio-group>
      </template>
      <!-- 审核结果 end -->

      <!-- 审核意见 start -->
      <template v-if="itemData.el === 'remark'">
        <textarea
          v-model.trim="formValue"
          auto-height
          isWorkForm
          :placeholder="itemData.options.placeholder"
          @blur="onChange"
        />
      </template>
      <!-- 审核意见 end -->

      <!-- 附件 start -->
      <template v-if="itemData.el === 'uploadFile'">
        <uni-attachment
          v-model.trim="formValue"
          isWorkForm
          :edit="!disabled"
          isAll
          @change="onChangeDate"
        ></uni-attachment>
      </template>
      <!-- 附件 end -->

      <!-- 图片 start -->
      <template v-if="itemData.el === 'uploadImage'">
        <uni-attachment
          v-model.trim="formValue"
          isWorkForm
          uploadType="image"
          :edit="!disabled"
          isAll
          @change="onChangeDate"
        ></uni-attachment>
      </template>
      <!-- 图片 end -->

      <!-- 省-市-区 start -->
      <template v-if="itemData.el === 'areaSelect'">
        <uni-select-area v-model.trim="formValue" :placeholder="itemData.options.placeholder" @change="onChangeDate" />
      </template>
      <!-- 省-市-区 end -->

      <!-- 联系人 start -->
      <template v-if="itemData.el === 'contacts'">
        <uni-select-user v-model.trim="formValue" :placeholder="itemData.options.placeholder" @change="onChangeUser" />
      </template>
      <!-- 联系人 end -->

      <!-- 所属公司 start -->
      <template v-if="itemData.el === 'company'">
        <uni-select-company
          v-model.trim="formValue"
          :options="companyList"
          :placeholder="itemData.options.placeholder"
          @change="onChangeDate"
        />
      </template>
      <!-- 所属公司 end -->

      <!-- 所属公司及部门 start -->
      <template v-if="itemData.el === 'companyDepartments'">
        <uni-select-company
          v-model.trim="formValue"
          :options="companyList"
          isDepartment
          :placeholder="itemData.options.placeholder"
          @change="onChangeDate"
        />
      </template>
      <!-- 所属公司及部门 end -->
    </template>
    <!-- 扩展组件渲染 end -->

    <!-- 单行文本 start -->
    <template v-if="itemData.type === 'input'">
      <input v-model.trim="formValue" :placeholder="itemData.options.placeholder" @blur="onChange" />
    </template>
    <!-- 单行文本 end -->

    <!-- 多行文本 start -->
    <template v-if="itemData.type === 'textarea'">
      <textarea v-model.trim="formValue" auto-height :placeholder="itemData.options.placeholder" @blur="onChange" />
    </template>
    <!-- 多行文本 end -->

    <!-- 计数器 start -->
    <template v-if="itemData.type === 'number'">
      <input v-model.trim="formValue" type="number" :placeholder="itemData.options.placeholder" @blur="onChange" />
    </template>
    <!-- 计数器 end -->

    <!-- 单选框组 start -->
    <template v-if="itemData.type === 'radio'">
      <radio-group @change="onChange">
        <label v-for="(item, i) in itemData.options.options" :key="i" class="item-radio">
          <view>
            <radio :value="item.value" :checked="item.value === formValue" />
          </view>
          <view>{{ item.value }}</view>
        </label>
      </radio-group>
    </template>
    <!-- 单选框组 end -->

    <!-- 多选框组 start -->
    <template v-if="itemData.type === 'checkbox'">
      <checkbox-group @change="onChange">
        <label v-for="(item, i) in itemData.options.options" :key="i" class="item-radio">
          <checkbox :value="item.value" :checked="formValue.includes(item.value)" />
          {{ item.value }}
        </label>
      </checkbox-group>
    </template>
    <!-- 多选框组 end -->

    <!-- 日期 start -->
    <template v-if="itemData.type === 'date'">
      <uni-date-range
        v-if="
          itemData.options.type === 'dates' ||
          itemData.options.type === 'daterange' ||
          itemData.options.type === 'datetimerange'
        "
        :value="formValue"
        valueFormat=""
        :fields="getFields(itemData.options.type)"
        mode="date"
        :startDate.sync="startDate"
        :endDate.sync="endDate"
        :placeholder="itemData.options.placeholder || '请选择'"
        @input="onChangeDate"
      />
      <uni-date-picker
        v-else
        :value="formValue"
        valueFormat=""
        :fields="getFields(itemData.options.type)"
        mode="date"
        :placeholder="itemData.options.placeholder || '请选择'"
        @input="onChangeDate"
      />
    </template>
    <!-- 日期 end -->

    <!-- 时间 start -->
    <template v-if="itemData.type === 'time'">
      <uni-date-picker
        :value="formValue"
        valueFormat=""
        mode="time"
        :placeholder="itemData.options.placeholder || '请选择'"
        @input="onChangeDate"
      />
    </template>
    <!-- 时间 end -->

    <!-- 评分 start -->
    <template v-if="itemData.type === 'rate'">
      <uni-rate :value="formValue" :allowHalf="itemData.options.allowHalf" @input="onChangeDate" />
    </template>
    <!-- 评分 end -->

    <!-- 下拉选择框 start -->
    <template v-if="itemData.type === 'select'">
      <uni-select
        v-model.trim="formValue"
        :options="selectOptions(itemData.options.options)"
        :placeholder="itemData.options.placeholder || '请选择'"
        @input="onChangeDate"
      />
    </template>
    <!-- 下拉选择框 end -->

    <!-- 开关 start -->
    <template v-if="itemData.type === 'switch'">
      <switch :checked="!!formValue" @change="onChange" />
    </template>
    <!-- 开关 end -->

    <!-- 滑块 start -->
    <template v-if="itemData.type === 'slider'">
      <slider :value="formValue" show-value @change="onChange" />
    </template>
    <!-- 滑块 end -->

    <!-- 文字 start -->
    <template v-if="itemData.type === 'text'">
      {{ formValue }}
    </template>
    <!-- 文字 end -->

    <!-- 子表单 start -->
    <template v-if="itemData.type === 'table'">
      <Table
        :data="formValue"
        :columns="itemData.tableColumns"
        :disabled="disabled || itemData.options.disabled"
        @change="onChangeDate"
      />
    </template>
    <!-- 子表单 end -->

    <!-- 栅格布局 start -->
    <template v-if="itemData.type === 'grid'">
      <Grid :data="formValue" :columns="itemData.columns" @change="onChangeDate" />
    </template>
    <!-- 栅格布局 end -->

    <!-- 表格布局 start -->
    <template v-if="itemData.type === 'report'">
      <Report :data="formValue" :columns="itemData.rows" @change="onChangeDate" />
    </template>
    <!-- 表格布局 end -->

    <!-- 标签页 start -->
    <template v-if="itemData.type === 'tabs'">
      <Tabs :data="formValue" :columns="itemData.tabs" @change="onChangeDate" />
    </template>
    <!-- 标签页 end -->

    <!-- 分割线 start -->
    <template v-if="itemData.type === 'divider'">
      <div class="load-divider" :class="itemData.options.contentPosition">
        <p v-text="itemData.name"></p>
      </div>
    </template>
    <!-- 分割线 end -->
  </uni-form-item>
</template>

<script>
import Table from './table' // table表单
import Grid from './grid' // 栅格布局
import Report from './report' // 表格布局
import Tabs from './tabs' // 标签页
export default {
  name: 'WorkFlowItem',
  components: {
    Table,
    Grid,
    Report,
    Tabs
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 禁用左侧标签
    noLobel: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      formValue: this.itemData.options.defaultValue, // 7322104702322279
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    companyList() {
      return this.$store.state.project.companyList
    }
  },
  watch: {
    itemData(val) {
      this.formValue = val
    }
  },
  //方法集合
  methods: {
    // 是否显示箭头
    showLink() {
      let linkList = ['areaSelect', 'contacts', 'company', 'companyDepartments', 'date', 'time', 'select']
      let str = this.itemData.type === 'custom' ? this.itemData.el : this.itemData.type
      return linkList.includes(str)
    },
    // 文字位置
    labelAlign() {
      let list = ['table', 'grid', 'report', 'tabs', 'divider']
      let str = this.itemData.type === 'custom' ? this.itemData.el : this.itemData.type
      if (list.includes(str)) {
        return 'noLabel'
      } else {
        return ''
      }
    },
    // 处理日期类型
    getFields(type) {
      let fields = 'day'
      switch (type) {
        case 'year':
          fields = 'year'
          break
        case 'month':
          fields = 'month'
          break
        case 'date':
          fields = 'day'
          break
        case 'datetime':
          fields = 'second'
          break
        case 'datetimerange':
          fields = 'second'
          break
        default:
          fields = 'day'
      }
      return fields
    },
    // 处理下拉列表数据，防止空label
    selectOptions(options) {
      let list = []
      options.map(e => {
        list.push({
          label: e.label || e.value,
          value: e.value
        })
      })
      return list
    },
    // 数据改变
    onChange(e) {
      // console.log('数据改变', e)
      let value = e.detail.value
      this.formValue = value
      this.changeParent(value)
    },
    // 特殊格式
    onChangeDate(e) {
      // console.log('特殊格式', e)
      this.formValue = e
      this.changeParent(e)
    },
    // 选择人员
    onChangeUser(e) {
      // console.log('选择人员', e)
      this.formValue = e.userId
      this.changeParent(e.userId)
    },
    // 改变父级数据
    changeParent(e) {
      let params = Object.assign({}, this.itemData)
      params.options.defaultValue = e
      this.$emit('update:itemData', params)
      this.$emit('change', params)
    }
  }
}
</script>
<style lang="less" scoped>
.item-radio {
  margin: 6px 0;
  display: flex;
  align-items: center;
  /deep/uni-radio {
    margin-right: 10px;
  }
}
.item-flag {
  display: flex;
  align-items: center;
  .item-radio {
    margin-right: 20px;
  }
}
.load-divider {
  padding-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  &.left {
    &:before {
      width: 40px;
      flex: inherit;
    }
  }
  &.right {
    &:after {
      width: 40px;
      flex: inherit;
    }
  }
  &:before,
  &:after {
    content: '';
    height: 2rpx;
    border-bottom: 2rpx rgba(0, 0, 0, 0.05) dashed;
    flex: 1;
  }
  p {
    margin: 0 20rpx;
    font-size: 12px;
    color: #ccc;
  }
}
</style>
