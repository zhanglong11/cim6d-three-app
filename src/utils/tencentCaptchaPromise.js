import settings from '@/settings'
export default function () {
  // #ifdef APP-PLUS
  return new Promise((resolve, reject) => {
    const wv = plus.webview.create(
      '',
      'custom-webview',
      {
        'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
        top: uni.getSystemInfoSync().statusBarHeight + 44, //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
        background: 'transparent'
      },
      {
        appId: settings.tencentCaptchaAppId
      }
    )
    wv.loadURL('http://ly.gim6d.com:9912/download/captcha.html')
    const currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
    currentWebview.append(wv)
    wv.overrideUrlLoading({ mode: 'reject' }, e => {
      let { ticket, randstr } = getRequest(e.url)
      resolve({ ticket, randstr })
    })
  })
  // #endif
  // #ifdef H5
  return new Promise((resolve, reject) => {
    const captcha = new TencentCaptcha(settings.tencentCaptchaAppId, res => {
      if (res.ret === 0) {
        resolve({ ticket: res.ticket, randstr: res.randstr })
      } else {
        reject(new Error('验证失败'))
      }
    })
    captcha.show()
  })
  // #endif
}

function getRequest(url) {
  let theRequest = {}
  let index = url.indexOf('?')
  if (index !== -1) {
    let str = url.substring(index + 1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
    }
  }
  return theRequest
}
