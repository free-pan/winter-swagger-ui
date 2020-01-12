import React, { Component } from 'react';
import { connect } from 'dva';

import ApiSummary from './ApiSummary'
import ApiUriInfo from './ApiUriInfo'
import ApiNote from './ApiNote'
import ApiResponse from './ApiResponse'
import ApiRequestParamPart from './ApiRequestParamPart'
import styles from './index.less'

function mapStateToProps({ GlobalModel }) {
  return { GlobalModel };
}

class Index extends Component {

  state = {}

  methodColorMap = {
    POST: 'post-method-bg',
    GET: 'get-method-bg',
    PUT: 'put-method-bg',
    DELETE: 'delete-method-bg',
    OPTIONS: 'options-method-bg',
    PATCH: 'patch-method-bg',
    HEAD: 'head-method-bg'
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.GlobalModel.apiDetail !== this.props.GlobalModel.apiDetail
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.container) {
      this.refs.container.scrollIntoView()
    }
  }


  render() {
    console.log('left index')
    const { apiDetail } = this.props.GlobalModel
    if (apiDetail) {
      return (
        <div style={ { width: '100%', height: '100%', padding: '10px', scrollBehavior: 'smooth' } } ref={ 'container' }>
          <ApiSummary apiDetail={ apiDetail }/>
          <ApiUriInfo apiDetail={ apiDetail } methodColorMap={ this.methodColorMap }/>
          <h2 className={ styles['big-title'] }>请求参数</h2>
          <ApiRequestParamPart paramList={ apiDetail.pathParams } title={ "路径参数" }/>
          <ApiRequestParamPart paramList={ apiDetail.headerParams } title={ "请求头参数" }/>
          <ApiRequestParamPart paramList={ apiDetail.fileParams } title={ "文件参数" }/>
          <ApiRequestParamPart paramList={ apiDetail.bodyParams } title={ "请求体参数" }/>
          <ApiRequestParamPart paramList={ apiDetail.formParams } title={ "表单参数" }/>
          <h2 className={ styles['big-title'] }>其它说明</h2>
          <ApiNote apiDetail={ apiDetail }/>
          <h2 className={ styles['big-title'] }>响应参数</h2>
          <ApiResponse apiDetail={ apiDetail }/>
        </div>
      );
    } else {
      return <React.Fragment></React.Fragment>
    }
  }
}

export default connect(
  mapStateToProps,
)(Index);
