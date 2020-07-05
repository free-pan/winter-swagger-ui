import React, {Component} from 'react';
import PropTypes from 'prop-types';
import WinterCodemirror from "@/components/WinterCodemirror";
import WinterUtil from "@/util/WinterUtil";
import {Row, Col, Button, Input} from 'antd'

import {
  ArrowUpOutlined,ArrowDownOutlined
} from '@ant-design/icons';
const {Search} = Input


class DrawerCodemirror extends Component {

  size = 'small'

  state = {
    // 用于存储查询关键词
    kw: null
  }

  constructor(props) {
    super(props);

  }

  /**
   * 用于性能优化,判断当前props和state的更新,是否需要执行render方法(是否需要更新界面)
   * @return boolean
   */
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.visible
  }

  /**
   * 向codemirror中设置值, 当codemirror尚未完成挂载，就调用该api，则会抛出异常
   * @param value
   */
  setValue = (value) => {
    if (this.winterCodemirrorInstance) {
      this.winterCodemirrorInstance.setValue(value)
    } else {
      throw "codemirror尚未实例化!"
    }
  }

  /**
   * codemirror挂载完成后触发
   * @param WinterCodemirrorInstance
   */
  onWinterCodemirrorMounted = (WinterCodemirrorInstance) => {
    this.winterCodemirrorInstance = WinterCodemirrorInstance
    const {onMounted} = this.props
    if (onMounted) {
      onMounted(this)
    }
  }

  /**
   * 保存按钮回调
   */
  onClickSave = () => {
    const {onSave} = this.props
    if (onSave) {
      if (this.winterCodemirrorInstance) {
        onSave(this.winterCodemirrorInstance.getValue())
      } else {
        throw "codemirror尚未实例化!"
      }
    }
  }

  /**
   * 关键词查询,并高亮显示第一个匹配的查询词
   * @param value
   */
  queryAndHighlightNext = (value) => {
    // 获取匹配到词的位置
    this.cursor = this.winterCodemirrorInstance.getCodemirrorInstance().getSearchCursor(value)
    // 高亮下一个匹配到的查询词
    this.highlightNextMatched();
  }

  /**
   * 高亮匹配到的下一个查询词
   * @return {boolean} 匹配结果
   */
  highlightNextMatched = () => {
    let matched = false
    if (!this.cursor) {
      return matched
    }
    matched = this.cursor.findNext()
    if (matched) {
      // 高亮匹配到的词
      this.winterCodemirrorInstance.getCodemirrorInstance().setSelection(this.cursor.from(), this.cursor.to());
    }
    return matched
  }

  /**
   * 关键词查询,并高亮显示上一个匹配的查询词
   * @param value
   */
  queryAndHighlightPrevious = (value) => {
    if (WinterUtil.strIsBlank(value)) {
      this.cursor = null
      return;
    }
    // 获取匹配到词的位置
    this.cursor = this.winterCodemirrorInstance.getCodemirrorInstance().getSearchCursor(value)
    // 高亮下一个匹配到的查询词
    this.highlightPreviousMatched();
  }

  /**
   * 高亮匹配到的上一个查询词
   * @return {boolean} 匹配结果
   */
  highlightPreviousMatched = () => {
    let matched = false
    if (!this.cursor) {
      return matched
    }
    matched = this.cursor.findPrevious()
    if (matched) {
      // 高亮匹配到的词
      this.winterCodemirrorInstance.getCodemirrorInstance().setSelection(this.cursor.from(), this.cursor.to());
    }
    return matched
  }

  /**
   * 回车搜索时触发
   * @param e
   */
  onSearch = (value, event) => {
    event.preventDefault()
    if (this.winterCodemirrorInstance) {
      const newKw = value.trim()
      if (WinterUtil.strIsBlank(newKw)) {
        return;
      }
      const {kw} = this.state
      if (kw !== newKw) {
        // 查询词修改了, 进行搜索并高亮
        this.queryAndHighlightNext(newKw)
      } else {
        // 查询词未改变
        if (this.cursor) { // 已匹配过,这是第二次对同一个查询词进行回车
          const matched = this.highlightNextMatched();
          if (!matched) {
            // 未匹配到有两种可能: 1.确实没有匹配的数据 2.已经匹配到末尾
            // 此处无论是哪种情况,都再重新查找一次,如果有找到,则高亮下一个
            this.queryAndHighlightNext(newKw)
          }
        } else {
          // 当前查询词尚未搜索过,那么就进行搜索并高亮
          this.queryAndHighlightNext(newKw)
        }
      }
    }
  }

  /**
   * 当搜索词改变时触发
   * @param e
   */
  onKwChange = (e) => {
    const kw = e.target.value.trim()
    this.setState({kw});
  }

  /**
   * 点击查询下一个按钮时触发
   */
  onQueryNext = () => {
    const {kw} = this.state
    if (WinterUtil.strIsBlank(kw)) {
      return;
    }
    if (this.cursor) {
      // 查询词已匹配过
      this.highlightNextMatched()
    } else {
      // 查询词未匹配过
      this.queryAndHighlightNext(kw)
    }
  }

  /**
   * 点击查询上一个按钮时触发
   */
  onQueryPrevious = () => {
    const {kw} = this.state
    if (WinterUtil.strIsBlank(kw)) {
      return;
    }
    if (this.cursor) {
      // 查询词已匹配过
      this.highlightPreviousMatched()
    } else {
      // 查询词未匹配过
      this.queryAndHighlightPrevious(kw)
    }
  }

  render() {
    console.log('DrawerCodemirror')
    const {readOnly, title} = this.props
    let codeMirrorHeight
    if (readOnly) {
      codeMirrorHeight = 'calc(100vh - 110px)'
    } else {
      codeMirrorHeight = 'calc(100vh - 138px)'
    }

    return (
      <React.Fragment>
        <h3>{title}</h3>
        {readOnly ? '' : <Button type={'primary'} size={this.size} onClick={this.onClickSave}
                                 style={{width: '100%', marginBottom: '5px'}}>保存编辑结果</Button>}
        <Row style={{marginBottom: '4px'}}>
          <Col span={14}>
            <Search
              placeholder="输入关键词查找..."
              onSearch={this.onSearch}
              onChange={this.onKwChange}
              size={this.size}
            />
          </Col>
          <Col span={5}>
            <Button icon={<ArrowDownOutlined />} size={this.size} onClick={this.onQueryNext}
                    style={{width: '100%'}}/>
          </Col>
          <Col span={5}>
            <Button icon={<ArrowUpOutlined />} size={this.size} onClick={this.onQueryPrevious}
                    style={{width: '100%'}}/>
          </Col>
        </Row>
        <WinterCodemirror cmOption={{readOnly}} size={{height: codeMirrorHeight}}
                          onMounted={this.onWinterCodemirrorMounted}/>
      </React.Fragment>
    );
  }
}

DrawerCodemirror.propTypes = {
  /**
   * 当前组件是否处于可见状态,只有处于可见状态才会执行render方法(用于性能优化)
   */
  visible: PropTypes.bool.isRequired,
  /**
   * 面板标题
   */
  title: PropTypes.string.isRequired,
  /**
   * 组件挂在到html节点上之后，触发该回调
   */
  onMounted: PropTypes.func,
  /**
   * codemirror编辑器是否只读
   */
  readOnly: PropTypes.bool.isRequired,
  /**
   * 调用保存按钮触发的回调, 会将当前编辑器中的内容,作为方法的入参
   */
  onSave: PropTypes.func
};

export default DrawerCodemirror;
