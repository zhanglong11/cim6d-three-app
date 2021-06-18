module.exports = {
  children: [
    {
      path: 'pages/main/main',
      style: {
        navigationBarTitleText: '首页',
        enablePullDownRefresh: true
      }
    },
    {
      path: 'pages/main/photoBallWrap',
      style: {
        navigationBarTitleText: '全景图'
      }
    },
    {
      path: 'pages/main/photoBall',
      style: {
        navigationBarTitleText: '全景图',
        'app-plus': {
          titleNView: false
        }
      }
    },
    {
      path: 'pages/application/application',
      style: {
        navigationBarTitleText: '应用'
      }
    },
    {
      path: 'pages/guide/index',
      style: {
        navigationBarTitleText: '引导页',
        titleNView: false
      }
    },
    {
      path: 'pages/login/login',
      style: {
        navigationBarTitleText: '登录',
        titleNView: false
      }
    },
    {
      path: 'pages/select-project/select-project',
      style: {
        navigationBarTitleText: '选择项目',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
        enablePullDownRefresh: true,
        'app-plus': {
          titleNView: {
            buttons: [
              {
                text: '确定',
                fontSize: 14,
                color: '#007AFF'
              }
            ]
          }
        }
      }
    },
    {
      path: 'pages/written/policy',
      style: {
        navigationBarTitleText: '保护政策'
      }
    }
  ]
}
