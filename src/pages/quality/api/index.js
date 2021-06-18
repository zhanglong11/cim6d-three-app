/*
质量管理的api
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
  //验收申请列表
  getInspectionList: data => {
    return http.post('qualityAcceptanceApply/list', data)
  },
  //验收申请列表
  getInspectionInfo: id => {
    return http.get(`qualityAcceptanceApply/get/${id}`, {})
  },
  //验收申请保存
  getInspectionSave: data => {
    return http.post('qualityAcceptanceApply/save', data)
  },
  //验收申请保存并提交
  getInspectionSaveAndSubmit: data => {
    return http.post('qualityAcceptanceApply/saveAndSubmit', data)
  },
  //删除计划
  deleteInspectionById: data => {
    return http.post(`qualityAcceptanceApply/batchDelete`, data)
  },

  //关联
  link: data => http.post(`bim/bind`, data),

  //新工程质量通知单
  //提交工程质量通知单
  //删除
  getQualityProblemDelete: data => http.post(`/qualityProblem/batchDelete`, data),
  //列表
  getQualityProblem: data => http.post(`/qualityProblem/list`, data),
  //提交
  getEngineersaveAndSubmit: data => http.post(`/engineeringQualityNotice/saveAndSubmit`, data),
  //详情
  getEngineeringDetail: id => http.get(`/engineeringQualityNotice/get/${id}`),
  //草稿
  getEngineerSave: data => http.post(`/engineeringQualityNotice/save`, data),
  //修改
  getEngineerUpdate: data => http.post(`/engineeringQualityNotice/update`, data),
  //修改并提交
  getEngineerUpdateAndSub: data => http.post(`/engineeringQualityNotice/updateAndSubmit`, data),

  //工程业务联系单
  //提交
  getBusinesssaveAndSubmit: data => http.post(`/engineeringBusinessContact/saveAndSubmit`, data),
  //详情
  getBusinessDetail: id => http.get(`/engineeringBusinessContact/get/${id}`),
  //草稿
  getBusinessSave: data => http.post(`/engineeringBusinessContact/save`, data),
  //修改
  getBusinessUpdate: data => http.post(`/engineeringBusinessContact/update`, data),
  getBusinessUpdateAndSubmit: data => http.post(`/engineeringBusinessContact/updateAndSubmit`, data),

  //工作业务联系
  //提交
  getworkAndSubmit: data => http.post(`/workBusinessContact/saveAndSubmit`, data),
  //详情
  getworkDetail: id => http.get(`/workBusinessContact/get/${id}`),
  //草稿
  getworksSave: data => http.post(`/workBusinessContact/save`, data),
  //修改
  getworksUpdate: data => http.post(`/workBusinessContact/update`, data),
  getworksUpdateAndSub: data => http.post(`/workBusinessContact/updateAndSubmit`, data)
}
