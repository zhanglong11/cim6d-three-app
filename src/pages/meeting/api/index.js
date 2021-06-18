import http from '@/utils/http'
const { system } = http
export default {
  //列表
  list: data => system.post(`/meeting/list`, data),

  //添加
  add: data => system.post(`/meeting/add`, data),

  //编辑
  update: data => system.post(`/meeting/update`, data),

  //取消
  remove: data => system.post(`/meeting/batchDelete`, data),

  //详情
  detail: id => system.get(`/meeting/get/${id}`)
}
