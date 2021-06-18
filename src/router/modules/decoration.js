module.exports = {
  children: [
    {
      path: 'pages/decoration/decorationData/projectData/index',
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
      path: 'pages/decoration/decorationData/projectData/add',
      style: {
        navigationBarTitleText: '新建'
      }
    },
    {
      path: 'pages/decoration/decorationData/projectData/file-detail',
      style: {
        navigationBarTitleText: '文件详情'
      }
    },
    {
      path: 'pages/decoration/decorationData/projectData/detail',
      style: {
        navigationBarTitleText: '资料详情'
      }
    },
    {
      path: 'pages/decoration/decorationData/qualityData/index',
      style: {
        navigationBarTitleText: '质量资料',
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
      path: 'pages/decoration/decorationData/qualityData/add',
      style: {
        navigationBarTitleText: '新建'
      }
    },
    {
      path: 'pages/decoration/decorationData/qualityData/detail',
      style: {
        navigationBarTitleText: '资料详情'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorLog/index',
      style: {
        navigationBarTitleText: '监理日志',
        enablePullDownRefresh: true
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorLog/add',
      style: {
        navigationBarTitleText: '新建监理日志'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorLog/detail',
      style: {
        navigationBarTitleText: '监理日志详情'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorWeekly/index',
      style: {
        navigationBarTitleText: '监理周报',
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
      path: 'pages/decoration/decorationSupervisor/supervisorWeekly/add',
      style: {
        navigationBarTitleText: '新建监理周报'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorWeekly/detail',
      style: {
        navigationBarTitleText: '监理周报详情'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorMonthly/index',
      style: {
        navigationBarTitleText: '监理月报',
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
      path: 'pages/decoration/decorationSupervisor/supervisorMonthly/add',
      style: {
        navigationBarTitleText: '新建监理月报'
      }
    },
    {
      path: 'pages/decoration/decorationSupervisor/supervisorMonthly/detail',
      style: {
        navigationBarTitleText: '监理月报详情'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/index',
      style: {
        navigationBarTitleText: '进度管理',
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
      path: 'pages/decoration/decorationSchedule/scheduleManage/manageProcess',
      style: {
        navigationBarTitleText: '管理工序',
        enablePullDownRefresh: true
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/finishProcess',
      style: {
        navigationBarTitleText: '完成工序'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/updateFinishProcess',
      style: {
        navigationBarTitleText: '修改完成工序'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/finishProcessDetail',
      style: {
        navigationBarTitleText: '查看完成详情'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/detailNoBegin',
      style: {
        navigationBarTitleText: '查看详情(未开始)'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/detailFinish',
      style: {
        navigationBarTitleText: '查看详情(已完工)'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/scheduleManage/materialArtificial',
      style: {
        navigationBarTitleText: '材料及人工清单'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/schedulePanel/index',
      style: {
        navigationBarTitleText: '进度看板'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/schedulePanel/monthlyProgress',
      style: {
        navigationBarTitleText: '月度进度'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/schedulePanel/unitProgress',
      style: {
        navigationBarTitleText: '单元进度'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/schedulePanel/unitProgressDetail',
      style: {
        navigationBarTitleText: '单元进度详情'
      }
    },
    {
      path: 'pages/decoration/decorationSchedule/processAccept/index',
      style: {
        navigationBarTitleText: '工序验收',
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
      path: 'pages/decoration/decorationSchedule/processAccept/acceptDetail',
      style: {
        navigationBarTitleText: '查看验收结果'
      }
    },
    {
      path: 'pages/decoration/decorationQuality/index',
      style: {
        navigationBarTitleText: '质量检测',
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
      path: 'pages/decoration/decorationQuality/add',
      style: {
        navigationBarTitleText: '添加'
      }
    },
    {
      path: 'pages/decoration/decorationQuality/detail',
      style: {
        navigationBarTitleText: '详情'
      }
    },
    {
      path: 'pages/decoration/decorationLog/construction/index',
      style: {
        navigationBarTitleText: '施工日志',
        enablePullDownRefresh: true,
        'app-plus': {
          titleNView: {
            buttons: []
          }
        }
      }
    },
    {
      path: 'pages/decoration/decorationLog/construction/add',
      style: {
        navigationBarTitleText: '添加'
      }
    },
    {
      path: 'pages/decoration/decorationLog/construction/detail',
      style: {
        navigationBarTitleText: '详情'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/store/index',
      style: {
        navigationBarTitleText: '库存管理',
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
      path: 'pages/decoration/decorationMaterial/store/detail',
      style: {
        navigationBarTitleText: '详情'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/purchase/index',
      style: {
        navigationBarTitleText: '采购管理',
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
      path: 'pages/decoration/decorationMaterial/purchase/add',
      style: {
        navigationBarTitleText: '添加'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/purchase/detail',
      style: {
        navigationBarTitleText: '详情'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/purchase/confirm',
      style: {
        navigationBarTitleText: '到货确认'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/purchase/confirm-detail',
      style: {
        navigationBarTitleText: '到货确认详情'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/pick/index',
      style: {
        navigationBarTitleText: '领料管理',
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
      path: 'pages/decoration/decorationMaterial/pick/add',
      style: {
        navigationBarTitleText: '添加'
      }
    },
    {
      path: 'pages/decoration/decorationMaterial/pick/detail',
      style: {
        navigationBarTitleText: '详情'
      }
    }
  ]
}
