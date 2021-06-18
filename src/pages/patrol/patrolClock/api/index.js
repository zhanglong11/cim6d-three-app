import http from '@/utils/http'

export default {
  // 列表
  getClockList: data => http.post(`/patrolClockIn/list`, data),

  // 详情
  getClockDetail: id => http.get(`/patrolClockIn/get/${id}`),

  // 保存
  getClockAdd: data => http.post(`/patrolClockIn/add`, data),
  getClockUpdate: data => http.post(`/patrolClockIn/update`, data)
}
