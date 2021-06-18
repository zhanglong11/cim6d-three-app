import http from '@/utils/http'

export default {
  /*安全管理制度*/
  // 列表
  getManageRegimeList: data => http.post(`/manageRegime/list`, data),

  // 新增
  addManageRegime: data => http.post(`/manageRegime/add`, data),

  // 编辑
  updateManageRegime: data => http.post(`/manageRegime/update`, data),

  // 详情
  getManageRegimeDetail: id => http.get(`/manageRegime/get/${id}`),

  // 删除
  deleteManageRegime: id => http.get(`/manageRegime/delete/${id}`)
}
