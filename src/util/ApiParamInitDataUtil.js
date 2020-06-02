/**
 * 提取初始化值
 * @param singleParam {object}
 * @return {*}
 */
export function buildInitialValue(singleParam) {
  console.log('buildInitialValue',singleParam)
  return singleParam.default ? singleParam.default : singleParam.example ? singleParam.example : ''
}

/**
 * 构建对象类型的初始化值
 * @param obj {object}
 * @returns {{}}
 */
export function buildObjectInitVal(obj) {
  let initVal = {};
  if (!obj.children) {
    if (obj.type !== 'object') {
      const tmpInitVal = obj.default ? obj.default : obj.example ? obj.example : ''
      initVal = tmpInitVal;
    }
  } else {
    for (let i = 0; i < obj.children.length; i++) {
      const singleParam = obj.children[i];
      let paramVal;
      const paramName = singleParam.name;
      if (singleParam.type === 'object') {
        paramVal = buildObjectInitVal(singleParam);
      } else if (typeof (singleParam.children) !== 'undefined' && null !== singleParam.children && singleParam.children.length > 0) {
        paramVal = [buildObjectInitVal(singleParam)];
      } else {
        paramVal = singleParam.default === '' ? singleParam.example : singleParam.default;
        if (paramVal === "" && 'undefined' !== typeof (singleParam.type) && null !== singleParam.type && singleParam.type.startsWith("array")) {
          paramVal = [];
        }
      }
      initVal[paramName] = paramVal;
    }
  }
  return initVal;
}

/**
 * 提取初始化值
 * @param bodyName {string} 当数据格式为xml时,该参数有值
 * @param consumesIsJson {boolean} 数据格式是否为json
 * @param paramList {array} 参数信息列表
 * @return {string}
 */
export function buildBodyParamInitValue(bodyName, consumesIsJson, paramList) {
  let reqData = {};

  for (const singleParam of paramList) {
    const paramName = singleParam.name;
    let initialValue;
    if (singleParam.type === 'boolean') {
      initialValue = buildObjectInitVal(singleParam);
    } else if (singleParam.type === 'object') {
      initialValue = buildObjectInitVal(singleParam);
    } else if (typeof (singleParam.children) !== 'undefined' && null !== singleParam.children && singleParam.children.length > 0) {
      initialValue = [buildObjectInitVal(singleParam)];
    } else {
      console.log('singleParam', singleParam)
      initialValue = buildInitialValue(singleParam);
      if (initialValue === "" && 'undefined' !== typeof (singleParam.type) && null !== singleParam.type && singleParam.type.startsWith("array")) {
        initialValue = [];
      }
    }
    reqData[paramName] = initialValue;
  }

  console.log('reqData', reqData)

  let obj = {};
  if (consumesIsJson) {
    obj = reqData;
  } else {
    obj[bodyName] = reqData;
  }
  let codeVal = JSON.stringify(obj, null, 4);
  if (!consumesIsJson) {
    codeVal = convert.json2xml(obj, {compact: true, ignoreComment: true, spaces: 4});
  }
  return codeVal
}
