import WinterUtil from '@/util/WinterUtil'

function buildQueryApiInfo(apiInfo) {
  return {
    deprecated: apiInfo.deprecated,
    key: apiInfo.operationId,
    name: apiInfo.name,
    path: apiInfo.path,
    method: apiInfo.method
  };
}

/**
 *
 * @param apiInfoMap 解析后的swagger文档
 * @param key 查询关键词
 * @return {{queriedApiInfoMap, openedKeys: Array}} 匹配的api信息,展开的节点id
 */
export default (apiInfoMap, key) => {
  if (WinterUtil.strIsBlank(key)) {
    return {
      queriedApiInfoMap: { ...apiInfoMap },
      openedKeys: []
    }
  }
  const queriedApiInfoMap = {}
  const openedKeys = []

  key = key.trim().toUpperCase();

  for (const tagName in apiInfoMap) {
    let matched = false
    if (tagName.toUpperCase().indexOf(key) !== -1) {
      matched = true
    }
    const apiArr = []
    for (const apiInfo of apiInfoMap[tagName].apiArr) {
      if (matched) {
        // 如果tag名匹配,则认为该tag下的所有api都是匹配的
        apiArr.push(buildQueryApiInfo(apiInfo))
      } else if (apiInfo.name.toUpperCase().indexOf(key) !== -1) {
        matched = true
        apiArr.push(buildQueryApiInfo(apiInfo))
      } else if (apiInfo.path.toUpperCase().indexOf(key) !== -1) {
        matched = true
        apiArr.push(buildQueryApiInfo(apiInfo))
      }
    }
    if (matched) {
      queriedApiInfoMap[tagName] = {
        key: apiInfoMap[tagName].key,
        description: apiInfoMap[tagName].description,
        apiArr: apiArr
      }
      openedKeys.push(apiInfoMap[tagName].key)
    }
  }
  return {
    queriedApiInfoMap,
    openedKeys
  }
}
