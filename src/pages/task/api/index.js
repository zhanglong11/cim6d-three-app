import http from '@/utils/http'
const { system } = http
export default {
  //列表
  list: data => system.post(`/task/list`, data),

  //添加
  add: data => system.post(`/task/add`, data),

  //添加
  update: data => system.post(`/task/update`, data),

  //详情
  detail: id => system.get(`/task/get/${id}`),

  //取消
  remove: id => system.get(`task/update/cancelFlag/${id}`),

  //催办
  urge: data => system.post(`/task/update/urgedFlag/`, data),

  //编辑
  result: data => system.post(`/task/update/taskResult`, data)
}
