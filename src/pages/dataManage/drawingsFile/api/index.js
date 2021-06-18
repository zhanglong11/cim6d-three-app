import http from '@/utils/http'

export default {
  /*项目资料*/
  getTypeList: () => http.file.get(`/image/category/list`),

  getList: data => http.file.post(`/common/document/list`, data),

  addFolder: data => http.file.post(`/common/document/dir/add`, data),

  delete: id => http.file.get(`/common/document/delete/${id}`),

  remove: data => http.file.post(`/common/document/rename`, data),

  fileDetail: id => http.file.get(`/common/document/file/get/${id}`),

  getParent: id => http.file.get(`/common/document/parentName/get/${id}`),

  uploadFile: data => http.file.post(`/common/document/file/add`, data),

  // 列表
  getProjectDataList: data => http.post(`/project/document/list`, data),

  // 文件详情
  getFileInfo: id => {
    return http.file.get(`/file/manage/get/${id}`, {})
  },

  // 保存
  saveProjectData: data => http.post(`/project/document/save`, data),

  // 项目资料详情
  getProjectDataDetail: id => http.get(`/project/document/get/${id}`),

  // 删除
  deleteProjectData: id => http.get(`/project/document/delete/${id}`)
}
