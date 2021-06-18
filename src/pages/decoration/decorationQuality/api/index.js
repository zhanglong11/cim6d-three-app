/*
质量管理的api
 */
import http from '@/utils/http'
export default {
  //获取楼栋列表:
  getBuildingList: projectId => {
    return http.decoration.get(`/constructionBuilding/detail/${projectId}`)
  },
  //获取楼栋列表:
  getRoomList: data => {
    return http.decoration.post(`/constructionBuilding/unit/floor/room/detail`, data)
  },
  //获取问题列表
  getProblemList: data => {
    return http.decoration.post('/decoration/quality/problem/list', data)
  },
  // 获取图纸列表
  getDrawingList: roomId => {
    return http.decoration.get(`/drawings/get/byRoomId/${roomId}`)
  },
  //新建
  addQualityProblem: data => {
    return http.decoration.post(`/decoration/quality/problem/batchAdd`, data)
  },
  //保存并下达
  addAndReleaseQualityProblem: data => {
    return http.decoration.post(`/decoration/quality/problem/batchAddAndRelease`, data)
  },
  //更新
  updateQualityProblem: data => {
    return http.decoration.post(`/decoration/quality/problem/update`, data)
  },
  //下达问题
  releaseQualityProblemById: id => {
    return http.decoration.get(`/decoration/quality/problem/release/${id}`)
  },
  //问题详情
  getQualityProblemDetail: id => {
    return http.decoration.get(`/decoration/quality/problem/get/${id}`)
  },
  //删除问题
  deleteQualityProblemById: id => {
    return http.decoration.get(`/decoration/quality/problem/delete/${id}`)
  },
  //整改保存
  handleRectify: data => {
    return http.decoration.post('/decoration/quality/problem/rectify', data)
  },
  //复查保存
  handleReview: data => {
    return http.decoration.post('/decoration/quality/problem/review', data)
  }
}
