import http from '@/utils/http'

export default {
  /*监理实施细则*/
  // 列表
  getImplementRulesList: data => http.post(`/supervisorEnforcementRegulation/list`, data),

  // 保存
  saveImplementRules: data => http.post(`/supervisorEnforcementRegulation/save`, data),

  // 保存并提交
  saveAndSubmitImplementRules: data => http.post(`/supervisorEnforcementRegulation/saveAndSubmit`, data),

  // 详情
  getImplementRulesDetail: id => http.get(`/supervisorEnforcementRegulation/get/${id}`),

  // 删除
  deleteImplementRules: id => http.get(`/supervisorEnforcementRegulation/update/deleteFlag/${id}`)
}
