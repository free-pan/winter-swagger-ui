/* eslint-disable dot-notation */

import Util from '../WinterUtil'

class ApiDetailExtract {
  globalKey = 0

  resetGlobalKey() {
    this.globalKey = 0
  }

  /**
   * 抽取请求参数
   * @param {array<object>} parameters 请求参数定义
   * @param {object} definitions  具体某个自定义请求参数的数据结构
   */
  extractParam(parameters, definitions) {
    const headerParams = []
    const bodyParams = []
    const pathParams = []
    const formParams = []
    const fileParams = []
    const result = {
      headerParams: headerParams,
      bodyParams: bodyParams,
      pathParams: pathParams,
      formParams: formParams,
      fileParams: fileParams,
      bodyName: ''
    }

    if (typeof (parameters) !== 'undefined') {
      for (const singleParam of parameters) {
        if (singleParam.in === 'header') {
          headerParams.push(this.extractSingleSimpleParam(singleParam))
        } else if (singleParam.in === 'query') {
          if (typeof (singleParam.type) !== 'undefined' && singleParam.type === 'file') {
            fileParams.push(this.extractSingleSimpleParam(singleParam))
          } else if (typeof (singleParam.items) !== 'undefined' && typeof (singleParam.items.type) !== 'undefined' && singleParam.items.type === 'file') {
            const item = {
              key: ++this.globalKey,
              default: this.extractDefaultVal(singleParam),
              example: this.extractExampleVal(singleParam),
              required: singleParam.required,
              description: singleParam.description,
              summary: '',
              name: singleParam.name,
              type: singleParam.type + '(' + singleParam.items.type + ')'
            }
            fileParams.push(item)
          } else {
            formParams.push(this.extractSingleSimpleParam(singleParam))
          }
        } else if (singleParam.in === 'path') {
          pathParams.push(this.extractSingleSimpleParam(singleParam))
        }
        if (singleParam.in === 'body') {
          result['bodyName'] = singleParam.name
          if (typeof (singleParam['schema']['$ref']) !== 'undefined') {
            const realParamTypeName = this.extractRealParamTypeName(singleParam['schema']['$ref'])
            const realRaramTypeDefine = definitions[realParamTypeName]
            if (typeof (realRaramTypeDefine) !== 'undefined') {
              const paramArr = this.extractSingleComplexParam(realRaramTypeDefine, definitions, 0, realRaramTypeDefine)
              for (const p of paramArr) {
                bodyParams.push(p)
              }
            }
          }
        } else if (singleParam.in === 'formData') {
          if (singleParam.type === 'file') {
            fileParams.push(this.extractSingleSimpleParam(singleParam))
          } else if (typeof (singleParam.items) !== 'undefined' && typeof (singleParam.items.type) !== 'undefined' && singleParam.items.type === 'file') {
            const item = {
              key: ++this.globalKey,
              default: this.extractDefaultVal(singleParam),
              example: this.extractExampleVal(singleParam),
              required: singleParam.required,
              description: singleParam.description,
              summary: '',
              name: singleParam.name,
              type: singleParam.type + '(' + singleParam.items.type + ')'
            }
            fileParams.push(item)
          } else if (singleParam.type !== 'file') {
            if (typeof (singleParam.items) !== 'undefined' && typeof (singleParam.items.type) !== 'undefined') {
              const item = {
                key: ++this.globalKey,
                default: this.extractDefaultVal(singleParam),
                example: this.extractExampleVal(singleParam),
                required: singleParam.required,
                description: singleParam.description,
                summary: '',
                name: singleParam.name,
                type: singleParam.type + '(' + singleParam.items.type + ')'
              }
              formParams.push(item)
            } else {
              const itme = {
                key: ++this.globalKey,
                default: this.extractDefaultVal(singleParam),
                example: this.extractExampleVal(singleParam),
                required: singleParam.required,
                description: singleParam.description,
                summary: '',
                name: singleParam.name,
                type: singleParam.type
              }
              formParams.push(itme)
            }
          }
        }
      }
    }

    return result
  }

  extractRealParamTypeName(originalTypeName) {
    return originalTypeName.substring(originalTypeName.lastIndexOf('/') + 1)
  }

  /**
   * 抽取示例值
   * @param singleParamDefine
   */
  extractExampleVal(singleParamDefine) {
    let exampleVal = ''
    if (singleParamDefine.example) {
      exampleVal = singleParamDefine.example
    }
    if (!exampleVal && singleParamDefine['x-example']) {
      exampleVal = singleParamDefine['x-example']
    }
    return exampleVal
  }

  /**
   * 抽取默认值
   * @param singleParamDefine
   */
  extractDefaultVal(singleParamDefine){
    let defaultVal = ''
    if (typeof (singleParamDefine.default) !== 'undefined') {
      defaultVal = singleParamDefine.default
    }
    return defaultVal
  }

