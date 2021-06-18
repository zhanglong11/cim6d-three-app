/*
安全管理的api
 */
import http from '@/utils/http'
export default {
  //保存检查计划
  savePlan: data => {
    return http.post('/inspectPlan/save', data)
  },
  //保存并启用检查计划
  saveAndStartPlan: data => {
    return http.post('/inspectPlan/saveAndEnable', data)
  },
  // 获取检查计划列表
  getPlanList: data => {
    return http.post('/inspectPlan/list', data)
  },
  //获取计划详情
  getPlanDetail: id => {
    return http.get(`/inspectPlan/get/${id}`, {})
  },
  //删除计划
  deletePlanById: data => {
    return http.post(`/inspectPlan/batchDelete`, data)
  },
  //停用计划
  stopPlanById: id => {
    return http.get(`/inspectPlan/disable/${id}`, {})
  },
  //启用计划
  startPlanById: id => {
    return http.get(`/inspectPlan/enable/${id}`, {})
  },
  //根据检查id获取问题详细列表
  getIssueListByInspectId: id => {
    return http.get(`/inspectPlan/inspectProblem/listAll/${id}`, {})
  },
  //添加检查情况
  addIssueInspectList: data => {
    return http.post('/inspectPlan/inspectProblem/add', data)
  },
  //获取问题列表
  getIssueList: data => {
    return http.post('/inspectProblem/list', data)
  },
  //获取问题详情
  getIssueDetailById: id => {
    return http.get(`/inspectProblem/get/${id}`, {})
  },
  //保存问题
  saveIssue: data => {
    return http.post('/inspectProblem/save', data)
  },
  //保存并下达问题
  saveAddReleaseIssue: data => {
    return http.post('/inspectProblem/saveAndRelease', data)
  },
  //删除问题
  deleteIssueById: data => {
    return http.post('/inspectProblem/batchDelete', data)
  },
  //问题下达
  releaseIssueById: id => {
    return http.get(`/inspectProblem/release/${id}`, {})
  },
  //整改保存
  handleRectify: data => {
    return http.post('/inspectProblem/rectify', data)
  },
  //复查保存
  handleReview: data => {
    return http.post('/inspectProblem/review', data)
  },
  //特殊作业
  //获取特殊作业申请列表
  getSpecialList: data => {
    return http.post('/safetySpecialOperationApply/list', data)
  },
  //保存特种作业申请
  addSpecial: data => {
    return http.post('/safetySpecialOperationApply/save', data)
  },
  //保存并提交特种作业申请
  submitSpecial: data => {
    return http.post('/safetySpecialOperationApply/submitAndAudit', data)
  },
  //获取特种作业申请详情
  getSpecialDetail: id => {
    return http.get(`/safetySpecialOperationApply/get/${id}`, {})
  },
  //删除特种作业申请
  deleteSpecialById: data => {
    return http.post(`/safetySpecialOperationApply/delete`, data)
  },
  //危险源
  //危险源列表
  getDangerList: data => {
    return http.post(`/dangersource/list`, data)
  },
  //添加危险源
  addDanger: data => {
    return http.post(`/dangersource/add`, data)
  },
  //更新危险源
  updateDanger: data => {
    return http.post(`/dangersource/update`, data)
  },
  //删除危险源
  deleteDanger: data => {
    return http.post(`/dangersource/batchDelete`, data)
  },
  //获取详情
  getDangerDetail: id => {
    return http.get(`/dangersource/get/${id}`, {})
  },
  //危险源整改复查列表
  getDangerInspectList: data => {
    return http.post(`/inspectDangerSource/list`, data)
  },
  //危险源检查详情
  getDangerInspectDetail: id => {
    return http.get(`/inspectDangerSource/get/${id}`, {})
  },
  //危险源整改保存
  handleDangerRectify: data => {
    return http.post('/inspectDangerSource/rectify', data)
  },
  //危险源复查保存
  handleDangerReview: data => {
    return http.post('/inspectDangerSource/review', data)
  },
  //获取所有危险源
  getAllDangerList: data => {
    return http.post(`/dangersource/listAll`, data)
  },
  //获取所有位置
  getPositionList: id => {
    return http.get(`/inspectDangerSource/getPlace/${id}`, {})
  },
  //添加危险源检查
  addDangerInspect: data => {
    return http.post(`/inspectDangerSource/add`, data)
  },
  //关联
  link: data => http.post(`/bim/link`, data),
  //验收申请列表
  getInspectionList: data => {
    return http.construction.post('qualityAcceptanceApply/list', data)
  },
  //验收申请详情
  getInspectionInfo: id => {
    return http.construction.get(`qualityAcceptanceApply/get/${id}`, {})
  },
  //验收申请保存
  getInspectionSave: data => {
    return http.construction.post('qualityAcceptanceApply/save', data)
  },
  //验收申请保存并提交
  getInspectionSaveAndSubmit: data => {
    return http.construction.post('qualityAcceptanceApply/saveAndSubmit', data)
  },
  //验收申请删除
  deleteInspectionById: data => {
    return http.construction.post(`qualityAcceptanceApply/batchDelete`, data)
  },
  //
  //新安全文明接口
  //安全隐患
  //删除
  getsafetyHiddenDelete: data => {
    return http.construction.post(`/safetyProblem/batchDelete`, data)
  },
  //列表
  getsafetyHiddenList: data => {
    return http.construction.post(`/safetyProblem/list`, data)
  },
  getsafetyHiddenSave: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/save`, data)
  },
  getsafetyHiddenUpdate: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/update`, data)
  },
  getsafetyHiddenDetail: id => {
    return http.construction.get(`/safetyHiddenDangerCheckRecord/get/${id}`)
  },
  //查询时间范围内的安全隐患检查明细记录
  getsafetyHiddenTimeAnd: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/selectHiddenDangerCheckRecordDetails`, data)
  },
  //下载隐患
  getSafetyHiddenDwon: id => {
    return http.construction.get(`/safetyHiddenDangerCheckRecord/download/${id}`, { responseType: 'blob' })
  },
  //周安全检查回复表
  //草稿
  getReplySave: data => {
    return http.construction.post(`/safetyWeekCheckReply/save`, data)
  },
  getReplySubmit: data => {
    return http.construction.post(`/safetyWeekCheckReply/saveAndSubmit`, data)
  },
  getReplyUpdate: data => {
    return http.construction.post(`/safetyWeekCheckReply/update`, data)
  },
  getReplyUpdateAndSubmit: data => {
    return http.construction.post(`/safetyWeekCheckReply/updateAndSubmit`, data)
  },
  getReplyDetail: id => {
    return http.construction.get(`/safetyWeekCheckReply/get/${id}`)
  },
  //下载-工程质量通知单
  getWeekCheckDown: id => {
    return http.construction.get(`/safetyWeekCheckReply/download/${id}`, { responseType: 'blob' })
  },
  //下载-周安全检查回复表格
  getWeekCheckDownForm: id => {
    return http.construction.get(`/safetyWeekCheckReply/downloadForm/${id}`, { responseType: 'blob' })
  },
  //安全月度联合检查回复表
  //草稿
  getcheckSave: data => {
    return http.construction.post(`/safetyMonthCheckReply/save`, data)
  },
  getcheckSubmit: data => {
    return http.construction.post(`/safetyMonthCheckReply/saveAndSubmit`, data)
  },
  getcheckUpdate: data => {
    return http.construction.post(`/safetyMonthCheckReply/update`, data)
  },
  getcheckUpdateAndSubmit: data => {
    return http.construction.post(`/safetyMonthCheckReply/updateAndSubmit`, data)
  },
  getcheckDetail: id => {
    return http.construction.get(`/safetyMonthCheckReply/get/${id}`)
  },
  //下载-安全月度联合检查回复
  getSafetyMonthDwon: id => {
    return http.construction.get(`/safetyMonthCheckReply/download/${id}`, { responseType: 'blob' })
  },
  //下载-安全月度联合检查回复
  getSafetyMonthDwonFrom: id => {
    return http.construction.get(`/safetyMonthCheckReply/downloadForm/${id}`, { responseType: 'blob' })
  },
  //质量安全整改回复单
  //草稿
  getrectifySave: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/save`, data)
  },
  getrectifySubmit: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/saveAndSubmit`, data)
  },
  getrectifyUpdate: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/update`, data)
  },
  getrectifyUpdateAndSubmit: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/updateAndSubmit`, data)
  },
  getrectifyDetail: id => {
    return http.construction.get(`/qualitySafetyRectificationReply/get/${id}`)
  },
  //下载-安全整改回复
  getQualitySafetyDown: id => {
    return http.construction.get(`/qualitySafetyRectificationReply/download/${id}`, { responseType: 'blob' })
  }
}
