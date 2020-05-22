import { request } from '../util/apiHelps'

// 上传图片到oss
export async function imgUpload(data = {}) {
    return request({
      url:'/utilsApi/imgUpload',
      method:'POST',
      data: data
    })
}

// 上传图片到本地
export async function uploadLocalPicture(data = {}) {
  return request({
    url:'/utilsApi/uploadLocalPicture',
    method:'POST',
    data: data
  })
}