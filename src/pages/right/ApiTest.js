import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import ApiTestForm from './ApiTestForm'

const methodColorMap = {
  "POST": 'post-method-color',
  "GET": 'get-method-color',
  "PUT": 'put-method-color',
  "DELETE": 'delete-method-color',
  "OPTIONS": 'options-method-color',
  "PATCH": 'patch-method-color',
  "HEAD": 'head-method-color'
}

class ApiTest extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return nextProps.show && nextProps.apiDetail !== this.props.apiDetail
    return nextProps.show
  }

  /**
   * 构建完整的api请求地址
   * @param httpType http类型
   * @param basePath 主机地址
   * @param apiPath api路径
   * @returns {*}
   */
  buildFullApiUrl = (httpType, basePath, apiPath, values) => {
    let testApiUrl = this.props.httpTypeMap[httpType] + basePath
    let tmpWebApiPath = apiPath
    if (values) {
      tmpWebApiPath = WinterUtil.formReplacePathVar(apiPath, values['__path']);
    }
    const regEnd = new RegExp("/$");
    const regStart = new RegExp("^/");
    if (regEnd.test(basePath) && regStart.test(tmpWebApiPath)) {
      testApiUrl += tmpWebApiPath.substr(1);
    } else {
      testApiUrl += tmpWebApiPath;
    }
    return testApiUrl
  }

  render() {
    console.log('ApiTest')
    const { apiDetail, httpTypeMap, httpType, swaggerDocBasicInfo } = this.props
    if (apiDetail) {
      const basePath = swaggerDocBasicInfo.host + swaggerDocBasicInfo.basePath;
      const testApiFullUrl = this.buildFullApiUrl(httpType, basePath, apiDetail.path)
      const propsApiTestForm = { testApiFullUrl, apiDetail, swaggerDocBasicInfo }
      return (
        <div>
          <h3>
            <strong
              className={ methodColorMap[apiDetail.method.toUpperCase()] }
              style={ { marginRight: '10px' } }>{ apiDetail.method ? apiDetail.method.toUpperCase() : '' }</strong>
            <span
              style={ { wordWrap: "break-word" } }>{ testApiFullUrl }</span>
          </h3>
          <ApiTestForm { ...propsApiTestForm }/>
        </div>
      )
    } else {
      return <React.Fragment></React.Fragment>
    }
  }
}

ApiTest.propTypes = {
  apiDetail: PropTypes.object,
  swaggerDocBasicInfo: PropTypes.object,
  httpTypeMap: PropTypes.object,
  httpType: PropTypes.string
};

export default ApiTest;
