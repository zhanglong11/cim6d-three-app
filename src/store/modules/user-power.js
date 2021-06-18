import { roleApi } from '@/api/role'
import { workFlowApi } from '@/api/work-flow'
// 用户权限
const state = {
  power: uni.getStorageSync('power') || [], // 我的权限
  powerList: uni.getStorageSync('powerList') || [], // 我的权限 - 完整
  systemApplication: ['会议管理', '任务管理', '质量管理', '安全管理', '消息中心', '监理规划', '监理日志'], // 默认首页应用
  applicationPower: uni.getStorageSync('applicationPower') ? uni.getStorageSync('applicationPower') : [], // APP应用权限
  taskTodo: uni.getStorageSync('taskTodo') ? uni.getStorageSync('taskTodo').split(',') : [], // 我的待办
  decorationUser: [
    'be8b92183eea4ab795de3c40abdefbd8', // laotan
    '24954606100409521', // zhuangxiu
    '24955312622527406' // beichen
  ], // 精装修用户id集合
  // 待办跳转定义
  taskTodoPower: {
    material_supply_plan: '/pages/material/planList/detail', // 甲供材计划单
    material_supply_confirm_bill: '/pages/material/confirmation/detail' // 材料确认单
  }
}

const mutations = {
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    let projectId = this.state.project.projectId
    let projectUserCategory = this.state.project.projectUserCategory
    if (!projectId) {
      return
    }
    return new Promise((resolve, reject) => {
      roleApi
        .getAvailablePower(projectId, projectUserCategory === 1)
        .then(response => {
          const { data } = response
          let power = []
          let powerList = []
          let applicationPower = []
          let applicationPowerNew = []
          const findArray = array => {
            if (!array) {
              return
            }
            array.map(e => {
              if (e.powerKey === 'AppPower' && e.children && e.children.length > 0) {
                applicationPower = e.children
              }
              powerList.push(e)
              power.push(e.powerKey)
              if (e.children) {
                findArray(e.children)
              }
            })
          }
          data.map(item => {
            findArray(item.children)
          })
          const formatArray = array => {
            let list = []
            array.map(e => {
              let item = Object.assign({}, e)
              list.push(item)
            })
            return list
          }
          applicationPowerNew = formatArray(applicationPower)
          uni.setStorageSync('power', power)
          state.power = power
          uni.setStorageSync('powerList', powerList)
          state.powerList = powerList

          uni.setStorageSync('applicationPower', applicationPowerNew)
          state.applicationPower = applicationPowerNew
          let systemApplication = []

          if (this.state.project.projectType === 'construction3.0') {
            systemApplication = ['会议管理', '任务管理', '质量管理', '安全管理', '消息中心', '监理规划', '监理日志']
          }
          if (this.state.project.projectType === 'decoration') {
            systemApplication = [
              '会议管理',
              '任务管理',
              '消息中心',
              '进度管理',
              '材料采购',
              '领料管理',
              '质量检测',
              '施工日志'
            ]
          }
          state.systemApplication = systemApplication
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 清除用户权限
  clearPower(state) {
    state.power = []
    uni.removeStorageSync('power')
    state.taskTodo = []
    uni.removeStorageSync('taskTodo')
    state.applicationPower = []
    uni.removeStorageSync('applicationPower')
  },
  // 我的待办
  getTaskTodo(state, callBack = () => {}) {
    let params = {
      sortField: 'createTime',
      sortValue: 'desc',
      taskStatus: 0,
      projectId: this.state.project.projectId || '',
      page: 1,
      rows: 1000
    }
    return new Promise((resolve, reject) => {
      workFlowApi
        .queryTaskList(params)
        .then(response => {
          const { data } = response
          let records = data.records || []
          const taskTodo = []
          records.map(item => {
            taskTodo.push(item.targetId)
          })
          uni.setStorageSync('taskTodo', taskTodo.join(','))
          state.taskTodo = taskTodo
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
