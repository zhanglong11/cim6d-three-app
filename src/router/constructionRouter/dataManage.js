// 资料管理路由
module.exports = [
  {
    path: 'pages/dataManage/projectData/index',
    style: {
      navigationBarTitleText: '项目资料',
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
    path: 'pages/dataManage/projectData/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/dataManage/projectData/file-detail',
    style: {
      navigationBarTitleText: '文件详情'
    }
  },
  {
    path: 'pages/dataManage/projectData/detail',
    style: {
      navigationBarTitleText: '资料详情'
    }
  },
  {
    path: 'pages/dataManage/safeData/index',
    style: {
      navigationBarTitleText: '安全资料',
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
    path: 'pages/dataManage/safeData/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/dataManage/safeData/detail',
    style: {
      navigationBarTitleText: '资料详情'
    }
  },
  {
    path: 'pages/dataManage/qualityData/index',
    style: {
      navigationBarTitleText: '质量验收规范',
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
    path: 'pages/dataManage/qualityData/add',
    style: {
      navigationBarTitleText: '新建'
    }
  },
  {
    path: 'pages/dataManage/qualityData/detail',
    style: {
      navigationBarTitleText: '资料详情'
    }
  },
  {
    path: 'pages/dataManage/educationData/index',
    style: {
      navigationBarTitleText: '安全教育视频',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: []
        }
      }
    }
  },
  {
    path: 'pages/dataManage/educationData/add',
    style: {
      navigationBarTitleText: '新建安全教育视频'
    }
  },
  {
    path: 'pages/dataManage/educationData/detail',
    style: {
      navigationBarTitleText: '安全教育视频详情'
    }
  },
  {
    path: 'pages/dataManage/drawingsFile/index',
    style: {
      navigationBarTitleText: '图纸管理',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE613',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'add'
            },
            {
              text: '\ue624',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'search'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/dataManage/projectFile/index',
    style: {
      navigationBarTitleText: '项目资料',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE613',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'add'
            },
            {
              text: '\ue624',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'search'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/dataManage/projectFile/addFile',
    style: {
      navigationBarTitleText: '新建文件夹',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '创建',
              fontSize: 14,
              color: 'white',
              key: 'search'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/dataManage/projectFile/chooseLocation',
    style: {
      navigationBarTitleText: '选择位置',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '确定',
              fontSize: 14,
              color: 'white',
              key: 'search'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/dataManage/projectFile/uploadFile',
    style: {
      navigationBarTitleText: '上传文件'
    }
  },
  {
    path: 'pages/dataManage/projectFile/file-detail',
    style: {
      navigationBarTitleText: '文件详情'
    }
  },
  {
    path: 'pages/dataManage/projectFile/fileList',
    style: {
      navigationBarTitleText: '文件列表',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\uE613',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'add'
            },
            {
              text: '\ue876',
              fontSize: 18,
              color: 'white',
              fontSrc: '/static/newFonts/iconfont.ttf',
              key: 'sort'
            },
            {
              text: '\uE624',
              fontSize: 26,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'search'
            }
          ]
        }
      }
    }
  }
]
