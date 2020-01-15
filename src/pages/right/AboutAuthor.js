import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Divider} from 'antd'

class AboutAuthor extends Component {
  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  render() {
    const author = {name: '潘志勇', wx: 'coder_pan', desc: '一个会一点前端技术的专业JAVA后端 (- . -)!'}
    const swaggerUI = {
      version: '2.0',
      sourceRepo: 'https://gitee.com/free_pan/swagger-ui-theme',
      desc: '基于UMI框架开发, 欢迎start, 克隆, 推荐使用!'
    }
    return (
      <div>
        <h3 style={{textAlign: 'center', fontWeight: "bold"}}>Swagger UI Theme</h3>
        <Divider orientation="left" dashed={true}>作者</Divider>
        <Row>
          <Col span={12}><strong>姓名:</strong><span>{author.name}</span></Col>
          <Col span={12}><strong>微信号:</strong><span>{author.wx}</span></Col>
        </Row>
        <div><strong>特质:</strong><span>{author.desc}</span></div>
        <Divider orientation="left" dashed={true}>版本</Divider>
        <Row>
          <Col span={12}><strong>版本:</strong><span>{swaggerUI.version}</span></Col>
          <Col span={12}><strong>源码:</strong><span><a
            href={swaggerUI.sourceRepo}>Swagger UI theme</a></span></Col>
        </Row>
        <div><strong>其它:</strong><span>{swaggerUI.desc}</span></div>
        <Divider orientation="left" dashed={true}>发现</Divider>
        <Row>
          <Col span={8}><a href="https://gitee.com/free_pan" style={{
            width: '100%',
            textAlign: 'center',
            display: 'block',
            fontSize: '16px'
          }}>gitee</a></Col>
          <Col span={8}><a href="https://github.com/free-pan" style={{
            width: '100%',
            textAlign: 'center',
            display: 'block',
            fontSize: '16px'
          }}>github</a></Col>
          <Col span={8}><a href="https://www.jianshu.com/u/86de94c36223"
                           style={{width: '100%', textAlign: 'center', display: 'block', fontSize: '16px'}}>简书</a></Col>
        </Row>
      </div>
    );
  }
}

AboutAuthor.propTypes = {
  show: PropTypes.bool.isRequired
}

export default AboutAuthor;
