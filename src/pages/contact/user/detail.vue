<template>
  <div class="main">
    <div class="summary-card">
      <div class="card summary">
        <uni-avatar :user="form" :size="160"></uni-avatar>
        <h1>
          {{ form.realName }}
          <span class="sex">{{ form.sexStr }}</span>
        </h1>
        <p class="company-name">{{ form.companyName }}</p>
        <p>{{ form.roleName }}</p>
        <ul>
          <image src="/static/images/phone.png" @click="makePhoneCall"></image>
          <image src="/static/images/message.png" @click="sendMessage"></image>
          <!-- <image src="/static/images/email.png" @click="sendEmail"></image> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      id: null,
      form: {}
    }
  },
  computed: {
    userList() {
      return this.$store.state.project.userList
    }
  },
  created() {
    this.getUser()
  },
  mounted() {},
  onLoad(options) {
    this.id = options.id
  },
  methods: {
    // 获取用户信息
    getUser() {
      let userInfo = _.find(this.userList, {
        userId: this.id
      })
      let sexStr = '保密'
      switch (userInfo.sex) {
        case 1:
          sexStr = '男'
          break
        case 2:
          sexStr = '女'
          break
        default:
          sexStr = '保密'
      }
      userInfo.sexStr = sexStr
      this.form = Object.assign({}, userInfo)
    },
    makePhoneCall() {
      if (!this.form.userPhone) {
        this.$utils.showToast('用户未填写手机号')
        return false
      }
      uni.makePhoneCall({
        phoneNumber: this.form.userPhone
      })
    },
    sendMessage() {
      if (!this.form.userPhone) {
        this.$utils.showToast('用户未填写手机号')
        return
      }
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS)
      msg.to = [this.form.userPhone]
      msg.body = '你好'
      plus.messaging.sendMessage(msg)
      // #endif
    },
    sendEmail() {
      if (!this.form.email) {
        this.$utils.showToast('用户未填写邮箱')
        return
      }
      // #ifdef APP-PLUS
      let msg = plus.messaging.createMessage(plus.messaging.TYPE_EMAIL)
      msg.to = [this.form.email]
      msg.subject = '你好'
      msg.body = '你好'
      plus.messaging.sendMessage(
        msg,
        function () {
          console.log('Send success!')
        },
        function () {
          console.log('Send failed!')
        }
      )
      // #endif
    }
  }
}
</script>

<style scoped lang="less">
@import url('./detail.less');
</style>
