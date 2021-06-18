import http from '@/utils/http'

export default {
  // 查询时间段内AQI数据 @author sunshihao
  queryYcSelectAqiYc: data => http.iotEquipmentMonitor.post(`/yc/selectAqiYc`, data),

  // 大屏实时环境监测 @author sunshihao
  queryYcCurrentInfo: data => http.iotEquipmentMonitor.post(`/yc/devCurrentInfo`, data),

  getList: data => http.iotEquipmentMonitor.post(`/iot/product/listAll`, data)
}
