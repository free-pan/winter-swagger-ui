import React, { Component } from 'react';
import PropTypes from 'prop-types';

import extractTableExpandedRowKeys from '@/util/ExtractTableExpanedRowKeysUtil'

import { Table } from 'antd'

class ResponseParamsTable extends Component {

  state = {
    list: [],
    expandedRowKeys: []
  }

  columns = [{
    title: '参数名',
    width: 300,
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '类型',
    width: 130,
    dataIndex: 'type',
    key: 'type'
  }, {
    title: "简述",
    dataIndex: 'description',
    key: 'description',
    render: (text, record) => <div dangerouslySetInnerHTML={ { __html: text } }></div>
  }]

  constructor(props) {
    super(props);

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.list !== prevState.list) {
      return {
        list: nextProps.list,
        expandedRowKeys: extractTableExpandedRowKeys(nextProps.list)
      }
    } else {
      return null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.expandedRowKeys !== this.state.expandedRowKeys
  }

  /**
   * 表格行展开时触发
   * @param expanded {boolean} true表示当前操作是展开,false表示当前操作是收缩
   * @param record 展开的记录数据
   */
  onExpand = (expanded, record) => {
    const expandedRowKeys = [...this.state.expandedRowKeys]
    if (!expanded) {
      const idx = expandedRowKeys.findIndex(item => record.key === item)
      if (idx >= 0) {
        expandedRowKeys.splice(idx, 1)
      }
    } else {
      expandedRowKeys.push(record.key)
    }
    this.setState({ expandedRowKeys })
  }

  render() {
    return (
      <div>
        <Table expandedRowKeys={ this.state.expandedRowKeys } onExpand={ this.onExpand } dataSource={ this.state.list }
               columns={ this.columns } size={ 'small' }
               pagination={ false }/>
      </div>
    );
  }
}

ResponseParamsTable.propTypes = {
  list: PropTypes.array
}

export default ResponseParamsTable;
