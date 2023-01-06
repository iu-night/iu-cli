import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/* 服务器返回数据的的类型，根据接口文档确定 */
interface IRes<T = any> {
  Code: number
  Data: T
  Message: string
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5 * 60 * 1000,
})

/* 请求拦截器 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
}, (error: AxiosError) => {
  // Message.error(error.message)
  return Promise.reject(error)
})

/* 响应拦截器 */
service.interceptors.response.use((response: AxiosResponse<IRes>) => {
  const { Code, Message, Data } = response.data

  // 约定错误码判断请求是否成功
  if (Code === 0) {
    return Data
  }
  else {
    // 处理错误。
    // Message.error(message)
    return Promise.reject(new Error(Message))
  }
}, (error: AxiosError) => {
  // 处理 HTTP 网络错误
  let message = ''
  // HTTP 状态码
  const status = error.response?.status
  switch (status) {
    case 401:
      message = 'token 失效，请重新登录'
      // 这里可以触发退出的 action
      break
    case 403:
      message = '拒绝访问'
      break
    case 404:
      message = '请求地址错误'
      break
    case 500:
      message = '服务器故障'
      break
    default:
      message = '网络连接故障'
  }

  // Message.error(message)
  return Promise.reject(error)
})

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}

/* 导出 axios 实例 */
export default service
