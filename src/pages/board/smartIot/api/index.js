import http from '@/utils/http'
const { iot } = http

export default {
  //设备列表
  list: data => iot.post(`/iot/device/list`, data),

  //设备类型
  getProductList: data => iot.post(`/iot/product/listAll`, data),

  //设备信息
  getEquipmentInfo: data => iot.post(`/tadiao/selectTowerTelemetryData`, data),

  getElevatorInfo: data => iot.post(`/lifter/selectLifterTelemetryData`, data),

  //报警信息
  alarmList: data => iot.post(`/tadiao/selectAlarmDataPage`, data),

  // 获取视频播放地址
  getVideoUrl: data => iot.post(`/monitorVideo/start`, data),

  // 视频实时直播
  touch: data => iot.post(`/monitorVideo/touch`, data),

  eleDetail: id => iot.get(`/hrsd/selectElectricityAmount/${id}`),

  waterDetail: id => iot.get(`/hrsd/selectWaterAmount/${id}`)
}
