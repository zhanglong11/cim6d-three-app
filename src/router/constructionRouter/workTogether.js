// 工作协同路由
module.exports = [
  {
    path: 'pages/projectDashboard/index',
    style: {
      navigationBarTitleText: '项目看板'
    }
  },
  {
    path: 'pages/task/index',
    style: {
      navigationBarTitleText: '任务列表',
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
    path: 'pages/task/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/task/detail',
    style: {
      navigationBarTitleText: '任务详情'
    }
  },
  {
    path: 'pages/task/result',
    style: {
      navigationBarTitleText: '任务结果填报'
    }
  },
  {
    path: 'pages/meeting/index',
    style: {
      navigationBarTitleText: '会议列表',
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
    path: 'pages/meeting/add',
    style: {
      navigationBarTitleText: '发起会议'
    }
  },
  {
    path: 'pages/meeting/detail',
    style: {
      navigationBarTitleText: '会议详情'
    }
  },
  {
    path: 'pages/meeting/upload',
    style: {
      navigationBarTitleText: '会议记录'
    }
  },
  {
    path: 'pages/message/index',
    style: {
      navigationBarTitleText: '消息中心',
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
    path: 'pages/message/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/message/detail',
    style: {
      navigationBarTitleText: '消息详情'
    }
  },
  {
    path: 'pages/projectOA/index',
    style: {
      navigationBarTitleText: 'OA管理',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '我的表单',
              fontSize: 14,
              color: 'white',
              key: 'myForm',
              width: '70px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/projectOA/formList',
    style: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '我的表单',
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
    path: 'pages/projectOA/customFormDetail',
    style: {
      navigationBarTitleText: '表单详情'
    }
  },
  {
    path: 'pages/projectOA/addCustomForm',
    style: {
      navigationBarTitleText: '添加'
    }
  }
]
