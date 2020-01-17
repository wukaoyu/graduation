import request from '../util/apiHelps'

// 获取新闻分页信息
export async function login(data = {}) {
    return request({
      url:'/users/login',
      method:'POST',
      data: data
    })
}