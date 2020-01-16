import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Divider} from 'antd'
import ReactMarkdown from 'react-markdown/with-html'

class DocSummary extends Component {
  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  render() {
    console.log('DocSummary')
    const {swaggerDocBasicInfo} = this.props
    if (swaggerDocBasicInfo) {
      const {info, swagger, host, basePath} = swaggerDocBasicInfo
      const {title, version, contact, description} = info
      const {name, email} = contact
      console.log('swaggerDocBasicInfo', swaggerDocBasicInfo)
      return (
        <div>
          <h3 style={{textAlign: 'center', fontWeight: "bold"}}>{title}</h3>
          <Divider orientation="left" dashed={true}>基本信息</Divider>
          <Row>
            <Col span={12}><strong>负责人:</strong><span>{name}</span></Col>
            <Col span={12}><strong>版本:</strong><span>{version}</span></Col>
          </Row>
          <div style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
            <Row>
              <Col span={12}><strong>swagger:</strong><span>{swagger}</span></Col>
              <Col span={12}><strong>host:</strong><span>{host}</span></Col>
            </Row>
            <Divider orientation="left" dashed={true}>详述</Divider>
            <ReactMarkdown source={description} escapeHtml={false}/>
          </div>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

DocSummary.propTypes = {
  show: PropTypes.bool.isRequired
}

export default DocSummary;
