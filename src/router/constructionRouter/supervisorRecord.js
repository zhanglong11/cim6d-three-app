// 监理现场记录路由
module.exports = [
  {
    path: 'pages/supervisorRecord/log/index',
    style: {
      navigationBarTitleText: '监理日志',
      enablePullDownRefresh: true
    }
  },
  {
    path: 'pages/supervisorRecord/log/add',
    style: {
      navigationBarTitleText: '新建监理日志'
    }
  },
  {
    path: 'pages/supervisorRecord/log/detail',
    style: {
      navigationBarTitleText: '监理日志详情'
    }
  },
  {
    path: 'pages/supervisorRecord/weekly/index',
    style: {
      navigationBarTitleText: '监理周报',
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
    path: 'pages/supervisorRecord/weekly/add',
    style: {
      navigationBarTitleText: '新建监理周报'
    }
  },
  {
    path: 'pages/supervisorRecord/weekly/detail',
    style: {
      navigationBarTitleText: '监理周报详情',
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
    path: 'pages/supervisorRecord/monthly/index',
    style: {
      navigationBarTitleText: '监理月报',
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
    path: 'pages/supervisorRecord/monthly/add',
    style: {
      navigationBarTitleText: '新建监理月报'
    }
  },
  {
    path: 'pages/supervisorRecord/monthly/detail',
    style: {
      navigationBarTitleText: '监理月报详情',
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
    path: 'pages/supervisorRecord/record/index',
    style: {
      navigationBarTitleText: '旁站记录',
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
    path: 'pages/supervisorRecord/record/add',
    style: {
      navigationBarTitleText: '新建旁站记录'
    }
  },
  {
    path: 'pages/supervisorRecord/record/detail',
    style: {
      navigationBarTitleText: '旁站记录详情',
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
