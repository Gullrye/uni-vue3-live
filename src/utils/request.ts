const config = {
  baseUrl: 'http://192.168.2.182:7001/api'
}
type RequestData = string | AnyObject | ArrayBuffer
interface CustomConfig {
  token?: boolean // 是否需要 token 验证
  native?: boolean // 是否返回原始数据
  toast?: boolean // 是否弹出 Toast
  noJump?: boolean // 是否不跳转
  loading?: boolean // 请求时是否显示加载动画
}

class Http {
  baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  request<T>(options: UniApp.RequestOptions, config?: CustomConfig) {
    const uniOptions: UniApp.RequestOptions = {
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: uni.getStorageSync('token') || 'token'
      },
      dataType: 'json',
      timeout: 6000,
      ...options
    }
    uniOptions.url = this.baseUrl + options.url

    return new Promise<T>((resolve, reject) => {
      if (config?.token) {
        let token = uni.getStorageSync('token')
        if (!token && !config.noJump) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({ url: '/pages/login/login' })
          return reject('请先登录')
        }
        uniOptions.header.token = token
      }
      if (config?.loading) {
        uni.showLoading({
          title: '加载中',
          mask: true
        })
      }

      uni.request({
        ...uniOptions,
        success: (result: UniApp.RequestSuccessCallbackResult) => {
          if (config?.loading) {
            uni.hideLoading()
          }
          if (config?.native) return resolve(result as T)
          let outerData = result.data
          // 跳过 !object 类型和 ArrayBuffer 类型
          if (
            typeof outerData !== 'object' ||
            (typeof outerData === 'object' && ArrayBuffer.isView(outerData))
          ) {
            return resolve(outerData as T)
          }
          let innerData = outerData.data
          if (result.statusCode !== 200) {
            if (config?.toast) {
              uni.showToast({
                title: innerData || '服务端失败',
                icon: 'none'
              })
            }
            if (innerData === 'Token 令牌不合法!') {
            }
            return reject(outerData)
          }
          resolve(innerData as T)
        },
        fail: (error) => {
          if (config?.loading) {
            uni.hideLoading()
          }
          uni.showToast({
            title: error.errMsg || '请求失败',
            icon: 'none'
          })
          return reject(error)
        }
      })
    })
  }

  get<T>(url: string, config?: CustomConfig) {
    return this.request<T>({ url, method: 'GET' }, config)
  }
  post<T>(url: string, data: RequestData, config?: CustomConfig) {
    return this.request<T>({ url, data, method: 'POST' }, config)
  }
  delete(url: string, data: RequestData, config?: CustomConfig) {
    return this.request({ url, data, method: 'DELETE' }, config)
  }
  upload(url: string, data: any, onProgress: Function | boolean = false) {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token')
      const uploadTask = uni.uploadFile({
        url: this.baseUrl + url,
        filePath: data.filePath,
        name: data.name || 'files',
        header: { token },
        formData: data.formData || {},
        success: (res) => {
          if (res.statusCode !== 200) {
            resolve(false)
            return uni.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
          let message = JSON.parse(res.data)
          resolve(message.data)
        },
        fail: (err) => {
          reject(err)
        }
      })

      uploadTask.onProgressUpdate((res) => {
        if (typeof onProgress === 'function') {
          onProgress(res.progress)
        }
      })
    })
  }
}

const http = new Http(config.baseUrl)
export default http
