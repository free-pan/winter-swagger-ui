import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less'
import { Row, Col } from 'antd'

const ApiUriInfo = (props) => {
  const { apiDetail, methodColorMap } = props
  const className = apiDetail.deprecated ? 'deprecated' : ''
  let strong = null
  if (apiDetail.deprecated) {
    strong = (
      <strong
        className={ styles['request-method'] + ' ' + styles['deprecated-method-bg'] }>{ apiDetail.method.toUpperCase() }</strong>
    )
  } else {
    strong = (
      <strong
        className={ styles['request-method'] + ' ' + methodColorMap[apiDetail.method.toUpperCase()] }>{ apiDetail.method.toUpperCase() }</strong>
    )
  }
  return (
    <div>
      <div className={ styles['uri-info'] + ' ' + className }>
        { strong }
        <span className={ styles['api-uri'] }>{ apiDetail.path }</span>
      </div>
      <Row className={ styles['other-info'] }>
        <Col span={ 12 }><strong className={ styles['label'] }>请求数据格式:</strong><span>{ apiDetail.produces }</span></Col>
        <Col span={ 12 }><strong
          className={ styles['label'] }>响应数据格式:</strong><span>{ apiDetail.consumes ? apiDetail.consumes : ['application/json'] }</span></Col>
      </Row>
    </div>
  );
};

ApiUriInfo.propTypes = {
  apiDetail: PropTypes.object,
  methodColorMap: PropTypes.object
}

export default ApiUriInfo;
