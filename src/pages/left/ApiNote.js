import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown/with-html'

import WinterUtil from '@/util/WinterUtil'

/**
 * api其它描述信息
 * @param props
 * @return {*}
 * @constructor
 */
const ApiNote = (props) => {
  const { apiDetail } = props
  if (WinterUtil.strNotBlank(apiDetail.description)) {
    return (
      <ReactMarkdown source={ apiDetail.description } escapeHtml={ false }/>
    )
  }
  return (
    <React.Fragment></React.Fragment>
  );
};

ApiNote.propTypes = {
  apiDetail: PropTypes.object
}

export default ApiNote;
