<template>
  <view class="main">
    <view class="main-body">
      <view>
        <view v-if="type !== 'wxSend'" class="card">
          <uni-form-item label="消息标题" type="textarea" align="left">
            <view>{{ info.title }}</view>
          </uni-form-item>
          <uni-form-item v-if="info.content" label="内容" type="textarea" align="left">
            <view>{{ info.content }}</view>
          </uni-form-item>
          <uni-form-item label="消息类型">
            <view>{{ $getLabel(typeList, info.type) }}</view>
          </uni-form-item>
          <uni-form-item v-if="type === 'receive'" label="发送人">
            <view>{{ info.sendName }}</view>
          </uni-form-item>
          <uni-form-item v-else label="接收人">
            <view>{{ info.receiveName }}</view>
          </uni-form-item>
          <uni-form-item label="发送时间">
            <view>{{ info.sendTime }}</view>
          </uni-form-item>
          <uni-form-item v-if="info.fileId" class="file-item" label="附件">
            <uni-attachment v-model="info.fileId" />
          </uni-form-item>
        </view>
        <template v-else>
          <uni-card v-for="(item, i) in info" :key="i">
            <uni-form-item label="接收人" isCell>
              {{ item.receiverName }}
            </uni-form-item>
            <uni-form-item label="状态" isCell>
              <span v-if="item.readStatus" style="color: #999">已读</span>
              <span v-else style="color: red">未读</span>
            </uni-form-item>
            <uni-form-item v-if="item.readStatus" label="已读时间" isCell>
              {{ item.readTime }}
            </uni-form-item>
          </uni-card>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import Api from './api'
import typeList from './lib/typeList'
export default {
  name: 'MessageDetail',
  components: {},
  data() {
    return {
      info: {},
      id: '',
      type: 'receive',
      isLoading: false,
      typeList
    }
  },
  onLoad(options) {
    this.id = options.id
    this.type = options.type
    this.init()
  },
  methods: {
    //初始化页面参数
    init() {
      this.getDetail()
    },
    //获取详情
    async getDetail() {
      let res = ''
      if (this.type !== 'wxSend') {
        res = await Api.detail(this.id)
      } else {
        res = await Api.hetWxMessageDetail(this.id)
      }
      this.info = res.data
      console.log(444, this.info)
      if (this.info.readStatus === 0 && this.type === 'receive') {
        this.read()
      }
    },
    //已读
    async read() {
      await Api.read([this.id])
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/pages/quality/detail.less');
.main-body .card-warp {
  margin-top: 24px;
}
</style>
