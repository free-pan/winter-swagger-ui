import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd'

const Index = (props) => {
  return (
    <div className={'index-container'}>
      <h2>Swagger UI Theme</h2>
      <h3>
        简洁、直观、强悍的Swagger主题, 让API文档的查阅与测试更便捷、简单.
      </h3>
      <Button type={'primary'} size={'large'}
              className={'load-source-btn'}
              style={{
                marginTop: '15px',
                boxShadow: 'inset 0 -4px 0 #23527c',
                background: '#337ab7',
                border: 0,
                width: '40%',
                height: '50px',
                transition: 'all .2s ease-in-out',
                borderRadius: '6px'
              }}
      >获取源码</Button>
      <div style={{marginTop: '30px'}}>
        <strong>欢迎: 提问, PR, Watch, Star, Fork</strong>
      </div>
    </div>
  );
};

Index.propTypes = {};

export default Index;
