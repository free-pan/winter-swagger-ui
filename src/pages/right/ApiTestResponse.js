import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './ApiTest.less'
import WinterCodemirror from '@/components/WinterCodemirror'
import DrawerCodemirror from "@/pages/right/DrawerCodemirror";
import {Drawer} from "antd";

class ApiTestResponse extends Component {

  state = {
    renderTimes: 0,
    /**
     * drawer的可见状态
     */
    drawerVisible: false
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.renderTimes !== this.state.renderTimes || nextState.drawerVisible !== this.state.drawerVisible
  }

  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted(this)
    }
  }


  /**
   * 当WinterCodemirror挂载完毕之后触发的回调函数
   * @param WinterCodeMirrorInstance WinterCodeMirror的实例对象
   */
  onWinterCodeMirrorMounted = (WinterCodeMirrorInstance) => {
    this.editor = WinterCodeMirrorInstance
  }

  setWinterCodemirrorValue = (value) => {
    if (this.editor) {
      this.editor.setValue(value)
    }
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
    console.log('onShowDrawer')
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

  render() {
    const {drawerVisible} = this.state
    return (
      <div>
        <h3 className={styles.header}>
          响应结果
          <a style={{fontSize: '13px', marginLeft: '5px'}}
             onClick={this.onShowDrawer}
          >独立窗查看</a>
        </h3>
        <div className={styles.editorBorder}>
          <WinterCodemirror
            idPrefix={'resp_small_'}
            size={{height: 256}}
            cmOption={{
              mode: 'javascript',
              readOnly: true
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
          <DrawerCodemirror title={'查看请求体参数'}
                            onMounted={this.onDrawerCodemirrorMounted}
                            visible={drawerVisible} readOnly={true}/>
        </Drawer>
      </div>
    );
  }
}

ApiTestResponse.propTypes = {
  onMounted: PropTypes.func.isRequired
};

export default ApiTestResponse;
