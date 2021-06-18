import http from '@/utils/http'

export default {
  /*工序验收*/
  // 工序验收-列表-分页
  getAcceptanceList: data => http.decoration.post(`/schedule/acceptance/list`, data),

  // 工序验收-录入验收结果
  addAcceptanceResult: data => http.decoration.post(`/schedule/acceptance/addResult`, data),

  // 工序验收-查看详情
  getAcceptanceDetail: id => http.decoration.get(`/schedule/acceptance/get/${id}`)
}
