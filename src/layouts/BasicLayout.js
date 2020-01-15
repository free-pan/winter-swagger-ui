import React, {Component} from 'react'
import {connect} from 'dva';

import router from 'umi/router'
import {Tabs, Input, Row, Col} from 'antd'

import SwaggerSearch from '@/pages/top/SwaggerSearch'
import ApiList from '@/pages/right/ApiList'
import ApiTest from '@/pages/right/ApiTest'
import GlobalHeader from "@/pages/right/GlobalHeader";
import DocSummary from "@/pages/right/DocSummary"
import AboutAuthor from "@/pages/right/AboutAuthor"

import styles from './BasicLayout.less'
import validateUrlIsSame from '@/util/UrlValidateUtil'


const {TabPane} = Tabs
const {Search} = Input

function mapStateToProps({GlobalModel}) {
  return {GlobalModel};
}

class BasicLayout extends Component {

  state = {
    activeKey: 'ApiTest'
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {query} = this.props.location
    const {httpType, swaggerUri} = query
    if (httpType && swaggerUri) {
      this.props.dispatch({
        ...query,
        type: 'GlobalModel/query'
      })
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.GlobalModel !== this.props.GlobalModel || nextState.activeKey !== this.state.activeKey
  }

  onTabChange = (activeKey) => {
    this.setState({activeKey})
  }

  onSearchSwaggerDoc = ({swaggerUri, httpType}) => {
    const {dispatch, location} = this.props
    const {query, pathname} = location
    dispatch({
      type: 'GlobalModel/query',
      httpType, swaggerUri, kw: query.kw
    })
    const urlIsSame = validateUrlIsSame(
      {...query, pathname: pathname},
      {httpType: httpType, swaggerUri: swaggerUri, pathname: '/index'}
    )
    if (!urlIsSame) {
      router.push({
        pathname: '/index',
        query: {
          ...query,
          httpType,
          swaggerUri
        },
      })
    }
  }

  onSearch = (value) => {
    const {dispatch, location} = this.props
    dispatch({
      type: 'GlobalModel/apiSearch',
      kw: value
    })
    const {query, pathname} = location
    const urlIsSame = validateUrlIsSame(
      {...query, pathname: pathname},
      {...query, pathname: pathname, kw: value}
    )
    if (!urlIsSame) {
      router.push({
        pathname: pathname,
        query: {
          ...query,
          kw: value
        },
      })
    }
  }

  onMenuItemSelected = ({item, key, keyPath, selectedKeys, domEvent}) => {
    const {dispatch, location} = this.props
    dispatch({
      type: 'GlobalModel/searchApiDetail',
      apiKey: key
    })
    const {query, pathname} = location
    const urlIsSame = validateUrlIsSame(
      {
        ...query, pathname: pathname
      },
      {...query, pathname: '/detail', apiKey: key}
    )
    if (!urlIsSame) {
      router.push({
        pathname: '/detail',
        query: {
          ...query,
          apiKey: key
        },
      })
    }
  }

  onGlobalHeaderTableCellSave = (globalHeaderArr, globalHeaderCount) => {
    const {dispatch} = this.props
    dispatch({
      type: 'GlobalModel/updateGlobalHeaderArr',
      globalHeaderArr, globalHeaderCount
    })
  }

  onGlobalHeaderTableRowAdd = (globalHeaderArr, globalHeaderCount) => {
    const {dispatch} = this.props
    dispatch({
      type: 'GlobalModel/updateGlobalHeaderArr',
      globalHeaderArr, globalHeaderCount
    })
  }

  onGlobalHeaderTableRowDelete = (globalHeaderArr, globalHeaderCount) => {
    const {dispatch} = this.props
    dispatch({
      type: 'GlobalModel/updateGlobalHeaderArr',
      globalHeaderArr, globalHeaderCount
    })
  }

  render() {
    console.log('BasicLayout')
    const {GlobalModel, children, location} = this.props
    const {query} = location

    const {activeKey} = this.state

    const {swaggerUri} = query
    const {httpTypeMap, globalHeaderArr, globalHeaderCount, queriedApiInfoMap, apiDetail, openedKeys, swaggerDocBasicInfo} = GlobalModel
    const httpType = query.httpType ? query.httpType : GlobalModel.httpType

    const propsSwaggerSearch = {
      httpTypeMap,
      defaultHttpType: httpType,
      defaultSwaggerUri: swaggerUri,
      onSearchSwaggerDoc: this.onSearchSwaggerDoc
    }

    const propsSearch = {defaultValue: query.kw}

    const propsApiList = {
      show: activeKey === 'ApiList',
      defaultSelectedKey: query.apiKey,
      queriedApiInfoMap,
      openedKeys,
      onMenuItemSelected: this.onMenuItemSelected
    }

    const propsApiTest = {
      show: activeKey === 'ApiTest',
      apiDetail,
      swaggerDocBasicInfo,
      httpType,
      httpTypeMap,
      globalHeaderArr
    }

    const propsGlobalHeader = {
      show: activeKey === 'GlobalHeader',
      globalHeaderArr,
      globalHeaderCount,
      onTableCellSave: this.onGlobalHeaderTableCellSave,
      onTableRowAdd: this.onGlobalHeaderTableRowAdd,
      onTableRowDelete: this.onGlobalHeaderTableRowDelete
    }

    const propsDocSummary = {show: activeKey === 'DocSummary'}

    const propsAboutAuthor = {show: activeKey === 'AboutAuthor'}

    return (
      <div className={styles.container}>
        <Row>
          <Col span={14}>
            <div className={styles.top}>
              <SwaggerSearch {...propsSwaggerSearch}/>
            </div>
            <div className={styles.center}>
              {children}
            </div>
          </Col>
          <Col span={10}>
            <div className={styles.right}>
              <Tabs activeKey={activeKey} onChange={this.onTabChange}>
                <TabPane tab="接口列表" key="ApiList">
                  <Search
                    onSearch={this.onSearch}
                    placeholder={'请输入关键词搜索...'}
                    style={{marginBottom: '10px'}}
                    {...propsSearch}
                  />
                  <ApiList {...propsApiList}/>
                </TabPane>
                <TabPane tab="测试" key="ApiTest">
                  <ApiTest {...propsApiTest}/>
                </TabPane>
                <TabPane tab="全局请求头" key="GlobalHeader">
                  <GlobalHeader {...propsGlobalHeader}/>
                </TabPane>
                <TabPane tab="文档概况" key="DocSummary">
                  <DocSummary {...propsDocSummary} />
                </TabPane>
                <TabPane tab="关于" key="AboutAuthor">
                  <AboutAuthor {...propsAboutAuthor}/>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    )
      ;
  }
}

export default connect(
  mapStateToProps,
)(BasicLayout);
