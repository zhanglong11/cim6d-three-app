<template>
  <view class="main login-bg">
    <image src="../../static/images/login/login-bg.png" class="login-bg-img" mode="widthFix" />
    <div class="login">
      <input v-model="queryForm.loginName" class="login-input" type="text" placeholder="请输入账号" />
      <view class="password-wrap">
        <input v-model="queryForm.password" class="login-input" placeholder="请输入密码" :password="hiddenPassword" />
        <uni-icons
          :type="hiddenPassword ? 'eye' : 'eye-slash'"
          size="20"
          @click="hiddenPassword = !hiddenPassword"
        ></uni-icons>
      </view>

      <view class="btn-row">
        <button type="primary" class="primary" @click="bindLogin">登录</button>
      </view>
      <view class="written-wrap">
        <checkbox-group class="checkbox-group" @change="checkboxChange">
          <label>
            <checkbox value="0" />
          </label>
        </checkbox-group>
        <a @click="handleAgreement">用户服务协议</a>
        <a @click="handlePolicy">隐私保护政策</a>
      </view>
    </div>
  </view>
</template>

<script>
import { $urlSuffix } from '@/utils/http'
import { loginApi } from '@/api/login'
import { projectAPI } from '@/api/project'
import tencentCaptchaPromise from '@/utils/tencentCaptchaPromise'
export default {
  components: {},
  data() {
    return {
      providerList: [],
      hasProvider: false,
      positionTop: 0,
      isDevtools: false,
      hiddenPassword: true,
      isChecked: [],
      queryForm: {
        loginName: process.env.VUE_APP_USER_NAME,
        password: process.env.VUE_APP_PASSWORD
      },
      imgUrl: ''
    }
  },
  mounted() {},
  methods: {
    // 登录
    bindLogin() {
      if (!this.queryForm.loginName) {
        uni.showToast({
          icon: 'none',
          title: '请输入账号'
        })
        return
      }
      if (!this.queryForm.password) {
        uni.showToast({
          icon: 'none',
          title: '请输入密码'
        })
        return
      }
      this.login()
    },
    // 是否已读
    checkboxChange(e) {
      this.isChecked = e.detail.value
    },
    // 登录
    async login() {
      if (this.isChecked.length === 0) {
        this.$utils.showToast('请阅读并同意《用户服务协议》和《隐私保护政策》')
        return
      }
      // 登录加密
      try {
        const isProd = $urlSuffix === '-prod'
        let loginForm = _.cloneDeep(this.queryForm)
        if (false) {
          const { ticket, randstr } = await tencentCaptchaPromise.call(this)
          _.assign(loginForm, { ticket, randstr })
        }
        // console.log(444, loginForm)
        let params = this.$utils.userEncryption(loginForm)
        const result = await loginApi.login(params)
        let token = result.data || ''
        this.$store.commit('user/saveLoginInfo', params)
        this.$store.commit('user/setToken', token)
        this.queryProjectListInfo()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取项目数据
    async queryProjectListInfo() {
      let listinfo = await projectAPI.queryProjectListInfo()
      let list = listinfo.data || []
      if (list.length === 0) {
        this.$utils.showToast('无项目权限，请联系管理员添加')
        setTimeout(() => {
          this.$store.commit('user/logOut', false)
        }, 1500)
      } else {
        this.$store.dispatch('user/getUserInfo')
        this.$utils.toUrl('/pages/select-project/select-project', 1)
        this.$store.dispatch('getCompanyDepartmentList')
        this.$store.dispatch('getUserList')
      }
    },
    // 用户服务协议
    handleAgreement() {
      this.$utils.toUrl(`/pages/about/agreement`)
    },
    // 隐私保护政策
    handlePolicy() {
      this.$utils.toUrl(`/pages/written/policy`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./login.less');
</style>
