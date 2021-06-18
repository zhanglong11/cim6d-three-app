module.exports = {
  globalStyle: {
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#496FE5',
    backgroundColor: '#f9f9f9',
    'app-plus': {
      background: '#f9f9f9'
    }
  },
  "easycom": {
    "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
  },
  condition: {
    //模式配置，仅开发期间生效
    current: 0, //当前激活的模式(list 的索引项)
    list: [
      // {
      // 	"name": "", //模式名称
      // 	"path": "pages/log/detail", //启动页面，必选
      // 	"query": "" //启动参数，在页面的onLoad函数里面得到
      // }
    ]
  },
  tabBar: {
    color: '#909090',
    selectedColor: '#3C7EFF',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/main/main',
        text: '首页',
        iconPath: 'static/img/home.png',
        selectedIconPath: 'static/img/home-hover.png'
      },
      {
        pagePath: 'pages/application/application',
        text: '应用',
        iconPath: 'static/img/application.png',
        selectedIconPath: 'static/img/application-hover.png'
      },
      {
        pagePath: 'pages/contact/contact',
        text: '通讯录',
        iconPath: 'static/img/book.png',
        selectedIconPath: 'static/img/book-hover.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: 'static/img/user.png',
        selectedIconPath: 'static/img/user-hover.png'
      }
    ]
  }
}
