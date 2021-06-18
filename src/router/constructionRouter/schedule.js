// 进度任务路由
module.exports = [
  {
    path: 'pages/schedule/index',
    style: {
      navigationBarTitleText: '进度任务',
      titleNView: {
        buttons: [
          {
            text: '\uE607',
            fontSize: 26,
            color: 'white',
            fontSrc: '/static/fonts/iconfont.ttf',
            key: 'filter'
          }
        ]
      }
    }
  },
  {
    path: 'pages/schedule/detail',
    style: {
      navigationBarTitleText: '任务详情'
    }
  },
  {
    path: 'pages/schedule/assign',
    style: {
      navigationBarTitleText: '分配任务'
    }
  },
  {
    path: 'pages/schedule/completeTask',
    style: {
      navigationBarTitleText: '结束任务'
    }
  },
  {
    path: 'pages/schedule/delayTaskPlan',
    style: {
      navigationBarTitleText: '延期解决方案'
    }
  },
  {
    path: 'pages/schedule/delayAllLinkTask',
    style: {
      navigationBarTitleText: '延后所有关联任务'
    }
  },
  {
    path: 'pages/schedule/advanceAllLinkTask',
    style: {
      navigationBarTitleText: '提前所有关联任务'
    }
  },
  {
    path: 'pages/schedule/assignHistory',
    style: {
      navigationBarTitleText: '任务分配记录'
    }
  },
  {
    path: 'pages/schedule/changeRecord',
    style: {
      navigationBarTitleText: '任务变更记录'
    }
  }
]
