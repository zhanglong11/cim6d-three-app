// 进度管理-查询进度任务列表 @author yangjiaqi
import { schedule } from '@/utils/http'
// 进度管理-查询未完成进度人物 @author yangjiaqi
export const getUnfinishedTaskOwnList = data => {
  return schedule.post('/task/unfinished/list', data)
}
// 任务详情
export const getScheduleTaskByTaskId = taskId => {
  return schedule.get('/task/get/' + taskId)
}
// 进度管理-领取任务 @author yangjiaqi
export const getScheduleTaskReceive = taskId => {
  return schedule.get(`/task/receive/${taskId}`)
}
// 进度管理-分配任务 @author yangjiaqi
export const distributionScheduleTask = data => {
  return schedule.post('/task/distribution', data)
}
// 进度管理-查看分配记录 @author yangjiaqi
export const recordDistributionTask = taskId => {
  return schedule.get(`/task/distribution/record/${taskId}`)
}
// 进度管理-开始任务 @author yangjiaqi
export const startScheduleTask = taskId => {
  return schedule.get(`/task/start/${taskId}`)
}
// 进度管理-结束任务 @author yangjiaqi
export const finishScheduleTask = taskId => {
  return schedule.get(`/task/finish/${taskId}`)
}
// 进度管理-进度任务确认 @author yangjiaqi
export const confirmTask = data => {
  return schedule.post('/task/confirm', data)
}
// 延期解决方案-提交 @author yangjiaqi
export const delayProgram = data => {
  return schedule.post('/delayProgram/submit', data)
}

// 进度工期变更-提交 @author yangjiaqi
export const changeDurationTask = data => {
  return schedule.post('/task/duration/change', data)
}
// 进度工期变更-关联任务列表 @author yangjiaqi
export const queryTaskLink = taskId => {
  return schedule.get(`/task/link/${taskId}`)
}
