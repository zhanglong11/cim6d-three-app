import http from '@/utils/http'
const { iot } = http

export default {
  // 打卡
  getAttendanceClockIn: data => iot.post(`/deli/saveDataKq`, data),

  // 考勤统计
  getAttendanceClockInTj: data => iot.post(`/deli/selectAttendanceStatistics`, data),

  //判断是否超出范围
  getAttendanceClockInRange: data => http.post(`/attendanceClockIn/judge/range`, data),

  // 打卡信息
  getAttendanceClockInInfo: data => iot.post(`/deli/selectAttendanceDailyStatistics`, data),
  //打卡月历
  getAttendanceClockInyl: data => iot.post(`/deli/selectAttendanceMonthlyCalendar`, data),

  //查询默认安全教育视频

  getAttendanceClocVideo: data => http.get(`/safetyEducationVideo/default`, data),

  //修改备注
  getRemarklInformation: data => iot.post(`/deli/updateRemark`, data),

  getPhoneList: data => http.post(`/attendanceGroup/rule/query/byMobile`, data)
}
