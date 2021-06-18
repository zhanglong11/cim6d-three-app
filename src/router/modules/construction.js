// 施工路由汇总
module.exports = {
  children: [
    ...require('../constructionRouter/components'), // 通用组件路由
    ...require('../constructionRouter/contact'), // 通讯录路由
    ...require('../constructionRouter/user'), // 我的 路由
    ...require('../constructionRouter/schedule'), // 进度任务路由
    ...require('../constructionRouter/dataManage'), // 资料管理路由
    ...require('../constructionRouter/quality'), // 质量管理路由
    ...require('../constructionRouter/safety'), // 安全管理路由
    ...require('../constructionRouter/material'), // 材料管理路由
    ...require('../constructionRouter/equipment'), // 设备管理路由
    ...require('../constructionRouter/supervisorPlan'), // 监理规划管理路由
    ...require('../constructionRouter/supervisorRecord'), // 监理现场记录路由
    ...require('../constructionRouter/constructionLog'), // 施工日志路由
    ...require('../constructionRouter/workTogether'), // 工作协同路由
    ...require('../constructionRouter/board'), // 工作协同路由
    ...require('../constructionRouter/drawingsManage'), // 图纸管理
    ...require('../constructionRouter/patrol'), //巡更打卡
    ...require('../constructionRouter/attendance'), //考勤
    ...require('../constructionRouter/attendanceWl')
  ]
}
