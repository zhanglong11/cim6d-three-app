// 我的 路由
module.exports = [
  {
    path: 'pages/user/index',
    style: {
      navigationBarTitleText: '我的',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue60a',
              fontSize: 24,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'setting',
              width: '30px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/user/setting',
    style: {
      navigationBarTitleText: '我的设置'
    }
  },
  {
    path: 'pages/user/setting-items/information-setting',
    style: {
      navigationBarTitleText: '编辑个人资料',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '保存',
              fontSize: 14,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'save',
              width: '35px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/user/setting-items/change-password',
    style: {
      navigationBarTitleText: '修改密码'
    }
  },
  {
    path: 'pages/user/setting-items/reset-password',
    style: {
      navigationBarTitleText: '重置密码'
    }
  },
  {
    path: 'pages/user/setting-items/home-setting',
    style: {
      navigationBarTitleText: '首页设置'
    }
  },
  {
    path: 'pages/user/setting-items/remind-setting',
    style: {
      navigationBarTitleText: '提醒设置'
    }
  },
  {
    path: 'pages/user/setting-items/attendance-setting',
    style: {
      navigationBarTitleText: '考勤设置'
    }
  },
  {
    path: 'pages/enterpriseInfo/index',
    style: {
      navigationBarTitleText: '企业信息'
    }
  },
  {
    path: 'pages/adviceFeedback/index',
    style: {
      navigationBarTitleText: '意见反馈'
    }
  },
  {
    path: 'pages/about/index',
    style: {
      navigationBarTitleText: '关于应用',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'pages/about/update-records',
    style: {
      navigationBarTitleText: '更新记录'
    }
  },
  {
    path: 'pages/about/agreement',
    style: {
      navigationBarTitleText: '服务协议'
    }
  }
]
