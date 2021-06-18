/*
领料管理的api
 */
import http from '@/utils/http'
export default {
  //获取楼栋列表:
  getBuildingList: projectId => {
    return http.decoration.get(`/constructionBuilding/detail/${projectId}`)
  },
  //获取楼栋列表:
  getRoomList: data => {
    return http.decoration.post(`/constructionBuilding/unit/floor/room/detail`, data)
  },
  //获取领料列表
  getPickList: data => {
    return http.decoration.post(`/picking/list`, data)
  },
  //删除
  deleteMaterialPick: data => {
    return http.decoration.post(`/picking/delete`, data)
  },
  //获取材料列表
  getStoreList: data => {
    return http.decoration.post(`/material/list`, data)
  },
  //获取材料列表(不分页)
  getStoreListAll: data => {
    return http.decoration.post(`/material/listAll`, data)
  },
  //添加/更新领料
  saveMaterialPick: data => {
    return http.decoration.post(`/picking/save`, data)
  },
  //添加/更新并审核领料
  saveAndSubmitMaterialPick: data => {
    return http.decoration.post(`/picking/saveAndSubmit`, data)
  },
  //获取领料详情
  getMaterialPickDetail: id => {
    return http.decoration.get(`/picking/get/${id}`)
  },

  //添加/更新采购
  saveMaterialPurchase: data => {
    return http.decoration.post(`/purchase/save`, data)
  },
  //添加/更新并审核采购
  saveAndSubmitMaterialPurchase: data => {
    return http.decoration.post(`/purchase/saveAndSubmit`, data)
  },
  //获取材料采购详情
  getMaterialPurchaseDetail: id => {
    return http.decoration.get(`/purchase/get/${id}`)
  },
  //确认到货提交
  saveMaterialPurchaseConfirm: data => {
    return http.decoration.post(`/purchase/confirm`, data)
  },
  //查询到货确认列表
  getMaterialPurchaseConfirmList: data => {
    return http.decoration.post(`/purchase/confirm/list`, data)
  }
}
