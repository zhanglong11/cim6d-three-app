import http from '@/utils/http'
export default {
  getArgTree() {
    return http.system.post('cim6d/arg/tree',{module: "construction"}).then(res => res.data)
  }
}
