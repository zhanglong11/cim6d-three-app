import http from '../utils/http'
// 通用
export const projectAPI = {
  // 获取用户项目列表
  queryProjectListInfo: () => {
    return http.system.post('/cim6d/system/project/listAll', { isLoading: true })
  }
}
