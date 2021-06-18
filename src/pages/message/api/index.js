import http from '@/utils/http'
const { system } = http
export default {
  // 列表
  receiveList: data => system.post(`/message/record/receive/list`, data),
  // 列表
  sendList: data => system.post(`/message/record/send/list`, data),
  // 添加
  add: data => system.post(`/message/record/person/add`, data),
  // 详情
  detail: id => system.get(`/message/record/get/${id}`),
  // 已读
  read: data => system.post(`/message/record/batchRead`, data),
  // 微信推送消息
  queryWxSendMessage: data => system.post(`/message/record/wxSendMessage/list`, data),
  // 微信推送消息详情
  hetWxMessageDetail: id => system.get(`/message/record/wxMessage/receiverList/${id}`)
}
