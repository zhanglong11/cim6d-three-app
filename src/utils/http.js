import Fly from 'flyio/dist/npm/wx'
import { getToken } from './auth'
import utils from './utils'
import store from '../store'
import { isArray } from 'lodash'
const flyService = baseURL => {
  const fly = new Fly()
  // 接口地址配置
  fly.config.baseURL = baseURL
  fly.config.timeout = 10000
  const toLogin = function () {
    // store.commit('user/login')
    utils.toUrl('/pages/login/login')
  }
  // 添加拦截器
  fly.interceptors.request.use((request, promise) => {
    // 是否显示加载中
    if (request.isLoading) {
      request.clock = setTimeout(() => {
        request.isInLoading = true
        //utils.showLoading()
      }, 500)
    }
    request.headers = {
      'content-type': 'application/json',
      'application-type': 'app',
      platform: store.state.project.projectType,
      'project-id': store.state.project.projectId
    }
    const token = getToken()
    // 免登录临时token
    if (token) {
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      request.headers['x-access-token'] = token
    }
    const authParams = {
      // 公共参数
    }

    if (!isArray(request.body)) {
      request.body = {
        ...request.body,
        ...authParams
      }
    }
    return request
  })
  fly.interceptors.response.use(
    response => {
      if (response.request.clock) {
        clearTimeout(response.request.clock)
        if (response.request.isInLoading) {
          utils.hideLoading()
        }
      } else if (response.request.isLoading) {
        utils.hideLoading()
      }
      uni.stopPullDownRefresh()
      // token失效
      if (response.data.code === 1000) {
        // toLogin()
        // return Promise.reject(response)
      }
      if (response.data.code === 200) {
        return response.data
      } else {
        utils.showToast(response.data.message || '系统开小差了')
        return Promise.reject(response)
      }
    },
    err => {
      if (err.request.clock) {
        clearTimeout(err.request.clock)
        if (err.request.isInLoading) {
          utils.hideLoading()
        }
      } else if (err.request.isLoading) {
        utils.hideLoading()
      }
      utils.showToast('网络异常请稍后再试')
      uni.stopPullDownRefresh()
    }
  )
  return fly
}
let baseUrl = ''
// 配置请求基地址
// #ifdef MP
baseUrl = 'http://152.136.120.203:33333' //http://172.16.10.26:22222
// #endif
export let urlSuffix = process.env.VUE_APP_BASE_API

// 配置请求基地址
// #ifdef APP-PLUS
baseUrl = 'http://172.16.10.230:20005' // 'http://172.16.10.230:20005 //http://120.53.240.155:33333
urlSuffix = '-dev'
// #endif
export const $urlSuffix = urlSuffix

export const getCodeImgUrl = `${baseUrl}/cim6d-system${urlSuffix}/noToken/createImage`
export const dataProcess = `/cim6d-bim-light${urlSuffix}`
const http = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.system = flyService(`${baseUrl}/cim6d-system${urlSuffix}`)
http.construction = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.admin = flyService(`${baseUrl}/cim6d-admin${urlSuffix}`)
http.global = flyService(`${baseUrl}/cim6d-global${urlSuffix}`)
http.material = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`)
http.log = flyService(`${baseUrl}/cim6d-construction${urlSuffix}`) //施工日志
http.labour = flyService(`${baseUrl}/cim6d-construction${urlSuffix}/labour`)
http.process = flyService(`${baseUrl}/cim6d-process${urlSuffix}`) // 工作流相关
http.processApi = flyService(`${baseUrl}/cim6d-process${urlSuffix}`) // OA相关API
http.decoration = flyService(`${baseUrl}/cim6d-decoration${urlSuffix}`) // 智慧精装3.0
http.iotEquipmentMonitor = flyService(`${baseUrl}/cim6d-iot${urlSuffix}`) // 物联网
http.iot = flyService(`${baseUrl}/cim6d-iot${urlSuffix}`) //物联网

export const schedule = flyService(`${baseUrl}/cim6d-construction${urlSuffix}/schedule`)
http.file = flyService(`${baseUrl}/cim6d-file${urlSuffix}`)
export const fileUrl = `${baseUrl}/cim6d-file${urlSuffix}` // uni.upload 只能使用绝对路径
export default http
