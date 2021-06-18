import http from '@/utils/http'
const { iot } = http
export default {
  /*验收规范*/
  // 详情 日历
  getCheckSpecificListdel: data => iot.post(`/deli/selectAttendanceStatistics`, data),

  // 列表
  getCheckSpecificdlList: data => iot.post(`/deli/getEmploeeKqInfo`, data),

  // 异常人信息
  getCheckSpecificdetaildl: data => iot.post(`/deli/selectDepartmentStatisticalInformation`, data),

  // 详情
  getCheckSpecificDetail: id => iot.get(`/quality/checkSpecific/get/${id}`),

  // 删除
  deleteCheckSpecific: id => iot.get(`/quality/checkSpecific/delete/${id}`),

  //管理人员统计图
  getEmploeeKqinInfo: () => iot.post(`/deli/getEmploeeKqInfo`),
  getDeGlInformation: data => iot.post(`/deli/selectDepartmentStatisticalInformation`, data),
  //劳务人员统计图
  getLabourEmploeeKqinfo: () => iot.post(`/deli/getLabourEmploeeKqInfo`),
  gettLabourDeInformation: data => iot.post(`/deli/selectLabourDepartmentStatisticalInformation`, data)
}
