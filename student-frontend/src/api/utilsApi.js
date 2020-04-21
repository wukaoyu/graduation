import { request } from '../util/apiHelps'

// 登录
export async function imgUpload(data = {}) {
    return request({
      url:'/utilsApi/imgUpload',
      method:'POST',
      data: data
    })
}