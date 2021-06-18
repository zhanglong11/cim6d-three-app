<template>
  <div>
    <view class="label" :class="{ placeholder: !text }" @click="show">
      <span>{{ text || placeholder }}</span>
      <!--      <uni-icons type="arrowright" color="#999"></uni-icons>-->
    </view>
    <w-picker
      ref="date"
      :fields="fields"
      mode="range"
      :value="computedValue"
      :end-year="2040"
      @confirm="change"
    ></w-picker>
  </div>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker'
export default {
  name: 'UniPicker',
  components: { wPicker },
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    fields: {
      type: String,
      default: 'day'
    },
    startDate: {
      type: String,
      default: null
    },
    endDate: {
      type: String,
      default: null
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    text() {
      if (this.computedValue[0]) {
        return this.computedValue.join(' ~ ')
      } else {
        return null
      }
    },
    computedValue() {
      return [this.startDate, this.endDate].map(date => (date ? date.slice(0, 10) : null))
    }
  },
  methods: {
    change(e) {
      let value = e.value
      const [startDate, endDate] = value.split('至').map((date, index) => {
        if (this.fields !== 'day') {
          if (index === 0) {
            return date + ' 00:00:00'
          } else if (index === 1) {
            return date + ' 23:59:59'
          }
        } else {
          return date
        }
      })
      this.$emit('input', [startDate, endDate])
      this.$emit('update:startDate', startDate)
      this.$emit('update:endDate', endDate)
    },
    show() {
      if (this.disabled) {
        return
      }
      this.$refs.date.show()
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
