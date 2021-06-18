/*
安全帽管理的api
 */
import http from '@/utils/http'
export default {
  // 获取安全帽列表
  getCapsList: data => {
    return http.iot.post('/safeCap/getSafeCapDeviceList', data)
  },
  //获取报警详情
  getCapDetail: data => {
    return http.iot.post(`/safeCap/getSosList`, data)
  },
  //获取轨迹详情
  getTrackDetail: data => {
    return http.iot.post(`/safeCap/getUserPathList`, data)
  },
  //获取轨迹列表详情
  getTrackListDetail: data => {
    return http.iot.post(`/safeCap/getTrackDetailsByUrl`, data)
  },
  //获取设备定位
  getCapPositions: projectId => {
    return http.iot.get(`/safeCap/getSafeCapTotal/${projectId}`)
  },
  //近七天报警数据
  getSevenDayAlarmInfo: projectId => {
    return http.iot.get(`/safeCap/getSOsSummaryStatistics/${projectId}`)
  },
  //近七天在线时长
  getSevenDayTimeInfo: projectId => {
    return http.iot.get(`/safeCap/getDevicesOnlineTimeDaysByUrl/${projectId}`)
  }
}
