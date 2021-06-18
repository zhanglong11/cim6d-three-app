/*
质量管理的api
 */
import http from '@/utils/http'
export default {
  //日志列表
  getLogList: data => {
    return http.decoration.post(`/decoration/dailyDiary/list`, data)
  },
  //获取一个月哪些天提交了日志
  getMonthLogDayData: data => {
    return http.decoration.post(`/decoration/dailyDiary/selectMonthDaily`, data)
  },
  //获取公司班组列表:
  getCompanyGroupList: data => {
    return http.decoration.post(`/labour/company/getCompanyAndGroup`, data)
  },
  //获取人员列表:
  getPersonList: data => {
    return http.decoration.post(`/labour/employee/list`, data)
  },
  //日志详情
  getLogDetail: id => {
    return http.decoration.get(`/decoration/dailyDiary/get/${id}`)
  },
  //日志删除
  deleteLogById: id => {
    return http.decoration.get(`/decoration/dailyDiary/delete/${id}`)
  },
  //新建日志
  add: data => {
    return http.decoration.post(`/decoration/dailyDiary/add`, data)
  },
  //更新日志
  updateLog: data => {
    return http.decoration.post(`/decoration/dailyDiary/update`, data)
  }
}
