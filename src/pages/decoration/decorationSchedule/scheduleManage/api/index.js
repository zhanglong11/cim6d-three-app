import http from '@/utils/http'

export default {
  /*进度管理*/
  // 进度列表
  getScheduleList: data => http.decoration.post(`/schedule/list`, data),

  // 进度列表-筛选功能-查询当前项目下的所有楼栋(仅楼栋信息)
  getBuildingDetail: projectId => http.decoration.get(`/constructionBuilding/detail/${projectId}`),

  // 进度列表-筛选功能-根据楼栋id查询单元、楼层、房间
  getBuildingUnitFloorRoomDetail: data => http.decoration.post(`/constructionBuilding/unit/floor/room/detail`, data),

  // 进度列表-筛选功能-工序组列表
  getProcedureGroupList: data => http.decoration.post(`/procedureGroup/list`, data),

  // 进度列表-开始装修
  startDecorate: scheduleId => http.decoration.get(`/schedule/startDecorate/${scheduleId}`),

  // 进度列表(装修状态:进行中、未开始、已完工)管理工序-工序组详情
  getManageProcedureDetail: data => http.decoration.post(`/app/schedule/procedure`, data),

  // 进度列表-查看详情(未开始、已完工)
  getScheduleDetail: scheduleId => http.decoration.get(`/schedule/procedure/${scheduleId}`),

  // 进度列表-材料及人工单
  getMaterialArtificialDetail: scheduleId => http.decoration.get(`/schedule/material/labourCharges/${scheduleId}`),

  // 进度列表-管理工序-完成工序-详情(房间号、工序组名称、工序名称、标准耗材)
  getScheduleProcedureDetail: scheduleProcedureId =>
    http.decoration.get(`/schedule/procedure/completeDetail/${scheduleProcedureId}`),

  // 进度列表-管理工序-完成工序-劳务公司列表
  getLabourCompanyAndGroup: data => http.decoration.post(`/labour/company/getCompanyAndGroup`, data),

  // 进度列表-管理工序-完成工序-不分页查询材料
  getAllMaterialList: data => http.decoration.post(`/material/list`, data),

  // 进度管理-管理工序-完成工序-提交
  completeScheduleProcedure: data => http.decoration.post(`/schedule/procedure/complete`, data),

  // 进度管理-管理工序-修改完成工序-提交
  updateCompleteScheduleProcedure: data => http.decoration.post(`/schedule/procedure/update`, data),

  // 进度管理-查看完成详情-批注提交
  allOperationScheduleProcedureRemark: data => http.decoration.post(`/scheduleProcedureRemark/allOperation`, data)
}
