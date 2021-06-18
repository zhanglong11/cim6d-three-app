/*
质量管理的api
 */
import http from '@/utils/http'

export default {
  list: data => http.post(`/drawings/list`, data),

  add: data => http.post(`/drawings/add`, data),

  update: data => http.post(`/drawings/update`, data),

  detail: id => http.get(`/drawings/get/${id}`),

  remove: id => http.get(`/drawings/delete/${id}`)
}
