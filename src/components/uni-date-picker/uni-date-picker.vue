<template>
  <div>
    <view class="label" :class="{ placeholder: !Boolean(text) }" @click="show">
      <slot>
        <span>{{ newText || text || placeholder }}</span>
      </slot>
      <!--      <uni-icons type="arrowright" color="#999"></uni-icons>-->
    </view>
    <w-picker
      ref="date"
      :startYear="startYear"
      :endYear="endYear"
      :fields="fields"
      :mode="mode"
      :value="computedValue"
      @confirm="change"
    >
    </w-picker>
  </div>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker'
import moment from 'moment'
export default {
  name: 'UniPicker',
  components: { wPicker },
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    mode: {
      type: String,
      default: 'date'
    },
    value: {
      default: null
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    fields: {
      type: String,
      default: 'day'
    },
    startYear: {
      default: 1920
    },
    endYear: {
      default: 2030
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newText: null
    }
  },
  computed: {
    text() {
      if (this.value) {
        if (this.mode === 'range') {
          return this.value.join(' ~ ')
        }
        if (this.fields === 'day') {
          return this.value.slice(0, 10)
        } else if (this.fields === 'minute') {
          return this.value.slice(0, 16)
        } else if (this.fields === 'month') {
          return this.value.slice(0, 7)
        } else if (this.fields === 'year') {
          return this.value.slice(0, 4)
        } else {
          return this.value
        }
      } else {
        return null
      }
    },
    computedValue() {
      if (this.value) {
        if (this.fields === 'day') {
          return this.value.slice(0, 10)
        } else if (this.fields === 'minute') {
          return this.value.slice(0, 16)
        } else if (this.fields === 'month') {
          return this.value.slice(0, 7)
        } else if (this.fields === 'year') {
          return this.value.slice(0, 4)
        } else {
          return this.value
        }
      } else {
        return null
      }
    }
  },
  methods: {
    change(e) {
      let value = e.value
      if (this.valueFormat && this.mode !== 'range') {
        value = moment(value).format(this.valueFormat)
      }
      if (this.mode === 'range') {
        const [startDate, endDate] = value.split('至').map((date, index) => {
          if (index === 0) {
            if (this.valueFormat === 'YYYY-MM-DD') {
              return date
            } else {
              return date + ' 00:00:00'
            }
          } else if (index === 1) {
            if (this.valueFormat === 'YYYY-MM-DD') {
              return date
            } else {
              return date + ' 00:00:00'
            }
          }
        })
        this.$emit('input', [startDate, endDate])
        this.$emit('update:startDate', startDate)
        this.$emit('update:endDate', endDate)
      } else {
        this.$emit('input', value)
        this.$emit('change', value)
      }
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
