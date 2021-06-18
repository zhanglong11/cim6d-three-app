import http from '@/utils/http'

export default {
  /*项目资料*/
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
