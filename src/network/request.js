import axios from 'axios'

// 不加defalult，这样导出的就是多个
export function request(config) {
  // 1. 创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })

  // 拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {

  })

  // 响应拦截
  instance.interceptors.response.use(res => {

    return res.data
  }, err => {
    console.log(err);
    return err
  })

  // 发送请求
  return instance(config)
}

