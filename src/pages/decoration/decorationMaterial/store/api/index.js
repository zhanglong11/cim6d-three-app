/*
质量管理的api
 */
import http from '@/utils/http'
export default {
  //获取品牌和供应商列表
  getBrandAndSupplierList: data => {
    return http.decoration.post(`/material/search/list`, data)
  },
  //添加材料类型
  addMaterialType: data => {
    return http.decoration.post(`/material/add`, data)
  },
  //更新材料类型
  updateMaterialType: data => {
    return http.decoration.post(`/material/update`, data)
  },
  //删除材料类型
  deleteMaterialType: data => {
    return http.decoration.post(`/material/delete`, data)
  },
  //获取库存列表
  getStoreList: data => {
    return http.decoration.post(`/material/list`, data)
  },
  //库存盘点提交
  updateMaterialStoreInventory: data => {
    return http.decoration.post(`/material/check`, data)
  },
  //获取材料库存详情
  getMaterialStoreDetail: id => {
    return http.decoration.get(`/material/inventory/get/${id}`)
  }
}
