import http from '@/utils/http'
export default {
  // 我发起的列表
  getCreatedByMeList: data => {
    return http.processApi.post('/activiti/process/instance/started', data)
  },
  // 获取审核待审核列表
  getTaskList: data => {
    return http.processApi.post('/task/list', data)
  },
  // 抄送给我列表
  getCopyToMeList: data => {
    return http.processApi.post('/oa/cc/list', data)
  },
  // 获取表单分组列表
  getFormGroupList: data => {
    return http.processApi.post('/oa/form/group/select', data)
  },
  // 获取表单列表
  getFormList: data => {
    return http.processApi.post('/oa/form/list', data)
  },
  // 获取表单排序
  getFormSort: data => {
    return http.processApi.post('/oa/form/sort', data)
  },
  // 获取表单列表
  getRecentlyFormList: data => {
    return http.processApi.get('/oa/form/recently/used/list', data)
  },
  // 获取分组表单列表
  getGroupFormList: data => {
    return http.processApi.post('/oa/form/group/list', data)
  },
  // 添加分组
  getGroupFormAdd: data => {
    return http.processApi.post('/oa/form/group/save', data)
  },
  // 删除分组
  getGroupFormDelete: id => {
    return http.processApi.get(`/oa/form/group/delete/${id}`)
  },
  // 自定义表单的删除
  getCustomFormDelete: id => {
    return http.processApi.get(`/oa/form/delete/${id}`)
  },
  // 获取表单详情
  getFormDetail: id => {
    return http.processApi.get(`/oa/form/get/${id}`)
  },
  // 获取表单详情
  getFormFillDetail: id => {
    return http.processApi.get(`/oa/form/data/get/${id}`)
  },
  // 获取表单详情
  getFormFillSave: data => {
    return http.processApi.post(`/oa/form/data/save`, data)
  },
  // 获取表单详情
  getFormFillSaveAndSubmit: data => {
    return http.processApi.post(`/oa/form/data/saveAndSubmit`, data)
  },
  // 获取表单详情
  getGroupSelect: data => {
    return http.processApi.post(`/oa/form/group/select`, data)
  },
  // 获取审批样式列表
  getAuditStyleList: data => {
    return http.processApi.post('/oa/audit/style/list', data)
  },
  // 启用审批样式
  toStart: id => {
    return http.processApi.get(`/oa/audit/style/enable/${id}`)
  },
  // 停用审批样式
  toStop: id => {
    return http.processApi.get(`/oa/audit/style/disable/${id}`)
  },
  // 获取审批样式详情
  getAuditStyleDetail: id => {
    return http.processApi.get(`/oa/audit/style/get/${id}`)
  },
  // 保存审批样式表单
  addAuditStyle: data => {
    return http.processApi.post('/oa/audit/style/save', data)
  },
  // 获取审批详情
  getFormProess: id => {
    return http.processApi.get(`/oa/form/process/get/${id}`)
  },
  // 获取审批样式
  getAuditStyleTemplate: id => {
    return http.processApi.get(`/oa/audit/style/template/${id}`)
  },
  // 获取最近使用列表
  getRecentlyUsedList: () => {
    return http.processApi.get(`/oa/form/recently/used/list`)
  },
  // 表单统计
  getFormCount: () => {
    return http.processApi.get(`/oa/form/count`)
  },
  // 抄送查看
  getCcUpdate: id => {
    return http.processApi.get(`/oa/cc/update/${id}`)
  }
}
