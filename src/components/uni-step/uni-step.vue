<template>
  <view class="uni-steps">
    <view class="uni-steps__column">
      <view class="uni-steps__column-text-container">
        <view v-for="(item, index) in options" :key="index" class="uni-steps__column-text">
          <text style="color: #999">{{
            item.title ? ['上班打卡时间:', '下班打卡时间:'][index] + item.title : '暂无信息'
          }}</text>
          <text style="color: #999" class="uni-steps__column-desc">{{
            item.desc ? '打卡时间：' + item.desc : ''
          }}</text>
          <text style="color: #999" class="uni-steps__column-desc">{{ item.address }}</text>

          <view>
            <view v-if="item.lateRemark">
              {{ item.lateRemark }}
            </view>
            <view v-else>
              <view
                v-if="item.workClockInStatus === 2 && item.desc"
                class="colck-update"
                @click="getUpdate('lateRemark')"
                >{{ item.lateFlag ? '迟到' : '' }}备注
              </view>
            </view>
          </view>
          <view>
            <view v-if="item.leaveEarlyRemark">{{ item.leaveEarlyRemark }}</view>
            <view v-else>
              <view
                v-if="item.offDutyClockInStatus === 2 && item.desc"
                class="colck-update"
                @click="getUpdate('leaveEarlyRemark')"
                >{{ item.leaveEarlyFlag ? '早退' : '' }}备注{{ item.leaveEarlyRemark }}</view
              >
            </view>
          </view>
        </view>
      </view>
      <view class="uni-steps__column-container">
        <view v-for="(item, index) in options" :key="index" class="uni-steps__column-line-item">
          <view class="uni-steps__column-circle" style="color: #999"></view>
          <view
            class="uni-steps__column-line uni-steps__column-line--after"
            :style="{
              backgroundColor: index === options.length - 1 ? 'transparent' : deactiveColor
            }"
          ></view>
        </view>
      </view>
    </view>
    <!-- <UniPopupDialog v-if="playDialogVisible" :visible.sync="playDialogVisible" mode="input" /> -->
  </view>
</template>

<script>
/**
 * Steps 步骤条
 * @description 评分组件
 * @tutorial https://ext.dcloud.net.cn/plugin?id=34
 * @property {Number} active 当前步骤
 * @property {String} direction = [row|column] 当前步骤
 * 	@value row 横向
 * 	@value column 纵向
 * @property {String} activeColor 选中状态的颜色
 * @property {Array} options 数据源，格式为：[{title:'xxx',desc:'xxx'},{title:'xxx',desc:'xxx'}]
 */
import UniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
export default {
  name: 'UniStep',
  components: {},
  props: {
    deactiveColor: {
      // 未激活状态颜色
      type: String,
      default: '#999999'
    },
    options: {
      type: Array,
      default() {
        return []
      }
    } // 数据
  },
  data() {
    return {
      playDialogVisible: false,
      filterForm: {}
    }
  },
  methods: {
    getUpdate(value) {
      this.filterForm.flag = value
      this.$emit('showModelTrue', this.filterForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.colck-update {
  color: #409eff;
  font-size: 12px;
}
.uni-steps {
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
}

.uni-steps__column {
  display: flex;
  flex-direction: row-reverse;
}

.uni-steps__column-text-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.uni-steps__column-text {
  padding: 6px 0px;
  display: flex;
  flex-direction: column;
  height: 224px;
}

.uni-steps__column-title {
  font-size: 14px;
  color: #999;
  text-align: left;
  line-height: 28px;
  margin-bottom: 8px;
}

.uni-steps__column-desc {
  font-size: $uni-font-size-sm;
  text-align: left;
  line-height: 40px;
}

.uni-steps__column-container {
  display: inline-flex;
  width: 30px;
  flex-direction: column;
  margin-right: 17px;
  margin-top: 10px;
}

.uni-steps__column-line-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.uni-steps__column-line {
  width: 2px;
  background-color: $uni-text-color-grey;
}

.uni-steps__column-line--after {
  flex: 1;
  transform: translate(0px, 1px);
}

.uni-steps__column-circle {
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background-color: $uni-text-color-grey;
  margin: 4px 0px 5px 0px;
}
</style>
