import request, {extend} from 'umi-request';

/**
 * 默认超时时间10秒
 * @type {number}
 */
const defaultTimeout = 10;

const errorHandler = function (error) {
  const codeMap = {
    '021': '发生错误啦',
    '022': '发生大大大大错误啦',
  };
  if (error.response) {
    // 请求已发送但服务端返回状态码非 2xx 的响应
    console.log(error.response.status);
    console.log(error.response.headers);
    console.log(error.data);
    console.log(error.request);
    console.log(codeMap[error.data.status])
    return {response: error.data}
  } else {
    // 请求初始化时出错或者没有响应返回的异常
    console.log(error.message);
  }

  // throw error;   // 如果throw. 错误将继续抛出.

  // 如果return, 则将值作为返回. 'return;' 相当于return undefined, 在处理结果时判断response是否有值即可.
  return;
}

const extendRequest = extend({timeout: defaultTimeout * 1000, errorHandler, getResponse: true, credentials: 'include'})
export default {
  /**
   * 普通的form表单提交方式
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @returns {Promise<any>}
   */
  formPost(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.post(url, {data, headers, timeout: timeout * 1000, useCache, requestType: 'form', getResponse})
  },

  /**
   * post请求使用request body传参
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   */
  bodyPost(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.post(url, {data, headers, timeout: timeout * 1000, useCache, requestType: 'json', getResponse})
  },

  /**
   * post实现文件下载
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:true
   * @return 结果中默认含响应头, 获取响应头方式: request('/api/v1/some/api', { getResponse: true })..then(({ data, response}) => { response.headers.get('Content-Type'); })
   */
  bodyPostDownload(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = true} = {}) {
    return extendRequest.post(url, {
      data,
      getResponse,
      useCache,
      responseType: 'blob', // 表明返回服务器返回的数据类型
      timeout: timeout * 1000,
      headers
    })
  },

  /**
   * 普通的form表单提交方式patch方式
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @returns {Promise<any>}
   */
  formPatch(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.patch(url, {
      data,
      headers,
      timeout: timeout * 1000,
      useCache,
      requestType: 'form',
      getResponse
    })
  },

  /**
   * patch请求使用request body传参
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   */
  bodyPatch(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.patch(url, {
      data,
      headers,
      timeout: timeout * 1000,
      useCache,
      requestType: 'json',
      getResponse
    })
  },

  /**
   * 发送Put请求
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @return 结果中默认不包含响应头,如果需要包含响应头,请设置 getResponse 为 true
   */
  bodyPut(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.put(url, {
      data,
      getResponse,
      useCache,
      timeout: timeout * 1000,
      headers
    })
  },
  /**
   * 发送Put请求
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @return 结果中默认不包含响应头,如果需要包含响应头,请设置 getResponse 为 true
   */
  formPut(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.put(url, {
      requestType: 'form',
      data,
      useCache,
      timeout: timeout * 1000,
      headers
    })
  },
  /**
   * 发送delete请求
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @return 结果中默认不包含响应头,如果需要包含响应头,请设置 getResponse 为 true
   */
  delete(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.delete(url, {
      useCache,
      getResponse,
      data,
      timeout: timeout * 1000,
      headers
    })
  },
  /**
   * 发送get请求
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @return 结果中默认不包含响应头,如果需要包含响应头,请设置 getResponse 为 true
   */
  get(url, data = {}, {useCache = false, timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest.get(url, {
      useCache,
      getResponse,
      params: data,
      timeout: timeout * 1000,
      headers
    })
  },
  /**
   * 文件上传
   * @param url {string} 请求url地址
   * @param data {Object} 提交的数据
   * @param useCache {boolean} 是否使用缓存[默认只对get启用缓存]
   * @param timeout {number} 超时时间. 单位:秒
   * @param headers 其它额外的请求头
   * @param getResponse {boolean} 是否包含响应头信息. 默认:false
   * @return 结果中默认不包含响应头,如果需要包含响应头,请设置 getResponse 为 true
   */
  upload(url, formData, {timeout = defaultTimeout, headers = {}, getResponse = false} = {}) {
    return extendRequest(url, {
      method: 'post',
      getResponse,
      data: formData,
      timeout: timeout * 1000,
      headers
    })
  }
}
