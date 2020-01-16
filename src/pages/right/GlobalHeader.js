import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Table, Input, Button, Popconfirm, Form} from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({...record, ...values});
    });
  };

  renderCell = form => {
    this.form = form;
    const {children, dataIndex, record, title} = this.props;
    const {editing} = this.state;
    return editing ? (
      <Form.Item style={{margin: 0}}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} 是必须的.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{paddingRight: 24, height: '30px'}}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class GlobalHeader extends Component {
  columns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: 150,
    },
    {
      title: '参数值',
      dataIndex: 'val',
      editable: true,
      key: 'val',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      render: (text, record) =>
        this.props.globalHeaderArr.length >= 1 ? (
          <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ]

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  handleDelete = key => {
    const globalHeaderArr = [...this.props.globalHeaderArr];
    this.props.onTableRowDelete(globalHeaderArr.filter(item => item.key !== key), this.props.globalHeaderCount)
  }

  handleAdd = () => {
    const newData = {
      key: this.props.globalHeaderCount + 1,
      name: '',
      val: ''
    };
    const globalHeaderArr = [...this.props.globalHeaderArr];
    globalHeaderArr.push(newData)
    this.props.onTableRowAdd(globalHeaderArr, this.props.globalHeaderCount + 1)
  }

  handleSave = row => {
    const globalHeaderArr = [...this.props.globalHeaderArr];
    const index = globalHeaderArr.findIndex(item => row.key === item.key);
    const item = globalHeaderArr[index];
    globalHeaderArr.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.onTableCellSave(globalHeaderArr, this.props.globalHeaderCount)
  }

  render() {
    console.log('GlobalHeader')
    const {globalHeaderArr} = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 8, width: '100%'}}>
          新增
        </Button>
        <div style={{height: 'calc(100vh - 150px)', overflow: 'auto'}}>
          <Table
            pagination={false}
            size={'small'}
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={globalHeaderArr}
            columns={columns}
          />
        </div>
      </div>
    )
  }
}

GlobalHeader.propTypes = {
  /**
   * 全局请求头数据
   */
  globalHeaderArr: PropTypes.array.isRequired,
  /**
   * 是否显示当前组件(是否执行render函数，用于性能优化)
   */
  show: PropTypes.bool.isRequired,
  /**
   * 全局请求头的数量
   */
  globalHeaderCount: PropTypes.number.isRequired,
  /**
   * 当某个单元格修改完毕之后,触发的回调函数
   */
  onTableCellSave: PropTypes.func.isRequired,
  /**
   * 当点击新增时,触发的回调函数
   */
  onTableRowAdd: PropTypes.func.isRequired,
  /**
   * 当点击删除时,触发的回调函数
   */
  onTableRowDelete: PropTypes.func.isRequired
}

export default GlobalHeader;
