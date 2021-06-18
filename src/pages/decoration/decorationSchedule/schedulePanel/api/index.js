import http from '@/utils/http'

export default {
  /*进度看板*/
  // 进度看板-整体进度
  getOverallSchedule: () => http.decoration.get(`/schedule/overallSchedule`),

  // 进度看板-月度进度-年月树信息获取
  getScheduleTimeLine: () => http.decoration.get(`/schedule/timeline`),

  // 进度看板-月度进度-条形图信息获取
  getMonthSchedule: data => http.decoration.post(`/schedule/monthSchedule`, data),

  // 进度看板-单元进度-饼图数据
  getUnitSchedule: data => http.decoration.post(`/schedule/unitSchedule`, data),

  // 进度看板-单元进度详情
  getUnitScheduleDetail: unitId => http.decoration.get(`/schedule/unit/${unitId}`)
}
