// 巡更管理路由
module.exports = [
  {
    path: 'pages/patrol/patrolClock/index',
    style: {
      navigationBarTitleText: '巡更打卡',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/patrol/patrolClock/add',
    style: {
      navigationBarTitleText: '新建巡更打卡',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/patrol/patrolClock/detail',
    style: {
      navigationBarTitleText: '巡更打卡详情',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '编辑',
              fontSize: 14,
              color: 'white',
              key: 'menu',
              width: '34px'
            }
          ]
        }
      }
    }
  }
]
