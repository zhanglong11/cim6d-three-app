// 通用组件路由
module.exports = [
  {
    path: 'pages/select-user/select-user',
    style: {
      navigationBarTitleText: '选择成员',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '完成',
              fontSize: 14,
              color: '#ffffff',
              key: 'save'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/select-department/select-department',
    style: {
      navigationBarTitleText: '选择部门'
    }
  },
  {
    path: 'pages/select-labour/select-labour',
    style: {
      navigationBarTitleText: '选择成员',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '完成',
              fontSize: 14,
              color: '#ffffff',
              key: 'save'
            }
          ]
        }
      }
    }
  }
]
