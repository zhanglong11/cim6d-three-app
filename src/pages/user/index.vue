<template>
  <view class="main is-white">
    <view class="main-header" @click="toLogin()">
      <view class="avatar">
        <image :src="headImage" class="user-avatar" />
      </view>
      <view class="base-info">
        <view class="name">
          <view class="nickName">{{ token ? userName : '游客' }}</view>
          <view class="roleName">{{ token ? position : '去登录' }}</view>
        </view>
        <view class="phone">{{ mobile }}</view>
      </view>
      <view v-if="!token" class="arrow-right">
        <image class="img" src="../../static/images/icon/@2x/icon-arrow-right-2.png"></image>
      </view>
      <div class="header-line"></div>
    </view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item
            label="消息中心"
            icon="../../static/images/icon/@2x/icon-message.png"
            isLink
            @click="$utils.toUrl('/pages/message/index')"
          ></uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item
            label="首页设置"
            icon="../../static/images/icon/@2x/icon-step.png"
            isLink
            @click="$utils.toUrl('/pages/user/setting-items/home-setting')"
          ></uni-form-item>
          <uni-form-item
            label="企业信息"
            icon="../../static/images/icon/@2x/icon-company.png"
            isLink
            @click="$utils.toUrl('/pages/enterpriseInfo/index')"
          ></uni-form-item>
          <uni-form-item
            label="意见反馈"
            icon="../../static/images/icon/@2x/icon-opinion.png"
            isLink
            @click="$utils.toUrl('/pages/adviceFeedback/index')"
          ></uni-form-item>
          <uni-form-item
            label="关于应用"
            icon="../../static/images/icon/@2x/icon-application.png"
            isLink
            @click="$utils.toUrl('/pages/about/index')"
          ></uni-form-item>
        </uni-card>
        <view v-if="token" class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogOut">退出登录</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    projectId() {
      return this.$store.state.project.projectId
    },
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.userName
    },
    position() {
      return this.$store.state.user.position
    },
    mobile() {
      return this.$store.state.user.mobile
    },
    headImage() {
      return this.$store.state.user.headImage || '/static/images/default-user.png'
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/user/setting`)
  },
  methods: {
    //退出操作
    handleLogOut() {
      this.$utils.showToast('安全退出')
      // 调用接口成功后
      setTimeout(() => {
        this.$store.commit('user/logOut')
      }, 1500)
    },
    // 跳转登录
    toLogin() {
      if (this.token) {
        return
      }
      this.$utils.toUrl('/pages/login/login')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
