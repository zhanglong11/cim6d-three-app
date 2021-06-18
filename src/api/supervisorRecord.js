import axios from '@/utils/http'
export default {
  //监理日志列表
  getLogList: data => {
    return axios.construction.post(`/supervisorDailyReport/list`, data)
  },
  //监理日志添加
  getLogAdd: data => {
    return axios.construction.post(`/supervisorDailyReport/save`, data)
  },
  //监理日志详情
  getLogInfo: id => {
    return axios.construction.get(`/supervisorDailyReport/get/${id}`)
  },
  //监理日志删除
  getLogDelete: data => {
    return axios.construction.post(`/supervisorDailyReport/delete`, data)
  },
  //监理日志签阅
  getLogSign: data => {
    return axios.construction.post(`/supervisorDailyReport/sign`, data)
  },
  //监理周报列表
  getWeeklyList: data => {
    return axios.construction.post(`/supervisorWeeklyReport/list`, data)
  },
  //监理周报添加
  getWeeklyAdd: data => {
    return axios.construction.post(`/supervisorWeeklyReport/save`, data)
  },
  //监理周报详情
  getWeeklyInfo: id => {
    return axios.construction.get(`/supervisorWeeklyReport/get/${id}`)
  },
  //监理周报删除
  getWeeklyDelete: data => {
    return axios.construction.post(`/supervisorWeeklyReport/delete`, data)
  },
  //监理周报签阅
  getWeeklySign: data => {
    return axios.construction.post(`/supervisorWeeklyReport/sign`, data)
  },
  //监理月报列表
  getMonthlyList: data => {
    return axios.construction.post(`/supervisorMonthlyReport/list`, data)
  },
  //监理月报添加
  getMonthlyAdd: data => {
    return axios.construction.post(`/supervisorMonthlyReport/save`, data)
  },
  //监理月报详情
  getMonthlyInfo: id => {
    return axios.construction.get(`/supervisorMonthlyReport/get/${id}`)
  },
  //监理月报删除
  getMonthlyDelete: data => {
    return axios.construction.post(`/supervisorMonthlyReport/delete`, data)
  },
  //监理记录列表
  getRecordList: data => {
    return axios.construction.post(`/supervisor/sitestation/list`, data)
  },
  //监理记录添加
  getRecordAdd: data => {
    return axios.construction.post(`/supervisor/sitestation/add`, data)
  },
  //监理记录更新
  getRecordUpdate: data => {
    return axios.construction.post(`/supervisor/sitestation/update`, data)
  },
  //监理记录详情
  getRecordInfo: id => {
    return axios.construction.get(`/supervisor/sitestation/get/${id}`)
  },
  //监理记录删除
  getRecordDelete: data => {
    return axios.construction.post(`/supervisor/sitestation/batchDelete`, data)
  }
}
