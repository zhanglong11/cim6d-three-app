<template>
  <div>
    <view class="label" :class="{ placeholder: !areaText }" @click="show">
      <span>{{ areaText || placeholder }}</span>
    </view>
    <w-picker
      ref="regionRef"
      mode="region"
      :value="computedValue"
      defaultType="value"
      @confirm="onChange"
      @change="onChange"
    ></w-picker>
  </div>
</template>

<script>
// 地区选择组件
import wPicker from '@/components/w-picker/w-picker'
export default {
  name: 'UniPicker',
  components: { wPicker },
  props: {
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
      type: String,
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
      this.areaText = e.result
      this.$emit('change', e.value[2])
    },
    show() {
      if (this.disabled) {
        return
      }
      this.$refs.regionRef.show()
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
