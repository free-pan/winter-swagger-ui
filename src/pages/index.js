import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd'

const Index = (props) => {
  return (
    <div className={'index-container'}>
      <h2>Swagger UI Theme</h2>
      <h3>
        简洁、直观、强悍的Swagger主题, 让API的查阅与测试更便捷、简单.
      </h3>
      <Button
        onClick={()=>{
          window.open('https://gitee.com/free_pan/winter-swagger-ui')
        }}
        type={'primary'} size={'large'}
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
      <div style={{marginTop: '25px', color: '#fa541c'}}>
        <strong>欢迎: 提问, PR, Watch, Star, Fork, 捐助</strong>
      </div>
      <div className={'pay-image-panel'}>
        <img src={'/wx-pay.png'}/>
        <img src={'/ali-pay.png'}/>
      </div>
    </div>
  );
};

Index.propTypes = {};

export default Index;
