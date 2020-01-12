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
 * 适用于普通表单参数构建
 * @param props
 * @return {*}
 * @constructor
 */
const ApiTestFormNormalFormParamPart = (props) => {
  const { paramList, form, paramNamePrefix, title } = props
  const { getFieldDecorator } = form;
  if (paramList && paramList.length > 0) {
    const formItemArr = [];
    let key = 0;
    for (const singleParam of paramList) {
      const paramName = singleParam.name;
      const required = singleParam.required;
      const addonBefore = buildAddonBefore(paramName, required);
      const initialValue = buildInitialValue(singleParam);
      const isArray = singleParam.type === 'array';
      const placeholder = singleParam.description;
      if (!isArray) {
        formItemArr.push(
          <FormItem style={ { marginBottom: 0 } } key={ (++key) }>
            { getFieldDecorator(paramNamePrefix + paramName, {
              initialValue: initialValue,
              rules: [{ required: false }],
            })(
              <Input addonBefore={ addonBefore } placeholder={ placeholder }/>
            ) }
          </FormItem>
        );
      } else {
        for (let index = 0; index < 2; index++) {
          formItemArr.push(
            <FormItem style={ { marginBottom: 0 } } key={ (++key) }>
              { getFieldDecorator(paramNamePrefix + paramName + '[' + index + ']', {
                initialValue: initialValue,
                rules: [{ required: false, message: message }],
              })(
                <Input addonBefore={ paramName } placeholder={ placeholder }/>
              ) }
            </FormItem>
          );
        }
      }
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

ApiTestFormNormalFormParamPart.propTypes = {
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

export default ApiTestFormNormalFormParamPart;
