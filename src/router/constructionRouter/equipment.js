// 设备管理路由
module.exports = [
  {
    path: 'pages/equipment/list/index',
    style: {
      navigationBarTitleText: '设备台账',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/list/add',
    style: {
      navigationBarTitleText: '新建设备'
    }
  },
  {
    path: 'pages/equipment/maintenance/index',
    style: {
      navigationBarTitleText: '设备保养',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/maintenance/detailWaitMaintain',
    style: {
      navigationBarTitleText: '保养详情'
    }
  },
  {
    path: 'pages/equipment/maintenance/detailMaintain',
    style: {
      navigationBarTitleText: '保养详情'
    }
  },
  {
    path: 'pages/equipment/enterAndExit/enter',
    style: {
      navigationBarTitleText: '新建设备进场'
    }
  },
  {
    path: 'pages/equipment/Troubleshooting/index',
    style: {
      navigationBarTitleText: '设备故障及维修',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/Troubleshooting/detail',
    style: {
      navigationBarTitleText: '设备故障详情',
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
    path: 'pages/equipment/Troubleshooting/addShooting',
    style: {
      navigationBarTitleText: '设备故障维修'
    }
  },
  {
    path: 'pages/equipment/Troubleshooting/shootingDetail',
    style: {
      navigationBarTitleText: '设备故障维修验收'
    }
  },
  {
    path: 'pages/equipment/lease/list',
    style: {
      navigationBarTitleText: '设备租赁',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/lease/detail',
    style: {
      navigationBarTitleText: '租赁单详情',
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
    path: 'pages/equipment/lease/add',
    style: {
      navigationBarTitleText: '新建租赁单',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '存为草稿',
              fontSize: 14,
              color: 'white',
              key: 'draft',
              width: '70px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/equipment/purchase/list',
    style: {
      navigationBarTitleText: '设备采购',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/purchase/add',
    style: {
      navigationBarTitleText: '新建采购单',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '存为草稿',
              fontSize: 14,
              color: 'white',
              key: 'draft',
              width: '70px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/equipment/purchase/detail',
    style: {
      navigationBarTitleText: '采购单详情',
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
    path: 'pages/equipment/list/detail',
    style: {
      navigationBarTitleText: '设备详情'
    }
  },
  {
    path: 'pages/equipment/maintenance/select-plan',
    style: {
      navigationBarTitleText: '设备保养计划',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '确定',
              fontSize: 14,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'ok'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/equipment/maintenance/add',
    style: {
      navigationBarTitleText: '新建设备保养'
    }
  },
  {
    path: 'pages/equipment/maintenance/detailWaitCheck',
    style: {
      navigationBarTitleText: '保养详情'
    }
  },
  {
    path: 'pages/equipment/maintenance/detail',
    style: {
      navigationBarTitleText: '保养详情'
    }
  },
  {
    path: 'pages/equipment/enterAndExit/index',
    style: {
      navigationBarTitleText: '设备进退场',
      enablePullDownRefresh: true,
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '\ue607',
              fontSize: 27,
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
    path: 'pages/equipment/enterAndExit/enterDetail',
    style: {
      navigationBarTitleText: '设备详情',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '设备退场',
              fontSize: 14,
              color: 'white',
              key: 'exit',
              width: '70px'
            }
          ]
        }
      }
    }
  },
  {
    path: 'pages/equipment/enterAndExit/exit',
    style: {
      navigationBarTitleText: '设备退场'
    }
  },
  {
    path: 'pages/equipment/enterAndExit/exitDetail',
    style: {
      navigationBarTitleText: '设备详情'
    }
  },
  {
    path: 'pages/equipment/Troubleshooting/add',
    style: {
      navigationBarTitleText: '新建设备故障',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '存为草稿',
              fontSize: 14,
              color: 'white',
              key: 'draft',
              width: '70px'
            }
          ]
        }
      }
    }
  }
]
