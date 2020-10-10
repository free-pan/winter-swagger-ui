import React, {memo, useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Button, Popconfirm, Form} from 'antd';

const EditableContext = React.createContext();

// interface Item {
//   key: string;
//   name: string;
//   age: string;
//   address: string;
// }
//
// interface EditableRowProps {
//   index: number;
// }

// const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//       <Form form={form} component={false}>
//         <EditableContext.Provider value={form}>
//           <tr {...props} />
//         </EditableContext.Provider>
//       </Form>
//   );
// };

const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

// interface EditableCellProps {
//   title: React.ReactNode;
//   editable: boolean;
//   children: React.ReactNode;
//   dataIndex: string;
//   record: Item;
//   handleSave: (record: Item) => void;
// }

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async e => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} 是必须的.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap"
                 onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const GlobalHeader = (props) => {
    const {globalHeaderArr, globalHeaderCount, onTableRowAdd, onTableRowDelete, record, onTableCellSave} = props;

    const originColumns = [
        {
            title: '键',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width:140,
        },
        {
            title: '值',
            dataIndex: 'val',
            editable: true,
            key: 'val',
        },
        {
            title: '操作',
            width: 70,
            dataIndex: 'operation',
            render: (text, record) =>
                globalHeaderArr.length >= 1 ? (
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    // 仅在组件第一次初始化时调用
    useEffect(() => {
    }, [])

    const handleDelete = key => {
        const newGlobalHeaderArr = [...globalHeaderArr];
        onTableRowDelete(newGlobalHeaderArr.filter(item => item.key !== key), globalHeaderCount)
    };

    const handleAdd = () => {
        const newData = {
            key: globalHeaderCount + 1,
            name: '',
            val: ''
        };
        const newGlobalHeaderArr = [...globalHeaderArr];
        newGlobalHeaderArr.push(newData)
        onTableRowAdd(newGlobalHeaderArr, globalHeaderCount + 1)
    };

    const handleOnSave = row => {
        // this.toggleEdit();
        console.log('row', row)
        const newGlobalHeaderArr = [...globalHeaderArr];
        const index = newGlobalHeaderArr.findIndex(item => row.key === item.key);
        const item = newGlobalHeaderArr[index];
        newGlobalHeaderArr.splice(index, 1, {
            ...item,
            ...row,
        });
        onTableCellSave(newGlobalHeaderArr, newGlobalHeaderArr.length);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = originColumns.map(col => {
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
                handleSave: handleOnSave,
            }),
        };
    });
    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{marginBottom: 16}}>
                新增
            </Button>
            <Table
                scroll={{ y: 460 }}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={globalHeaderArr}
                columns={columns}
            />
        </div>
    );
}
export default memo(GlobalHeader);

// GlobalHeader.propTypes = {
//     /**
//      * 全局请求头数据
//      */
//     globalHeaderArr: PropTypes.array.isRequired,
//     /**
//      * 是否显示当前组件(是否执行render函数，用于性能优化)
//      */
//     show: PropTypes.bool.isRequired,
//     /**
//      * 全局请求头的数量
//      */
//     globalHeaderCount: PropTypes.number.isRequired,
//     /**
//      * 当某个单元格修改完毕之后,触发的回调函数
//      */
//     onTableCellSave: PropTypes.func.isRequired,
//     /**
//      * 当点击新增时,触发的回调函数
//      */
//     onTableRowAdd: PropTypes.func.isRequired,
//     /**
//      * 当点击删除时,触发的回调函数
//      */
//     onTableRowDelete: PropTypes.func.isRequired
// }
