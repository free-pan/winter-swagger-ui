import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less'

/**
 * Api概况信息组件
 * @param props
 * @return {*}
 * @constructor
 */
const ApiSummary = (props) => {
  const { apiDetail } = props
  const className = apiDetail.deprecated ? 'deprecated' : ''
  return (
    <h2 className={ styles['api-summary'] + ' ' + className }>
      <span className={ styles['api-name'] }>{ apiDetail.name }</span>
      <i className={ styles['tag-desc'] }>{ apiDetail.tagDesc }</i>
    </h2>
  )
};

ApiSummary.propTypes = {
  apiDetail: PropTypes.object
}

export default ApiSummary;
