import http from '@/utils/http'
const { iot } = http

export default {
  //设备列表
  areaList: data => iot.post(`/iot/monitor/area/list`, data),

  //获取区域下监控设备
  getDeviceList: data => iot.post(`/monitor/device/queryList`, data),

  // 获取视频播放地址
  getVideoUrl: data => iot.post(`/monitorVideo/start`, data),

  // 视频实时直播
  touch: data => iot.post(`/monitorVideo/touch`, data)
}
