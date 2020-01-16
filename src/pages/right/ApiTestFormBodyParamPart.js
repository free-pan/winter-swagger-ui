import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {buildBodyParamInitValue} from '@/util/ApiParamInitDataUtil'

import {Drawer} from 'antd'

import DrawerCodemirror from "@/pages/right/DrawerCodemirror";

import styles from './ApiTest.less'

import WinterCodemirror from '@/components/WinterCodemirror'

/**
 * 适用于请求头/路径参数的构建
 * @param props
 * @return {*}
 * @constructor
 */
class ApiTestFormBodyParamPart extends PureComponent {

  state = {
    /**
     * drawer的可见状态
     */
    drawerVisible: false
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {apiDetail, onMounted} = this.props
    if (apiDetail && apiDetail.bodyParams && apiDetail.bodyParams.length > 0) {
      this.buildCodeMirrorValue();
    }
    if (onMounted) {
      onMounted(this)
    }
  }


  buildCodeMirrorValue() {
    if (this.props.apiDetail && this.props.apiDetail.bodyParams && this.props.apiDetail.bodyParams.length > 0) {
      const {bodyParams, consumes, bodyName} = this.props.apiDetail
      const consumesIsJson = this.consumesIsJson(consumes)
      const initValue = buildBodyParamInitValue(bodyName, consumesIsJson, bodyParams)
      console.log('bodyParams',bodyParams,consumesIsJson,initValue)
      if (this.editor) {
        this.editor.setValue(initValue)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.apiDetail !== prevProps.apiDetail) {
      this.buildCodeMirrorValue();
    }
  }

  /**
   * 获取consumes要求的数据格式是否为json
   * @param consumes
   * @return {boolean}
   */
  consumesIsJson = (consumes) => {
    let isJson = true;
    if (consumes) {
      for (const single of consumes) {
        if (single.toLowerCase().indexOf('xml') >= 0) {
          isJson = false;
          break;
        }
      }
    }
    return isJson
  }

  /**
   * 当WinterCodemirror挂载完毕之后触发的回调函数
   * @param WinterCodeMirrorInstance WinterCodeMirror的实例对象
   */
  onWinterCodeMirrorMounted = (WinterCodeMirrorInstance) => {
    this.editor = WinterCodeMirrorInstance
  }

  /**
   * 获取codemirror中的内容
   * @return {*} codemirror实例存在,则会返回对应的值,否则会抛出异常
   */
  getWinterCodeMirrorValue = () => {
    if (this.editor) {
      return this.editor.getValue()
    }
  }

  onShowDrawer = () => {
    this.setState({drawerVisible: true});
    this.drawerCodemirrorInstance.setValue(this.getWinterCodeMirrorValue())
  }

  onDrawerClose = (e) => {
    e.preventDefault()
    this.setState({drawerVisible: false});
  }

  onDrawerCodemirrorMounted = (editorInstance) => {
    this.drawerCodemirrorInstance = editorInstance
  }

  onDrawerCodemirrorSave = (content) => {
    if (this.editor) {
      this.editor.setValue(content)
      this.setState({drawerVisible: false})
    }
  }

  render() {
    const {apiDetail, title} = this.props
    const {drawerVisible} = this.state
    const {bodyParams, consumes, bodyName} = apiDetail
    const paramList = bodyParams
    if (paramList && paramList.length > 0) {
      const consumesIsJson = this.consumesIsJson(consumes)
      return (
        <div>
          <h3 className={styles.header}>
            {title}
            <a style={{fontSize: '13px', marginLeft: '5px'}}
               onClick={this.onShowDrawer}
            >独立窗编辑</a>
          </h3>
          <div className={styles.editorBorder}>
            <WinterCodemirror
              idPrefix={'req_small_'}
              size={{height: 256}}
              cmOption={{
                mode: consumesIsJson ? 'javascript' : 'xml'
              }}
              onMounted={this.onWinterCodeMirrorMounted}
            />
          </div>

          <Drawer
            placement="right"
            closable={true}
            onClose={this.onDrawerClose}
            visible={drawerVisible}
            getContainer={false}
            width={550}
            className={styles.codemirrorDrawer}
            style={{position: 'absolute'}}
          >
            <DrawerCodemirror title={'查看/编辑请求体参数'}
                              onMounted={this.onDrawerCodemirrorMounted}
                              visible={drawerVisible} readOnly={false} onSave={this.onDrawerCodemirrorSave}/>
          </Drawer>
        </div>
      )
    } else {
      return (
        <React.Fragment></React.Fragment>
      )
    }
  }
}

ApiTestFormBodyParamPart.propTypes = {
  apiDetail: PropTypes.object,
  /**
   * 参数所属分类名称
   */
  title: PropTypes.string.isRequired,
  /**
   * 当组件挂载完毕之后触发的回调函数
   */
  onMounted: PropTypes.func.isRequired
};

export default ApiTestFormBodyParamPart;