  /**
   * 抽取简单的请求参数
   * @param {string} key
   * @param {object} singleParamDefine
   */
  extractSingleSimpleParam(singleParamDefine) {
    let paramDefine
    let defaultVal = this.extractDefaultVal(singleParamDefine)
    let exampleVal = this.extractExampleVal(singleParamDefine)
    let required = false
    if (typeof (singleParamDefine.required) !== 'undefined') {
      required = singleParamDefine.required
    } else if (typeof (singleParamDefine.allowEmptyValue) !== 'undefined') {
      required = singleParamDefine.allowEmptyValue
    }
    if (typeof (singleParamDefine.format) === 'undefined' || singleParamDefine.format === null) {
      paramDefine = {
        key: ++this.globalKey,
        default: defaultVal,
        example: exampleVal,
        required: required,
        description: singleParamDefine.description,
        summary: singleParamDefine.summary,
        name: singleParamDefine.name,
        type: singleParamDefine.type
      }
    } else {
      paramDefine = {
        key: ++this.globalKey,
        default: defaultVal,
        example: exampleVal,
        description: singleParamDefine.description,
        summary: singleParamDefine.summary,
        required: required,
        name: singleParamDefine.name,
        type: singleParamDefine.type + '(' + singleParamDefine.format + ')'
      }
    }
    return paramDefine
  }

  /**
   * 抽取复杂的请求参数
   * @param complexTypeDefine
   * @param definitions
   * @param callSize
   * @param parentTypeName 父类型名
   * @returns {Array}
   */
  extractSingleComplexParam(complexTypeDefine, definitions, callSize, parentTypeName) {
    const resultArr = []
    // 避免陷入无限递归(设置最大递归层数)
    if (callSize > 6) {
      return resultArr
    }
    if (typeof (complexTypeDefine.properties) !== 'undefined' && complexTypeDefine.properties !== null) {
      for (const paramName in complexTypeDefine.properties) {
        if (typeof (complexTypeDefine.properties[paramName].type) === 'undefined' && typeof (complexTypeDefine.properties[paramName]['$ref']) !== 'undefined') {
          const required = complexTypeDefine.properties[paramName].allowEmptyValue
          const realTypeName = this.extractRealParamTypeName(complexTypeDefine.properties[paramName]['$ref'])
          if (typeof (definitions[realTypeName]) !== 'undefined') {
            if (realTypeName === parentTypeName) {
              // 子属性的类型名与父父类型名一致,则认为当前是父子结构,无需再进行递归分解
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: null
              }
              resultArr.push(treeNode)
            } else {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize, realTypeName)
              }
              resultArr.push(treeNode)
            }
          } else {
            const description = complexTypeDefine.properties[paramName].description
            const type = complexTypeDefine.properties[paramName].type
            const treeNode = this.buildLeafTreeNode(paramName, description, type, required)
            resultArr.push(treeNode)
          }
        } else if (complexTypeDefine.properties[paramName].type === 'object') {
          const required = Util.arrayContainsVal(complexTypeDefine.required, paramName)
          let realTypeName = this.extractRealParamTypeName(paramName)
          if (typeof (definitions[realTypeName]) !== 'undefined') {
            console.log('realTypeName', realTypeName, 'parentTypeName', parentTypeName)
            if (realTypeName === parentTypeName) {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: null
              }
              resultArr.push(treeNode)
            } else {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize, realTypeName)
              }
              resultArr.push(treeNode)
            }
          } else if (typeof (complexTypeDefine.properties[paramName].additionalProperties) !== 'undefined' && typeof (complexTypeDefine.properties[paramName].additionalProperties['$ref']) !== 'undefined') {
            const additionalProperties = complexTypeDefine.properties[paramName].additionalProperties
            realTypeName = this.extractRealParamTypeName(additionalProperties['$ref'])
            if (realTypeName === parentTypeName) {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object<*,Object>',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: null
              }
              resultArr.push(treeNode)
            } else {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'object<*,Object>',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize, realTypeName)
              }
              resultArr.push(treeNode)
            }
          } else {
            const description = complexTypeDefine.properties[paramName].description
            const type = complexTypeDefine.properties[paramName].type
            const treeNode = this.buildLeafTreeNode(paramName, description, type, required)
            resultArr.push(treeNode)
          }
        } else if (complexTypeDefine.properties[paramName].type === 'array' && typeof (complexTypeDefine.properties[paramName].items) !== 'undefined' && typeof (complexTypeDefine.properties[paramName].items['$ref']) !== 'undefined') {
          const required = complexTypeDefine.properties[paramName].allowEmptyValue
          const realTypeName = this.extractRealParamTypeName(complexTypeDefine.properties[paramName].items['$ref'])
          if (typeof (definitions[realTypeName]) !== 'undefined') {
            if (realTypeName === parentTypeName) {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'array<object>',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: null
              }
              resultArr.push(treeNode)
            } else {
              const treeNode = {
                key: ++this.globalKey,
                name: paramName,
                type: 'array<object>',
                description: complexTypeDefine.properties[paramName].description,
                required: required,
                children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize, realTypeName)
              }
              resultArr.push(treeNode)
            }
          } else {
            const description = complexTypeDefine.properties[paramName].description
            const type = 'array<object>'
            // 构建叶子节点
            const treeNode = this.buildLeafTreeNode(paramName, description, type, required)
            resultArr.push(treeNode)
          }
        } else {
          const originalDataTypeDefine = complexTypeDefine.properties[paramName]
          const dataTypeDefine = { ...originalDataTypeDefine }
          dataTypeDefine['name'] = paramName
          const required = Util.arrayContainsVal(complexTypeDefine.required, paramName)
          dataTypeDefine['required'] = required
          resultArr.push(this.extractSingleSimpleParam(dataTypeDefine))
        }
      }
    }
    return resultArr
  }

  /**
   * 构建叶子节点
   * @param {string} paramName 参数名
   * @param {string} description 描述
   * @param {string} type 参数类型
   * @param {boolean} required 是否必填
   */
  buildLeafTreeNode(paramName, description, type, required) {
    return {
      key: ++this.globalKey,
      name: paramName,
      description: description,
      type: type,
      required: required
    }
  }

  extractReponse(responses, definitions) {
    const responseArr = []

    for (const respCode in responses) {
      if (typeof (responses[respCode].schema) !== 'undefined') {
        let realTypeName = null
        let respHeaders = null
        if (responses[respCode]['headers']) {
          respHeaders = []
          for (const singleHeader in responses[respCode]['headers']) {
            console.log(singleHeader)
            const tmp = this.extractSingleSimpleParam(responses[respCode]['headers'][singleHeader])
            if (tmp) {
              if (!tmp['name']) {
                tmp['name'] = singleHeader
              }
              respHeaders.push(tmp)
            }
          }
        }
        if (typeof (responses[respCode].schema.$ref) === 'undefined') {
          realTypeName = responses[respCode].schema.type
          responseArr.push({
            key: ++this.globalKey,
            code: respCode,
            description: responses[respCode].description,
            responseStructArr: [],
            headerArr: respHeaders
          })
        } else {
          realTypeName = this.extractRealParamTypeName(responses[respCode].schema.$ref)
          responseArr.push({
            key: ++this.globalKey,
            code: respCode,
            description: responses[respCode].description,
            responseStructArr: this.extractSingleComplexParam(definitions[realTypeName], definitions, 0, realTypeName),
            headerArr: respHeaders
          })
        }
      } else {
        responseArr.push({
          key: ++this.globalKey,
          code: respCode,
          description: responses[respCode].description
        })
      }
    }

    return responseArr
  }
}

