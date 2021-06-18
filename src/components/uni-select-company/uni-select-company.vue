<template>
  <div>
    <view class="label" :class="{ placeholder: !areaText }" @click="show">
      <span>{{ areaText || placeholder }}</span>
    </view>
    <w-picker
      ref="linkageRef"
      :mode="isDepartment ? 'linkage' : 'selector'"
      :value="computedValue"
      defaultType="value"
      :options="options"
      @confirm="onChange"
      @change="onChange"
    ></w-picker>
  </div>
</template>

<script>
// 选择公司或部门
import wPicker from '@/components/w-picker/w-picker'
export default {
  name: 'UniPicker',
  components: { wPicker },
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否选择部门
    isDepartment: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array, Object],
      default: ''
    }
  },
  data() {
    return {
      areaText: '',
      computedValue: this.value
    }
  },
  methods: {
    onChange(e) {
      if (!e.obj.show) {
        return
      }
      this.areaText = e.result
      let value = this.isDepartment ? e.value[e.value.length - 1] : e.value
      this.$emit('change', value)
    },
    show() {
      if (this.disabled) {
        return
      }
      this.$refs.linkageRef.show()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.placeholder {
  color: @placeholderColor;
}
.label {
  display: flex;
  align-items: center;
  span {
    flex: 1;
  }
}
</style>
