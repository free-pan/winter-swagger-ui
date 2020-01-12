import React from 'react';
import PropTypes from 'prop-types';

import { buildInitialValue } from '@/util/ApiParamInitDataUtil'

import styles from './ApiTest.less'

import { Form, Input } from 'antd'

const FormItem = Form.Item

/**
 * 构建显示的参数名
 * @param paramName 参数名
 * @param required 参数是否必须
 */
function buildAddonBefore(paramName, required) {
  let addonBefore = null;
  if (required) {
    addonBefore = <span className="myLabel"><i>*</i>{ paramName }</span>
  } else {
    addonBefore = <span>{ paramName }</span>
  }
  return addonBefore
}

/**
 * 适用于请求头/路径参数的构建
 * @param props
 * @return {*}
 * @constructor
 */
const ApiTestFormParamPart = (props) => {
  const { paramList, form, paramNamePrefix, title } = props
  const { getFieldDecorator } = form;
  if (paramList && paramList.length > 0) {
    const formItemArr = [];
    let key = 0;
    for (const singleParam of paramList) {
      const paramName = singleParam.name;
      const required = singleParam.required;
      const initialValue = buildInitialValue(singleParam);
      const placeholder = singleParam.description;
      const addonBefore = buildAddonBefore(paramName, required);
      formItemArr.push(
        <FormItem style={ { marginBottom: 0 } } key={ (++key) }>
          { getFieldDecorator(paramNamePrefix + paramName, {
            initialValue: initialValue,
            rules: [{ required: false }],
          })(
            <Input addonBefore={ addonBefore } placeholder={ placeholder }/>
          ) }
        </FormItem>
      )
    }
    return (
      <div>
        <h3 className={ styles.header }>
          { title }
        </h3>
        { formItemArr }
      </div>
    )
  } else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};

ApiTestFormParamPart.propTypes = {
  /**
   * 参数列表
   */
  paramList: PropTypes.array,
  /**
   * 表单
   */
  form: PropTypes.object,
  /**
   * 参数名前缀
   */
  paramNamePrefix: PropTypes.string.isRequired,
  /**
   * 参数所属分类名称
   */
  title: PropTypes.string.isRequired
};

export default ApiTestFormParamPart;
