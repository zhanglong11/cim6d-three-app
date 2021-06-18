import http from '@/utils/http'

export default {
  //监理日志列表
  getLogList: data => {
    return http.decoration.post(`/decoration/supervisorDailyReport/list`, data)
  },
  //监理日志添加
  getLogAdd: data => {
    return http.decoration.post(`/decoration/supervisorDailyReport/add`, data)
  },
  //监理日志编辑
  getLogUpdate: data => {
    return http.decoration.post(`/decoration/supervisorDailyReport/update`, data)
  },
  //监理日志详情
  getLogInfo: id => {
    return http.decoration.get(`/decoration/supervisorDailyReport/get/${id}`)
  },
  //监理日志删除
  getLogDelete: id => {
    return http.decoration.get(`/decoration/supervisorDailyReport/delete/${id}`)
  },
  //监理日志签阅
  getLogSign: data => {
    return http.decoration.post(`/decoration/supervisorDailyReport/sign`, data)
  },
  //监理周报列表
  getWeeklyList: data => {
    return http.decoration.post(`/decoration/supervisorWeeklyReport/list`, data)
  },
  //监理周报添加
  getWeeklyAdd: data => {
    return http.decoration.post(`/decoration/supervisorWeeklyReport/add`, data)
  },
  //监理周报修改
  getWeeklyUpdate: data => {
    return http.decoration.post(`/decoration/supervisorWeeklyReport/update`, data)
  },
  //监理周报详情
  getWeeklyInfo: id => {
    return http.decoration.get(`/decoration/supervisorWeeklyReport/get/${id}`)
  },
  //监理周报删除
  getWeeklyDelete: id => {
    return http.decoration.get(`/decoration/supervisorWeeklyReport/delete/${id}`)
  },
  //监理周报签阅
  getWeeklySign: data => {
    return http.decoration.post(`/decoration/supervisorWeeklyReport/sign`, data)
  },
  //监理月报列表
  getMonthlyList: data => {
    return http.decoration.post(`/decoration/supervisorMonthReport/list`, data)
  },
  //监理月报添加
  getMonthlyAdd: data => {
    return http.decoration.post(`/decoration/supervisorMonthReport/add`, data)
  },
  //
  getMonthlyUpdate: data => {
    return http.decoration.post(`/decoration/supervisorMonthReport/update`, data)
  },
  //监理月报详情
  getMonthlyInfo: id => {
    return http.decoration.get(`/decoration/supervisorMonthReport/get/${id}`)
  },
  //监理月报删除
  getMonthlyDelete: id => {
    return http.decoration.get(`/decoration/supervisorMonthReport/delete/${id}`)
  },
  //监理日报根据月份查询所有日期
  getDailyList: data => {
    return http.decoration.post(`/decoration/supervisorDailyReport/selectMonthDaily`, data)
  }
}
