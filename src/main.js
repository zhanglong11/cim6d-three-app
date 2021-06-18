import Vue from 'vue'
import App from './App'

import store from './store'
import utils from './utils/utils' // 通用函数封装
import fly from './utils/http'
import toFixed from './utils/toFixed'
import _ from 'lodash'
import EmptyTemplate from '@/components/empty-template' // 无数据空载页
import WorkFlow from '@/components/WorkFlow'
import WorkFormItem from '@/components/WorkFlow/components/formItem'
import uView from 'uview-ui'
Vue.component('WorkFormItem', WorkFormItem)
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI, {
//   size: 'medium'
// })
// import '@zgeaw/work-flow/dist/WorkFlow.css'
// Vue.use(WorkFlow)
Vue.component('WorkFlow', WorkFlow)
Vue.component('EmptyTemplate', EmptyTemplate)
Vue.use(uView)

import moment from 'moment'
import 'moment/locale/zh-cn'
Vue.config.productionTip = false
Vue.prototype.$getLabel = (options, value) => {
  return _.get(_.find(options, { value }), 'label', '-')
}
Vue.prototype.$hasPower = e => {
  if (!store.state.user.token) {
    // 未登录可以查看模块
    return true
  }
  return store.state.userPower.power.includes(e)
}
Vue.prototype.$hasAppPower = e => {
  if (!store.state.user.token) {
    // 未登录可以查看模块
    return true
  }
  return store.state.userPower.applicationPower.includes(e)
}
const getLabel = (options, value) => {
  return _.get(_.find(options, { value }), 'label', '-')
}
Vue.prototype.$getLabel = getLabel
Vue.prototype.$getLabelFromArg = (argGroup, value) => {
  return getLabel(_.find(store.state.systemConfig.argTree, { argGroup })?.children ?? [], value)
}
Vue.prototype.$getArgList = group =>
  store.state.systemConfig.argTree &&
  store.state.systemConfig.argTree.filter(item => item.argCode === group)[0].children.filter(item => !item.deleteFlag)
Vue.prototype.$store = store
Vue.prototype.$utils = utils
Vue.prototype.fly = fly
Vue.prototype.axios = fly
Vue.prototype._ = _
Vue.prototype.toFixed = toFixed
moment.locale('zh-cn')
Vue.prototype.moment = moment
// window.tk = '2d86c70a6411d4e1e92d19c25963e210'
// 全局过滤器
import * as customFilters from '@/utils/filters'
Object.keys(customFilters).forEach(key => {
  Vue.filter(key, customFilters[key])
})
Vue.filter('toFixed', toFixed)
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
