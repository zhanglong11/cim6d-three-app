// 考勤管理路由
module.exports = [
  {
    path: 'pages/attendanceManage/index',
    style: {
      navigationBarTitleText: '考勤打卡',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/attendanceManage/statistics',
    style: {
      navigationBarTitleText: '考勤统计',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/attendanceManage/clock',
    style: {
      navigationBarTitleText: '打卡月历',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  }
]
