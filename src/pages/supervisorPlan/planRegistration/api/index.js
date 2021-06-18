import http from '@/utils/http'

export default {
  /*监理规划登记*/
  // 列表
  getPlanRegistrationList: data => http.post(`/supervisorPlanRegistration/list`, data),

  // 保存
  savePlanRegistration: data => http.post(`/supervisorPlanRegistration/save`, data),

  // 保存并提交
  saveAndSubmitRegistration: data => http.post(`/supervisorPlanRegistration/saveAndSubmit`, data),

  // 详情
  getPlanRegistrationDetail: id => http.get(`/supervisorPlanRegistration/get/${id}`),

  // 删除
  deletePlanRegistration: id => http.get(`/supervisorPlanRegistration/update/deleteFlag/${id}`)
}
