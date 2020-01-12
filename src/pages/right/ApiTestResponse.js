import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './ApiTest.less'
import WinterCodemirror from '@/components/WinterCodemirror'

class ApiTestResponse extends Component {

  state = {
    renderTimes: 0
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.renderTimes !== this.state.renderTimes
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

  render() {
    return (
      <div>
        <h3 className={ styles.header }>
          响应结果
          <a style={ { fontSize: '13px', marginLeft: '5px' } }
             onClick={ () => {
               // that.onShowDrawer(that.responseCodeMirrorEditor, '响应结果')
             } }
          >独立窗查看</a>
        </h3>
        <div className={ styles.editorBorder }>
          <WinterCodemirror
            idPrefix={ 'resp_small_' }
            size={ { height: 256 } }
            cmOption={ {
              mode: 'javascript',
              readOnly: true
            } }
            onMounted={ this.onWinterCodeMirrorMounted }
          />
        </div>
      </div>
    );
  }
}

ApiTestResponse.propTypes = {
  onMounted: PropTypes.func.isRequired
};

export default ApiTestResponse;
