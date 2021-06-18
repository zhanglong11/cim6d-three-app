// 质量管理路由
module.exports = [
  {
    path: 'pages/quality/index',
    style: {
      navigationBarTitleText: '质量问题',
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
    path: 'pages/quality/add',
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
    path: 'pages/quality/detail',
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
    path: 'pages/quality/rectify',
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
    path: 'pages/quality/review',
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
    path: 'pages/quality/inspection/index',
    style: {
      navigationBarTitleText: '质量验收',
      navigationBarBackgroundColor: '#496FE5',
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
    path: 'pages/quality/problemsz/index',
    style: {
      navigationBarTitleText: '质量问题',
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
    path: 'pages/quality/inspection/add',
    style: {
      navigationBarTitleText: '新建',
      navigationBarBackgroundColor: '#496FE5',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/quality/inspection/detail',
    style: {
      navigationBarTitleText: '详情',
      navigationBarBackgroundColor: '#496FE5',
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
    path: 'pages/quality/problemsz/addQuality',
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
    path: 'pages/quality/problemsz/detailQuality',
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
    path: 'pages/quality/problemsz/addProject',
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
    path: 'pages/quality/problemsz/detailProject',
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
    path: 'pages/quality/problemsz/addWork',
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
    path: 'pages/quality/problemsz/detailWork',
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
