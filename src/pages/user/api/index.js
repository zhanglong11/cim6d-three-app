import http from '@/utils/http'
export default {
  // 采购单删除
  getUserInfo: id => {
    return http.system.get(`/cim6d/system/user/get/${id}`)
    //return http.system.get(`/cim6d/system/user/current/get`)
  },
  updateUser: data => {
    return http.system.post('/cim6d/system/user/update', data, { isLoading: true })
  },
  changePassword: data => {
    return http.system.post('/cim6d/system/user/password/change', data, { isLoading: true })
  },
  // 查询个人配置 @author lizongliang
  queryAppIndexConfig: () => {
    return http.system.get('/appIndexConfig/query')
  },
  // 更新或新增首页配置 @author lizongliang
  saveOrUpdateAppIndexConfig: data => {
    return http.system.post('/appIndexConfig/saveOrUpdate', data)
  },
  // 发给我的消息
  queryMessageRecord: data => {
    return http.system.post('/message/record/receive/list', data)
  },
  // 我发出的消息
  queryMessageSend: data => {
    return http.system.post('/message/record/send/list', data)
  },
  // 批量已读 @author yangjiaqi
  messageBatchRead: data => {
    return http.system.post('/message/record/batchRead', data)
  },
  // 消息详情 @author yangjiaqi
  getMessageDetails: id => {
    return http.system.get(`/message/record/get/${id}`, { isLoading: true })
  },
  // 查询未读数量 @author yangjiaqi
  getUnreadMessage: () => {
    return http.system.get(`/message/record/unread/count`)
  }
}
