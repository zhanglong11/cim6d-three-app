// 通讯录路由
module.exports = [
  {
    path: 'pages/contact/contact',
    style: {
      navigationBarTitleText: '通讯录'
    }
  },
  {
    path: 'pages/contact/user/detail',
    style: {
      navigationBarTitleText: '人员详情'
    }
  },
  {
    path: 'pages/contact/department/department',
    style: {
      navigationBarTitleText: '公司'
    }
  },
  {
    path: 'pages/contact/department/user-list',
    style: {
      navigationBarTitleText: '部门人员列表'
    }
  },
  {
    path: 'pages/contact/collection/collection',
    style: {
      navigationBarTitleText: '同事收藏夹',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE613',
              fontSize: 24,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'add',
              width: '40px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/contact/collection/detail',
    style: {
      navigationBarTitleText: '收藏夹详情',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE60A',
              fontSize: 24,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'more',
              width: '40px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/contact/collection/edit',
    style: {
      navigationBarTitleText: '编辑收藏夹',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '保存',
              fontSize: 14,
              color: 'white',
              key: 'save',
              width: '35px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/contact/collection/add',
    style: {
      navigationBarTitleText: '添加收藏夹',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '保存',
              fontSize: 14,
              color: 'white',
              key: 'save',
              width: '35px'
            }
          ]
        }
      }
    }
  }
]
