import request from '@/utils/request'

/**
 * @param Token
 */
export const getUserInfo = (params: { Token: string }) => {
  return request({
    url: 'getUserInfo',
    method: 'GET',
    params,
  })
}
