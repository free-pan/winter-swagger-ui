import React from 'react';
import PropTypes from 'prop-types';
import ResponseParamsTable from '@/components/ResponseParamsTable'
import styles from './index.less'

/**
 * api响应信息
 * @param props
 * @return {*}
 * @constructor
 */
const ApiResponse = (props) => {
  const { apiDetail } = props
  if (apiDetail.responseArr && apiDetail.responseArr.length > 0) {
    const responseList = []
    for (const idx in apiDetail.responseArr) {
      const singleResponse = apiDetail.responseArr[idx]
      let responseHeader = ''
      if (singleResponse.headerArr && singleResponse.headerArr.length > 0) {
        responseHeader = (
          <div>
            <i className={ styles['small-title'] }>响应头参数</i>
            <ResponseParamsTable list={ singleResponse.headerArr }/>
          </div>
        )
      }
      let responseBody = ''
      if (singleResponse.responseStructArr && singleResponse.responseStructArr.length > 0) {
        responseBody = (
          <div>
            <i className={ styles['small-title'] }>响应体参数</i>
            <ResponseParamsTable list={ singleResponse.responseStructArr }/>
          </div>
        )
      }
      responseList.push(
        <div key={ idx }>
          <div className={ styles['resp-code-info'] }>
            <strong>{ singleResponse.code }</strong>
            <span dangerouslySetInnerHTML={ { __html: singleResponse.description } }></span>
          </div>
          { responseHeader }
          { responseBody }
        </div>
      )
    }
    return responseList
  } else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};

ApiResponse.propTypes = {
  apiDetail: PropTypes.object
}

export default ApiResponse;
