// 通讯录路由
module.exports = [
  {
    path: 'pages/board/videoMonitor/index',
    style: {
      navigationBarTitleText: '视频监控'
    }
  },
  {
    path: 'pages/board/smartIot/index',
    style: {
      navigationBarTitleText: '智能物联网'
    }
  },
  {
    path: 'pages/board/smartIot/waterElectric',
    style: {
      navigationBarTitleText: '智能水表'
    }
  },
  {
    path: 'pages/board/smartIot/equipmentInfo',
    style: {
      navigationBarTitleText: '设备信息'
    }
  },
  {
    path: 'pages/board/greenConstruction/index',
    style: {
      navigationBarTitleText: '绿色施工'
    }
  },
  {
    path: 'pages/board/greenConstruction/greenConstructionWebView',
    style: {
      navigationBarTitleText: '绿色施工',
      'app-plus': {
        titleNView: false
      }
    }
  }
]