export default (docRespData) => {
  const { paths, tags, definitions } = docRespData

  /**
   * 数据结构
   * {
   *  "tagName":{description,apiArr}
   * }
   */
  const apiInfoMap = {}
  if (tags) {
    let key = 0
    for (const tagInfo of tags) {
      let singleTag = apiInfoMap[tagInfo.name]
      if (typeof (singleTag) === 'undefined' || singleTag === null) {
        singleTag = {
          key: (++key) + '',
          description: tagInfo.description,
          apiArr: []
        }
        apiInfoMap[tagInfo.name] = singleTag
      }
    }

    if (paths) {
      const extract = new ApiDetailExtract()
      for (const path in paths) {
        // 每次都重置这个key为0,让key值不至于过大
        extract.resetGlobalKey()
        for (const method in paths[path]) {
          if (method === 'options' || method === 'OPTIONS' || method === 'HEAD' || method === 'head') {
            continue
          }
          const reqParams = extract.extractParam(paths[path][method].parameters, definitions)

          const responseArr = extract.extractReponse(paths[path][method].responses, definitions)

          let deprecated = false
          if (paths[path][method]['deprecated']) {
            deprecated = true
          }
          const treeNode = {
            operationId: paths[path][method].operationId,
            key: paths[path][method].operationId,
            name: paths[path][method].summary,
            path: path,
            produces: paths[path][method].produces,
            consumes: paths[path][method].consumes,
            description: paths[path][method].description,
            method: method,
            deprecated: deprecated,
            bodyName: reqParams.bodyName,
            headerParams: reqParams.headerParams,
            pathParams: reqParams.pathParams,
            formParams: reqParams.formParams,
            bodyParams: reqParams.bodyParams,
            fileParams: reqParams.fileParams,
            responseArr: responseArr
          }

          if (typeof (paths[path][method].tags) !== 'undefined' && paths[path][method].tags !== null && paths[path][method].tags.length > 0) {
            for (const tagName of paths[path][method].tags) {
              // ++x;
              const singleTag = apiInfoMap[tagName]
              if (typeof (singleTag) !== 'undefined' && singleTag !== null) {
                singleTag.apiArr.push({
                  ...treeNode,
                  tagDesc: singleTag.description
                })
              }
            }
          }
        }
      }
    }

    // const end = new Date();
    // console.log('循环次数:',x,'循环用时:',(end-start));

    return apiInfoMap
  }
}
