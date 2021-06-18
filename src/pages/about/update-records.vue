<template>
  <div class="main is-white">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <div class="records-list">
          <template v-for="(item, i) in listData">
            <uni-card :key="i" :hideTitle="false">
              <p slot="title" class="records-title">
                <span class="name" v-text="item.version"></span>
                <span class="time">{{ item.createTime }}</span>
              </p>
              <div class="desc" v-html="item.updateContent"></div>
            </uni-card>
          </template>

          <EmptyTemplate v-if="listData.length === 0"></EmptyTemplate>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data() {
    //这里存放数据
    return {
      listData: []
    }
  },
  /*// 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
  },*/
  mounted() {},
  created() {
    this.getRecordList()
  },
  //方法集合
  methods: {
    async getRecordList() {
      let appCode = '__UNI__24AA3C2'
      let platform = uni.getSystemInfoSync().platform
      //类型(1:android,2:ios)
      let res = await this.axios.admin.post('/app/version/record/list', {
        //type: platform === 'android' ? 1 : 2,
        type: 1,
        appCode: appCode
      })
      let list = res.data.records || []
      list.map(item => {
        item.updateContent = item.updateContent.replace(/<.*?>/g, '').replace(/↵|\n/g, '<br>')
      })
      this.listData = list
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./update-records.less');
</style>
