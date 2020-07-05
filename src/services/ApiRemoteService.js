import ApiUtil from '@/util/AjaxUtil.js';
import qs from "qs";


export default {

  /**
   * 从指定url获取api文档数据
   * @param {string} url
   */
  async loadApiDoc(url) {
    return ApiUtil.get(url, {}, { getResponse: true });
  },

  async normalGet(url, params, headerParams) {
    return ApiUtil.get(url, params, { headers: headerParams, getResponse: true });
  },
  async normalDelete(url, params, headerParams) {
    return ApiUtil.delete(url, params, { headers: headerParams, getResponse: true });
  },
  async normalBodyPost(url, params, headerParams) {
    return ApiUtil.bodyPost(url, params, { headers: headerParams, getResponse: true });
  },
  async specialBodyPost(url, params, formParams,headerParams) {
    if(formParams){
      let newUrl = url + '?' + qs.stringify(formParams, { indices: true, allowDots: true })
      return ApiUtil.bodyPost(newUrl, params, { headers: headerParams, getResponse: true });
    }else{
      return ApiUtil.bodyPost(url, params, { headers: headerParams, getResponse: true });
    }
  },
  /**
   * post方式实现文件下载
   * @param url
   * @param params
   * @param headerParams
   * @returns {Promise<void>}
   */
  async normalBodyDownloadPost(url, params, headerParams) {
    return ApiUtil.bodyPostDownload(url, params, { headers: headerParams, getResponse: true });
  },
  async normalBodyPut(url, params, headerParams) {
    return ApiUtil.bodyPut(url, params, { headers: headerParams, getResponse: true });
  },
  async normalBodyPath(url, params, headerParams) {
    return ApiUtil.bodyPatch(url, params, { headers: headerParams, getResponse: true });
  },
  async normalFormPut(url, params, headerParams) {
    return ApiUtil.formPut(url, params, { headers: headerParams, getResponse: true });
  },
  async normalFormPost(url, params, headerParams) {
    return ApiUtil.formPost(url, params, { headers: headerParams, getResponse: true });
  },
  async specialFormPost(url, params, headerParams) {
    let newUrl = url + '?' + qs.stringify(params, { indices: true, allowDots: true })
    return ApiUtil.formPost(newUrl, null, { headers: headerParams, getResponse: true });
  },
  async normalFormPatch(url, params, headerParams) {
    return ApiUtil.formPatch(url, params, { headers: headerParams, getResponse: true });
  },
  async postUpload(url, formData, headerParams) {
    return ApiUtil.upload(url, formData, { headers: headerParams, getResponse: true });
  }
}
