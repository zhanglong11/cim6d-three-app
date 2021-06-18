<template>
  <view>
    <u-popup :value="visible" mode="bottom" @close="close">
      <header class="header">
        <span>{{ activeInfo.name }}</span>
        <uni-icons color="#999999" size="18" type="closeempty" @click="close" />
      </header>
      <view class="wrap">
        <p @click="showRename">
          <i class="icon iconfont icon-edit" />
          <span>重命名</span>
        </p>
        <p @click="remove">
          <i class="icon iconfont icon-shanchu" />
          <span>删除</span>
        </p>
      </view>
    </u-popup>
    <u-modal v-if="renameVisible" v-model="renameVisible" show-cancel-button title="重命名" @confirm="confirmReName">
      <view class="rename-wrap">
        <textarea v-model.trim="rename" placeholder="请输入" auto-height />
      </view>
    </u-modal>
    <u-toast ref="uToast" />
    <u-modal
      v-model="showRemoveDialog"
      title="删除"
      show-cancel-button
      content="确认要删除文件?"
      @confirm="confirmRemove"
    ></u-modal>
  </view>
</template>

<script>
import Api from '../../api'
export default {
  name: 'index',
  // import引入的组件
  components: {},
  props: {
    visible: {
      type: Boolean
    },
    activeInfo: {}
  },
  data() {
    // 这里存放数据
    return {
      renameVisible: false,
      rename: '',
      showRemoveDialog: false
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    close() {
      this.$emit('update:visible', false)
    },
    showRename() {
      this.renameVisible = true
      this.rename = this.activeInfo.name.split('.')[0]
    },
    hideRename() {
      this.renameVisible = false
    },
    toChoose() {
      this.$utils.toUrl(`/pages/dataManage/projectFile/chooseLocation`)
    },
    async confirmReName() {
      if (!this.rename) {
        this.$refs.uToast.show({
          title: '请输入文件名',
          type: 'warning'
        })
        this.renameVisible = true
        return
      }
      await Api.remove({ id: this.activeInfo.id, name: this.rename })
      this.$refs.uToast.show({
        title: '操作成功'
      })
      this.rename = ''
      this.close()
      this.$emit('refresh')
    },
    remove() {
      console.log(this.activeInfo)
      this.showRemoveDialog = true
    },
    async confirmRemove() {
      await Api.delete(this.activeInfo.id)
      this.$refs.uToast.show({
        title: '操作成功'
      })
      this.close()
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
  border-bottom: 1px solid #ccc;
}
.wrap {
  display: flex;
  padding: 40px 20px;
  > p {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: center;
    font-size: 14px;
    span {
      margin-top: 10px;
    }
    .icon {
      font-size: 30px;
    }
  }
}
.rename-wrap {
  padding: 40px 20px;
}
</style>
