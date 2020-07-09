import React from 'react';
import PropTypes from 'prop-types';
import RequestParamsTable from '@/components/RequestParamsTable'

import styles from './index.less'

const ApiRequestFileParam = (props) => {
  const { paramList, title, forceRender = false } = props
  if (paramList && paramList.length > 0) {
    return (
      <div>
        <h3 className={ styles['small-title'] }>{ title }</h3>
        <RequestParamsTable list={ paramList }/>
      </div>
    )
  } else if(forceRender){
    return (
      <div>
        <h3 className={ styles['small-title'] }>{ title }</h3>
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
  title: PropTypes.any.isRequired,
  /**
   * 当paramList为空或null时,是否强制构建. 默认:false
   */
  forceRender: PropTypes.bool
}

export default ApiRequestFileParam;
