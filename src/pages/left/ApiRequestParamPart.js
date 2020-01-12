import React from 'react';
import PropTypes from 'prop-types';
import RequestParamsTable from '@/components/RequestParamsTable'

import styles from './index.less'

const ApiRequestFileParam = (props) => {
  const { paramList, title } = props
  if (paramList && paramList.length > 0) {
    return (
      <div>
        <h3 className={ styles['small-title'] }>{ title }</h3>
        <RequestParamsTable list={ paramList }/>
      </div>
    )
  } else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};

ApiRequestFileParam.propTypes = {
  paramList: PropTypes.array,
  title: PropTypes.string.isRequired
}

export default ApiRequestFileParam;
