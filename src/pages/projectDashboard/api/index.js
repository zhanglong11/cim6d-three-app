/*
项目看板的api
*/
import http from '@/utils/http'
export default {
  //项目概况信息
  getProcedureInfo: () => {
    return http.get('/schedule/task/app/panel')
  },
  //质量检查
  getQualityInfo: data => {
    return http.post('/inspectProblem/queryCircle', data)
  },
  //安全检查
  getSafetyInfo: data => {
    return http.post('/inspectPlan/saveAndEnable', data)
  }
}
