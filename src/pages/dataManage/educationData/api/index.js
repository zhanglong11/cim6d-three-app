import http from '@/utils/http'

export default {
  // 列表
  getProjectDataList: data => http.post(`/safetyEducationVideo/list`, data),

  // 详情
  getEducationDetail: id => http.get(`/safetyEducationVideo/get/${id}`),

  // 保存
  getEducationAdd: data => http.post(`/safetyEducationVideo/add`, data),
  getEducationUpdate: data => http.post(`/safetyEducationVideo/update`, data),
  // 删除
  getEducationDelete: id => http.get(`/safetyEducationVideo/delete/${id}`)
}
