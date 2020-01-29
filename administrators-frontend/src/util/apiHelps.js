import 'whatwg-fetch'
import 'es6-promise'

//全局路径
let commonUrl
if (process.env.NODE_ENV === 'development') {
    commonUrl = 'http://localhost:8000/api'
}
//解析json
function parseJSON(response){
  return response.json()
}
//检查请求状态
function checkStatus(response){
  if(response.status >= 200 && response.status < 500){
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export default  function request(options = {}){
  const {data,url} = options
  let token = localStorage.getItem("token") || '';
  options = {...options}
  options.mode = 'cors'//跨域
  delete options.url
  if(data){
    delete options.data
    options.body = JSON.stringify(data)
  }
  options.headers={
    'Content-Type':'application/json',
    token
  }
  return fetch(commonUrl+url,options,{credentials: 'include'})
    .then(checkStatus)
    .then(parseJSON)
    .catch(err=>({err}))
}