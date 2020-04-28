import { request } from '../util/apiHelps'

// 登录
export async function login(data = {}) {
    return request({
      url:'/users/login',
      method:'POST',
      data: data
    })
}

// 修改个人信息
export async function updataPersonal(data = {}) {
    return request({
      url:'/users/updataPersonal',
      method:'POST',
      data: data
    })
}

// 修改密码
export async function updataPassword(data = {}) {
  return request({
    url:'/users/updataPassword',
    method:'POST',
    data: data
  })
}