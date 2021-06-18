/*
质量管理的api
 */
import http from '@/utils/http'
export default {
  //获取采购列表
  getPurchaseList: data => {
    return http.decoration.post(`/purchase/list`, data)
  },
  //获取材料列表
  getStoreList: data => {
    return http.decoration.post(`/material/list`, data)
  },
  //获取材料列表(不分页)
  getStoreListAll: data => {
    return http.decoration.post(`/material/listAll`, data)
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
