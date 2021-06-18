// 监理规划管理路由
module.exports = [
  {
    path: 'pages/supervisorPlan/planRegistration/index',
    style: {
      navigationBarTitleText: '监理规划登记',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE607',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'screen'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/supervisorPlan/planRegistration/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/supervisorPlan/planRegistration/detail',
    style: {
      navigationBarTitleText: '监理规划登记详情',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              type: 'menu'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/supervisorPlan/implementRules/index',
    style: {
      navigationBarTitleText: '监理实施细则',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE607',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'screen'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/supervisorPlan/implementRules/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/supervisorPlan/implementRules/detail',
    style: {
      navigationBarTitleText: '监理实施细则详情',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              type: 'menu'
            }
          ]
        }
      }
    }
  }
]
