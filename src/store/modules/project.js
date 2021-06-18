import userApi from '@/api/user'
import toTree from '@/utils/toTree'
export default {
  state: {
    projectId: uni.getStorageSync('projectId') || '', // 项目id
    projectUserCategory: parseInt(uni.getStorageSync('projectUserCategory')) || '', // 记录项目是主办方还是参与方 1参与方 2主办方
    projectName: uni.getStorageSync('projectName') || '', // 项目名字
    projectType: uni.getStorageSync('projectType') || '', // 项目类型
    weatherInfo: uni.getStorageSync('weatherInfo') || {},
    userList: uni.getStorageSync('userList') || [],
    departmentList: uni.getStorageSync('departmentList') || [], //项目下的部门
    departmentTreeList: uni.getStorageSync('departmentTreeList') || [], //项目下的部门树形结构
    departmentUserList: uni.getStorageSync('departmentUserList') || [], //项目下的部门、人员树
    companyList: uni.getStorageSync('companyList') || [], //项目下的所有公司数据
    companyDepartmentList: uni.getStorageSync('companyDepartmentList') || [], //公司下的部门
    messageTypes: uni.getStorageSync('messageTypes') || {} // 消息类型缓存
  },
  mutations: {
    // 设置webview缓存
    setWebViewData(state, { projectId, token }) {
      console.log(1111, projectId, token)
      uni.setStorageSync('projectId', projectId)
      state.projectId = projectId
      this.commit('user/setToken', token)
    },
    setWebViewDatas(state, { projectId, token }) {
      uni.setStorageSync('projectId', projectId)
      state.projectId = projectId
      this.commit('user/setToken', token)
    },
    // 缓存项目信息
    setSelectedProjectInfo(state, data) {
      uni.setStorageSync('projectId', data.id)
      uni.setStorageSync('projectUserCategory', data.projectUserCategory)
      uni.setStorageSync('projectName', data.name)
      uni.setStorageSync('projectType', data.type)
      state.projectId = data.id
      state.projectUserCategory = data.projectUserCategory
      state.projectName = data.name
      state.projectType = data.type
    },
    // 缓存天气信息
    setWeatherInfo(state, data) {
      uni.setStorageSync('weatherInfo', data)
      state.weatherInfo = data
    },
    // 清除项目信息
    clearProject(state) {
      state.projectId = ''
      uni.removeStorageSync('projectId')
      state.projectUserCategory = ''
      uni.removeStorageSync('projectUserCategory')
      state.projectName = ''
      uni.removeStorageSync('projectName')
      state.projectType = ''
      uni.removeStorageSync('projectType')
      state.weatherInfo = {}
      uni.removeStorageSync('weatherInfo')
      state.userList = []
      uni.removeStorageSync('userList')
      state.departmentList = []
      uni.removeStorageSync('departmentList')
      state.departmentTreeList = []
      uni.removeStorageSync('departmentTreeList')
      state.departmentUserList = []
      uni.removeStorageSync('departmentUserList')
      state.companyDepartmentList = []
      uni.removeStorageSync('companyDepartmentList')
      state.messageTypes = {}
      uni.removeStorageSync('messageTypes')
    },
    changeUserList(state, list) {
      uni.setStorageSync('userList', list)
      state.userList = list
    },
    changeDepartmentList(state, list) {
      uni.setStorageSync('departmentList', list)
      let TreeData = toTree(list, 'parentId')
      uni.setStorageSync('departmentTreeList', TreeData)
      state.departmentList = list

      state.departmentTreeList = TreeData
    },
    changeDepartmentUserList(state, list) {
      uni.setStorageSync('departmentUserList', list)
      state.departmentUserList = list
    },
    changeCompanyDepartmentList(state, list) {
      uni.setStorageSync('companyDepartmentList', list)
      state.companyDepartmentList = list
    },
    changeCompanyList(state, list) {
      uni.setStorageSync('companyList', list)
      state.companyList = list
    },
    // 设置消息类型缓存
    setMessageType(state, types) {
      uni.setStorageSync('messageTypes', types)
      state.messageTypes = types
    }
  },
  actions: {
    getUserList({ commit }, projectId) {
      // 查询节点下人员列表
      const getOrganizationUserList = data => {
        userApi.getOrganizationUserList(data).then(res => {
          let userList = res || []
          userList.map(item => {
            item.id = item.id || item.dataUnicode
            item.name = item.realName
            item.userId = item.dataUnicode
            item.roleName = _.map(item.roleList, 'name').join(' / ')
          })
          commit('changeUserList', userList)
        })
      }
      userApi.getUserList(projectId).then(res => {
        let list = res || []
        let companyList = []
        let departmentUserList = []
        if (list.length === 0) {
          return
        }
        getOrganizationUserList({ id: list[0].id })
        // 处理树接口人员数据
        const formatArray = (array, type) => {
          array.map(e => {
            e.children = _.cloneDeep(e.child)
            e.disabled = false
            if (type === 'department') {
              // 处理部门选择数据
              let childrenList = e.children ? _.filter(e.children, e => e.organType <= 4) : []
              if (e.organType >= 4 || childrenList.length === 0) {
                e.child = null
                e.children = null
              }
              if (e.organType > 4) {
                e.disabled = true
              }
            }
            e.name = e.dataName
            e.type = e.organType === 6 ? 3 : null
            e.targetId = e.dataUnicode
            e.label = e.dataName
            e.value = e.dataUnicode
            if (e.children) {
              formatArray(e.children, type)
            }
          })
        }
        formatArray(list)

        let departmentList = _.cloneDeep(list)
        formatArray(departmentList, 'department')
        list[0].children.map(e => {
          if (e.participantType === 1) {
            departmentUserList.push(e)
          } else if (e.children) {
            e.children.map(f => {
              departmentUserList.push(f)
            })
          }
        })
        departmentUserList.map(e => {
          if (e.children) {
            companyList.push(...e.children)
          }
        })
        commit('changeCompanyList', companyList)
        commit('changeDepartmentUserList', departmentUserList)
        commit('changeDepartmentList', departmentList)
      })
    },
    getDepartmentList({ commit }) {
      // userApi.getDepartmentList().then(departmentList => {
      //   departmentList.map(e => {
      //     if (e.level === 2) {
      //       e.parentId = null
      //     }
      //   })
      //   commit('changeDepartmentList', departmentList)
      // })
    },
    getCompanyDepartmentList({ commit }) {
      userApi.getCompanyDepartmentList([]).then(departmentList => {
        commit('changeCompanyDepartmentList', departmentList)
      })
    }
  }
}
