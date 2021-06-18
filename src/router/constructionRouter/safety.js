// 安全管理路由
module.exports = [
  {
    path: 'pages/safety/issue/index',
    style: {
      navigationBarTitleText: '安全文明问题',
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
    path: 'pages/safety/issue/add',
    style: {
      navigationBarTitleText: '新建',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/issue/detail',
    style: {
      navigationBarTitleText: '详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/issue/rectify',
    style: {
      navigationBarTitleText: '整改',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/special/add',
    style: {
      navigationBarTitleText: '新建特种作业施工申请',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/special/detail',
    style: {
      navigationBarTitleText: '特种作业施工申请详情',
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
    path: 'pages/safety/danger/index',
    style: {
      navigationBarTitleText: '危险源台账',
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
    path: 'pages/safety/danger/add',
    style: {
      navigationBarTitleText: '新建危险源',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/danger/detail',
    style: {
      navigationBarTitleText: '危险源详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/dangerCheck/index',
    style: {
      navigationBarTitleText: '危险源检查列表',
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
    path: 'pages/safety/dangerCheck/add',
    style: {
      navigationBarTitleText: '添加危险源检查',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '',
              fontSize: 14,
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
    path: 'pages/safety/dangerCheck/detail',
    style: {
      navigationBarTitleText: '详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/issue/review',
    style: {
      navigationBarTitleText: '复查',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/special/index',
    style: {
      navigationBarTitleText: '特种作业施工申请',
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
    path: 'pages/safety/safetyCulture/index',
    style: {
      navigationBarTitleText: '安全文明问题',
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
    path: 'pages/safety/safetyCulture/perilAdd',
    style: {
      navigationBarTitleText: '新建',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/safetyCulture/replyAdd',
    style: {
      navigationBarTitleText: '新建',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/safetyCulture/checkAdd',
    style: {
      navigationBarTitleText: '新建',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/safetyCulture/rectifyAdd',
    style: {
      navigationBarTitleText: '新建',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safety/safetyCulture/periDetail',
    style: {
      navigationBarTitleText: '问题详情',
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
    path: 'pages/safety/safetyCulture/replyDetail',
    style: {
      navigationBarTitleText: '问题详情',
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
    path: 'pages/safety/safetyCulture/checkDetail',
    style: {
      navigationBarTitleText: '问题详情',
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
    path: 'pages/safety/safetyCulture/rectifyDetail',
    style: {
      navigationBarTitleText: '问题详情',
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
