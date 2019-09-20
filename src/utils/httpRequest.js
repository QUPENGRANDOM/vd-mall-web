import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// create an axios instance
const httpRequest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
httpRequest.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
httpRequest.interceptors.response.use(
  response => {
    const res = response.data
    debugger
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '200') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

let base = ''
let RequestMethod = {'GET': 'get', 'POST': 'post', 'PUT': 'put', 'DELETE': 'delete'}

httpRequest.post = (url, params) => {
  console.log(`${RequestMethod.POST}-${url}:${JSON.stringify(params)}`)
  return axios({
    method: RequestMethod.POST,
    url: url,
    data: params,
    transformRequest: [function (parameters) {
      let data = new FormData()
      if (parameters !== null && parameters instanceof Object) {
        let keys = Object.keys(parameters)
        for (let i = 0; i < keys.length; i++) {
          data.append(keys[i], parameters[keys[i]])
        }
      }
      return data
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

httpRequest.put = (url, params) => {
  return axios({
    method: RequestMethod.PUT,
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

httpRequest.delete = (url) => {
  return axios({
    method: RequestMethod.DELETE,
    url: `${base}${url}`
  })
}

httpRequest.get = (url) => {
  return axios({
    method: RequestMethod.GET,
    url: url
  })
}

export default httpRequest
