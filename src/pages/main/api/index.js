/*
 * @Author: 耿为刚 创建
 * @Date: 2020-05-25
 * @Last Modified by: gengweigang
 */

import http from '@/utils/http'
export const mainApi = {
  // 获取我的工作 - 精装修
  queryDecorationWork: data => {
    return http.decoration.post(`/index/work/view`, data)
  },
  // 获取我的工作 - 施工
  queryConstructionWork: data => {
    return http.construction.post(`/index/work/view`, data)
  },
  // 进度看板--整体进度 @author lizongliang
  getScheduleOverallSchedule: () => {
    return http.decoration.get(`/schedule/overallSchedule`)
  },

  //获取项目详情
  getProjectDetail: id => http.system.get(`/cim6d/system/project/get/${id}`)
}
