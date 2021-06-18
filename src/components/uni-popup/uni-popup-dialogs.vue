<template>
  <view class="uni-popup-dialog" :style="{ width: width + 'px' }">
    <view class="uni-dialog-title">
      <text class="uni-dialog-title-text" :class="['uni-popup__' + dialogType]">{{ title }}</text>
    </view>
    <view class="uni-dialog-content">
      <view v-for="(item, index) of content" :key="index" class="desc">
        <view @click="onOk(item)">{{ item.label }}</view>
      </view>
    </view>
    <view class="uni-dialog-button-group">
      <view class="uni-dialog-button" @click="close">
        <text class="uni-dialog-button-text">关闭</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniPopupDialogs',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: [String, Number],
      default: '请输入内容'
    },
    width: {
      //图标宽度
      type: Number,
      default: 150
    },
    /**
     * 对话框主题 success/warning/info/error	  默认 success
     */
    type: {
      type: String,
      default: 'error'
    },
    /**
     * 对话框模式 base/input
     */
    mode: {
      type: String,
      default: 'base'
    },
    /**
     * 对话框标题
     */
    title: {
      type: String,
      default: '提示'
    },
    /**
     * 对话框内容
     */
    content: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
     */
    beforeClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogType: 'error',
      focus: false,
      val: ''
    }
  },
  inject: ['popup'],
  watch: {
    type(val) {
      this.dialogType = val
    },
    mode(val) {
      if (val === 'input') {
        this.dialogType = 'info'
      }
    },
    value(val) {
      this.val = val
    }
  },
  created() {
    // 对话框遮罩不可点击
    this.popup.mkclick = false
    if (this.mode === 'input') {
      this.dialogType = 'info'
      this.val = this.value
    } else {
      this.dialogType = this.type
    }
  },
  mounted() {
    this.focus = true
  },
  methods: {
    /**
     * 点击确认按钮
     */
    onOk(e) {
      this.$emit('confirm', e.value)
      this.popup.close()
    },
    /**
     * 点击取消按钮
     */
    close() {
      if (this.beforeClose) {
        this.$emit('close', () => {
          this.popup.close()
        })
        return
      }
      this.popup.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-popup-dialog {
  // width: 400px;
  border-radius: 15px;
  background-color: #fff;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding: 15px 0;
}

.uni-dialog-title-text {
  font-size: 16px;
  font-weight: 500;
}

.uni-dialog-content {
  font-size: 14px;
  .desc {
    display: block;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid #ccc;
  }
}

.uni-dialog-content-text {
  font-size: 14px;
  color: #6e6e6e;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #ccc;
  border-top-style: solid;
  border-top-width: 1px;
  padding: 10px 0;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */

  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 58px;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: 14px;
}

.uni-button-color {
  color: $uni-color-primary;
}

.uni-dialog-input {
  flex: 1;
  font-size: 14px;
}

.uni-popup__success {
  color: $uni-color-success;
}

.uni-popup__warn {
  color: $uni-color-warning;
}

.uni-popup__error {
  color: $uni-color-error;
}

.uni-popup__info {
  color: #909399;
}
</style>
