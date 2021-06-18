import http from '@/utils/http'

export default {
  /*验收规范*/
  // 列表
  getCheckSpecificList: data => http.post(`/quality/checkSpecific/pageList`, data),

  // 新增
  addCheckSpecific: data => http.post(`/quality/checkSpecific/add`, data),

  // 编辑
  updateCheckSpecific: data => http.post(`/quality/checkSpecific/update`, data),

  // 详情
  getCheckSpecificDetail: id => http.get(`/quality/checkSpecific/get/${id}`),

  // 删除
  deleteCheckSpecific: id => http.get(`/quality/checkSpecific/delete/${id}`)
}
