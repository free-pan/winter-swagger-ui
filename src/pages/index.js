import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd'

const Index = (props) => {
  return (
    <div className={'index-container'}>
      <h1>Swagger UI Theme</h1>
      <h3>
        简洁、直观、强悍的Swagger主题, 让API文档的查阅与测试更便捷、简单.
      </h3>
      <Button type={'primary'} size={'large'} style={{background: '#2f54eb',border: '1px solid #2f54eb'}}>Gitee</Button>
    </div>
  );
};

Index.propTypes = {};

export default Index;
