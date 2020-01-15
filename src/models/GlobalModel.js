import {hashHistory} from 'dva/router';
import request from 'umi-request';

import swaggerDocConvert from '@/util/project/DocServerDataConvertHelp'
import menuItemSearch from '@/util/project/MenuItemSearchHelp'
import swaggerDocBasicInfoConvert from '@/util/project/SwaggerDocBasicInfoConvert'
import WinterUtil from "../util/WinterUtil";
import {notification, message} from 'antd';

/**
 * 从远程服务器上获取swagger文档
 * @param swaggerDocUrl swagger文档地址
 * @return {Promise<any>}
 */
async function loadSwaggerDocFromServer({swaggerDocUrl}) {
  return request.get(swaggerDocUrl).catch(function (error) {
    notification['error']({
      message: 'swagger文档获取异常',
      description: error.message,
    });
    throw error
  })
}

export default {
  namespace: 'GlobalModel',

  state: {
    globalHeaderArr: [],
    globalHeaderCount: 0,
    swaggerDocBasicInfo: null,
    apiDetail: null,
    selectedKey: null,
    openedKeys: [],
    kw: '',
    swaggerDoc: null,
    queriedApiInfoMap: {},
    loading: false, // 控制加载状态
    httpTypeMap: {
      1: 'http://',
      2: 'https://'
    },
    httpType: '1'
  },


  effects: {
    /**
     * @param httpType {string} http类型
     * @param swaggerUri {string} swagger文档地址
     * @param apiKey {string|undefined} 详细文档的key
     * @param kw {string|undefined} 查询关键词
     * @param select 用于获取指定dva model的state
     * @param call 用于发起对自定义函数的调用
     * @param put 用于发起对dva reducer 方法的调用
     * @return {IterableIterator<*>}
     */* query({httpType, swaggerUri, apiKey, kw}, {select, call, put}) {
      const closeCall = message.loading('正在获取swagger文档...', 0)
      try {
        const realHttpType = yield select(state => state.GlobalModel.httpTypeMap[httpType])
        const swaggerDocUrl = realHttpType + swaggerUri
        const resp = yield call(loadSwaggerDocFromServer, {swaggerDocUrl})
        setTimeout(() => {
          closeCall()
          message.success('swagger文档获取成功!', 2)
        }, 400)
        yield put({
          type: 'swaggerDocLoadSuc',
          resp, httpType, kw
        })
        if (WinterUtil.strNotBlank(apiKey)) {
          yield put({
            type: 'searchApiDetail',
            apiKey: apiKey
          })
        }
      } catch (e) {
        closeCall()
      }

    },
  },
  reducers: {
    updateGlobalHeaderArr(state, {globalHeaderArr, globalHeaderCount}) {
      return {...state, globalHeaderArr, globalHeaderCount}
    },
    apiSearch(state, {kw}) {
      const {
        queriedApiInfoMap,
        openedKeys
      } = menuItemSearch(state.swaggerDoc, kw)
      return {...state, kw, queriedApiInfoMap, openedKeys}
    },
    searchApiDetail(state, {apiKey}) {
      let apiDetail = null;
      let openedKey = null;
      for (const tagName in state.swaggerDoc) {
        const tagInfo = state.swaggerDoc[tagName]
        for (const apiInfo of tagInfo.apiArr) {
          if (apiInfo.key === apiKey) {
            apiDetail = apiInfo
            openedKey = tagInfo.key
            break;
          }
        }
        if (apiDetail) {
          break;
        }
      }
      const openedKeys = [...state.openedKeys]
      if (openedKey) {
        const idx = openedKeys.findIndex(item => {
          return item === openedKey
        })
        if (idx < 0) {
          openedKeys.push(openedKey)
        }
      }
      return {...state, apiDetail, selectedKey: apiKey, openedKeys}
    },
    swaggerDocLoadSuc(state, {resp, httpType, kw}) {
      const swaggerDoc = swaggerDocConvert(resp)
      const swaggerDocBasicInfo = swaggerDocBasicInfoConvert(resp)
      let newQueriedApiInfoMap;
      let newOpenedKeys
      if (kw) {
        const {
          queriedApiInfoMap,
          openedKeys
        } = menuItemSearch(swaggerDoc, kw)
        newOpenedKeys = openedKeys
        newQueriedApiInfoMap = queriedApiInfoMap
      } else {
        newQueriedApiInfoMap = {...swaggerDoc}
        newOpenedKeys = []
      }
      return {
        ...state,
        swaggerDoc,
        queriedApiInfoMap: newQueriedApiInfoMap,
        swaggerDocBasicInfo,
        httpType,
        openedKeys: newOpenedKeys
      }
    },
    updateKw(state, {kw}) {
      return {...state, kw}
    },
    updateOpenedKeys(state, {openedKeys}) {
      return {...state, openedKeys: [...openedKeys]}
    },
    updateHttpType(state, {httpType}) {
      return {...state, httpType}
    },
    /*
    * 控制加载状态的 reducer
    */
    showLoading(state, action) {
    },

    /**
     * 使用静态数据返回
     */
    querySuccess(state) {
      return {...state, loading: false};
    }
  }
}
