import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Menu } from 'antd'

import styles from './ApiList.less'

const { SubMenu } = Menu

/**
 * api列表
 */
class ApiList extends Component {
  state = {
    openedKeys: this.props.openedKeys,
    queriedApiInfoMap: this.props.queriedApiInfoMap,
    selectedKeys: this.props.defaultSelectedKey ? [this.props.defaultSelectedKey] : []
  }

  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.queriedApiInfoMap !== prevState.queriedApiInfoMap) {
      return {
        queriedApiInfoMap: nextProps.queriedApiInfoMap,
        openedKeys: nextProps.openedKeys
      }
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.queriedApiInfoMap !== this.props.queriedApiInfoMap || nextState.openedKeys !== this.state.openedKeys
  }

  buildMenuList = (queriedApiInfoMap) => {
    const menuList = []
    Object.keys(queriedApiInfoMap).forEach(tagName => {
      const tagInfo = queriedApiInfoMap[tagName]
      const apiList = []
      tagInfo.apiArr.forEach(apiInfo => {
        apiList.push(
          <Menu.Item key={ apiInfo.key }>
            <div className={ apiInfo.deprecated ? 'deprecated' : '' }>
              <span>{ apiInfo.name }</span>
              <i className={ styles.method }>{ apiInfo.method }</i>
            </div>
          </Menu.Item>
        )
      })
      menuList.push(
        <SubMenu
          key={ tagInfo.key }
          title={
            <span>
              <span>{ tagName }</span>
          </span>
          }
        >
          { apiList }
        </SubMenu>
      )
    })
    return menuList;
  }

  onOpenChange = (openKeys) => {
    this.setState({ openedKeys: openKeys })
  }

  render() {
    console.log('ApiList')
    const { onMenuItemSelected } = this.props
    const { queriedApiInfoMap, openedKeys, selectedKeys } = this.state
    return (
      <div>
        <Menu
          className={ styles.apiMenu }
          onOpenChange={ this.onOpenChange }
          onSelect={ onMenuItemSelected }
          openKeys={ openedKeys }
          defaultSelectedKeys={ selectedKeys }
          mode="inline"
        >
          { this.buildMenuList(queriedApiInfoMap) }
        </Menu>
      </div>
    );
  }
}

ApiList.propTypes = {
  defaultSelectedKey: PropTypes.string,
  queriedApiInfoMap: PropTypes.object,
  onMenuItemSelected: PropTypes.func.isRequired
}

export default ApiList;
