import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, AutoComplete, Input } from 'antd'
import styles from './SwaggerSearch.less'

import WinterUtil from '@/util/WinterUtil'

const InputGroup = Input.Group;
const { Option } = Select

class SwaggerSearch extends Component {

  state = {
    swaggerUri: this.props.defaultSwaggerUri,
    list: [],
    httpType: this.props.defaultHttpType
  }

  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.httpType !== this.props.httpType) || (nextState.swaggerUri !== this.state.swaggerUri)
  }

  onAutoCompleteItemSelected = (value, option) => {
    //localhost:8000/swagger-doc.json
    this.setState({ swaggerUri: value })
    if (WinterUtil.strNotBlank(value) && WinterUtil.strNotBlank(this.state.httpType)) {
      this.props.onSearchSwaggerDoc({ swaggerUri: value, httpType: this.state.httpType })
    }
  }

  onSelectChange = (value) => {
    this.setState({ httpType: value });
    if (WinterUtil.strNotBlank(this.state.swaggerUri)) {
      this.props.onSearchSwaggerDoc({ httpType: value, swaggerUri: this.state.swaggerUri })
    }
  }

  onInputChange = (query) => {
    let realVal = query.trim().toLowerCase()
    // 去除http://或https://前缀
    if (realVal.startsWith('http://')) {
      realVal = realVal.replace(/http:\/\//, '')
    } else if (realVal.startsWith('https://')) {
      realVal = realVal.replace(/https:\/\//, '')
    }
    // 去除/v2/api-docs后缀
    if (realVal.endsWith('/v2/api-docs')) {
      realVal = realVal.substring(0, realVal.length - '/v2/api-docs'.length)
    }
    let list;
    if (WinterUtil.strNotBlank(realVal)) {
      if (realVal.indexOf('loc') >= 0) {
        if (realVal.indexOf('/') >= 0) {
          list = [realVal, realVal + '/v2/api-docs']
        } else {
          list = [
            `localhost/v2/api-docs`,
            `localhost:8080/v2/api-docs`
          ]
          if (!WinterUtil.arrayContainsVal(list, `${realVal}/v2/api-docs`)) {
            list.unshift(`${realVal}/v2/api-docs`)
            list.unshift(`${realVal}`)
          }
        }
      } else {
        list = [
          `${realVal}`,
          `${realVal}/v2/api-docs`
        ]
      }
    } else {
      list = []
    }
    this.setState({ list, swaggerUri: realVal })
  }

  render() {
    console.log('SwaggerSearch')
    const { httpTypeMap, defaultHttpType, defaultSwaggerUri } = this.props
    const { list } = this.state

    const httpTypeOptionArr = []
    Object.keys(httpTypeMap).forEach(key => httpTypeOptionArr.push(<Option value={ key }
                                                                           key={ key }>{ httpTypeMap[key] }</Option>))

    const size = 'large'
    return (
      <InputGroup compact>
        <Select
          defaultValue={ defaultHttpType }
          onChange={ this.onSelectChange }
          className={ styles.httpTypeSelect }
          size={ size }>
          { httpTypeOptionArr }
        </Select>
        <AutoComplete
          defaultValue={ defaultSwaggerUri }
          dataSource={ list }
          onChange={ this.onInputChange }
          onSelect={ this.onAutoCompleteItemSelected }
          placeholder={ '请输入swagger文档地址...' }
          size={ size }
          className={ styles.uriInput }
        />
      </InputGroup>
    )
  }
}

SwaggerSearch.propTypes = {
  defaultSwaggerUri: PropTypes.string,
  defaultHttpType: PropTypes.string.isRequired,
  httpTypeMap: PropTypes.object.isRequired,
  onSearchSwaggerDoc: PropTypes.func.isRequired
}

export default SwaggerSearch;
