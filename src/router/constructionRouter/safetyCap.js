// 质量管理路由
module.exports = [
  {
    path: 'pages/safetyCap/capList',
    style: {
      navigationBarTitleText: '报警列表',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safetyCap/capDetail',
    style: {
      navigationBarTitleText: '报警详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safetyCap/capDetailWebview',
    style: {
      'app-plus': {
        titleNView: false
      }
    }
  },
  {
    path: 'pages/safetyCap/trackList',
    style: {
      navigationBarTitleText: '轨迹列表',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safetyCap/trackDetail',
    style: {
      navigationBarTitleText: '轨迹详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/safetyCap/trackDetailWebview',
    style: {
      'app-plus': {
        titleNView: false
      }
    }
  },
  {
    path: 'pages/safetyCap/capStatistics',
    style: {
      navigationBarTitleText: '安全帽统计',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  }
]
