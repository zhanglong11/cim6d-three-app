// 考勤统计物联
module.exports = [
  {
    path: 'pages/attendanceWl/index',
    style: {
      navigationBarTitleText: '考勤统计'
    }
  },
  {
    path: 'pages/attendanceWl/attentWebView',
    style: {
      navigationBarTitleText: '考勤统计',
      'app-plus': {
        titleNView: false
      }
    }
  },
  {
    path: 'pages/attendanceWl/detail',
    style: {
      navigationBarTitleText: '考勤统计详情',
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  }
]
