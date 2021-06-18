// 材料管理路由
module.exports = [
  {
    path: 'pages/material/receipt/list',
    style: {
      navigationBarTitleText: '入库单',
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
    path: 'pages/material/receipt/detail',
    style: {
      navigationBarTitleText: '入库单详情'
    }
  },
  {
    path: 'pages/material/receipt/add',
    style: {
      navigationBarTitleText: '新建入库单'
    }
  },
  {
    path: 'pages/material/purchaseOrder/list',
    style: {
      navigationBarTitleText: '采购单',
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
    path: 'pages/material/materialUse/detail',
    style: {
      navigationBarTitleText: '材料使用申请详情',
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
    path: 'pages/material/materialUse/add',
    style: {
      navigationBarTitleText: '新建材料使用申请',
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
    path: 'pages/material/stockOut/add',
    style: {
      navigationBarTitleText: '新建出库单'
    }
  },
  {
    path: 'pages/material/inventory/index',
    style: {
      navigationBarTitleText: '材料库存'
    }
  },
  {
    path: 'pages/material/inventory/detail',
    style: {
      navigationBarTitleText: '材料详情',
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
    path: 'pages/material/inventory/record',
    style: {
      navigationBarTitleText: '出入库记录'
    }
  },
  {
    path: 'pages/material/inventory/add',
    style: {
      navigationBarTitleText: '新建材料',
      'app-plus': {
        titleNView: {
          backButton: {
            title: '取消'
          }
        }
      }
    }
  },
  {
    path: 'pages/material/purchaseOrder/detail',
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
    path: 'pages/material/purchaseOrder/add',
    style: {
      navigationBarTitleText: '新建采购单',
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
    path: 'pages/material/materialUse/list',
    style: {
      navigationBarTitleText: '材料使用申请',
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
    path: 'pages/material/stockOut/list',
    style: {
      navigationBarTitleText: '出库单'
    }
  },
  {
    path: 'pages/material/stockOut/detail',
    style: {
      navigationBarTitleText: '出库单详情'
    }
  }
]
