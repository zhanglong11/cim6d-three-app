<template>
  <view class="uni-popup-dialog">
    <view class="uni-dialog-title">
      <text class="uni-dialog-title-text" :class="['uni-popup__' + type]">{{ title }}</text>
    </view>
    <view class="uni-dialog-content">
      <slot></slot>
    </view>
    <view class="uni-dialog-button-group">
      <view class="uni-dialog-button" @click="close">
        <text class="uni-dialog-button-text">{{ cancelBtnText }}</text>
      </view>
      <view class="uni-dialog-button uni-border-left" @click="onOk">
        <text class="uni-dialog-button-text uni-button-color">{{ okBtnText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniPopupDialog',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    /**
     * 对话框标题
     */
    title: {
      type: String,
      default: '提示'
    },
    /**
     * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
     */
    beforeClose: {
      type: Boolean,
      default: false
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    okBtnText: {
      type: String,
      default: '确定'
    }
  },
  data() {
    return {}
  },
  inject: ['popup'],
  created() {
    // 对话框遮罩不可点击
    this.popup.mkclick = false
  },
  methods: {
    /**
     * 点击确认按钮
     */
    onOk() {
      this.$emit('confirm', () => {
        this.popup.close()
      })
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
  width: 100%;
  border-radius: 15px;
  background-color: #fff;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding: 1em 1.6em 0.3em;
  font-weight: 400;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: center;
}

/*.uni-dialog-title-text {*/
/*  font-size: 16px;*/
/*  font-weight: 500;*/
/*}*/

.uni-dialog-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px 15px 15px;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */

  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  font-size: 18px;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-button-color {
  color: #007aff;
}

.uni-dialog-input {
  flex: 1;
  font-size: 14px;
}

.popup__success {
  color: #fff;
  background-color: #4cd964;
}

.popup__warn {
  color: #fff;
  background-color: #f0ad4e;
}

.popup__error {
  color: #fff;
  background-color: #dd524d;
}

.popup__info {
  color: #fff;
  background-color: #909399;
}
</style>
