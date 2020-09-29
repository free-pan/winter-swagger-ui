import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import styles from './ApiTest.less'
import WinterCodemirror from '@/components/WinterCodemirror'
import DrawerCodemirror from "@/pages/right/DrawerCodemirror";
import {Drawer} from "antd";

class ApiTestResponse extends PureComponent {

    state = {
        renderTimes: 0,
        /**
         * drawer的可见状态
         */
        drawerVisible: false,
        /**
         * drawer的宽度
         */
        width: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onMounted) {
            this.props.onMounted(this)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('ApiTest Response:componentDidUpdate<<--------------------')
        const {isImageResult} = this.props;
        const {isBinaryResult} = this.props;
        console.log(isImageResult, isBinaryResult)
        let dom;
        if (isImageResult) {
            dom = document.getElementById('download-file')
            if (dom) {
                dom.remove()
            }
            dom = document.getElementById('real-download-file')
            if (dom) {
                dom.remove()
            }
        }
        if (isBinaryResult) {
            dom = document.getElementById('image-content')
            if (dom) {
                dom.remove()
            }
            dom = document.getElementById('image-content-image')
            if (dom) {
                dom.remove()
            }
        }
        if (!isImageResult && !isBinaryResult) {
            dom = document.getElementById('download-file')
            console.log(dom)
            if (dom) {
                dom.remove()
            }
            dom = document.getElementById('image-content')
            console.log(dom)
            if (dom) {
                dom.remove()
            }
            dom = document.getElementById('image-content-image')
            if (dom) {
                dom.remove()
            }
            dom = document.getElementById('real-download-file')
            if (dom) {
                dom.remove()
            }
        }
    }

    componentWillUnmount() {
        let dom = document.getElementById('image-content')
        if (dom) {
            dom.remove()
        }
        dom = document.getElementById('download-file')
        if (dom) {
            dom.remove()
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
        this.setState({drawerVisible: true, width: 550});
        if(this.drawerCodemirrorInstance){
            this.drawerCodemirrorInstance.setValue(this.getWinterCodeMirrorValue())
        }
    }

    onDrawerClose = (e) => {
        e.preventDefault()
        this.setState({drawerVisible: false, width: 0});
    }

    onDrawerCodemirrorMounted = (editorInstance) => {
        console.log('editorInstance-->', editorInstance)
        this.drawerCodemirrorInstance = editorInstance
    }

    renderRealResult(isImageResult, isBinaryResult) {
        console.log(isImageResult, isBinaryResult)
        if (isImageResult) {
            return (
                <div id={'image-content'}></div>
            )
        } else if (isBinaryResult) {
            return (
                <div id={'download-file'}></div>
            )
        } else {
            return (
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
            )
        }
    }

    render() {
        const {drawerVisible} = this.state
        const {isImageResult} = this.props;
        const {isBinaryResult} = this.props;
        console.log('ApiTestResponse.js render')
        return (
            <div>
                <h3 className={styles.header}>
                    响应结果
                    {(isImageResult || isBinaryResult) ? '' : <a style={{fontSize: '13px', marginLeft: '5px'}}
                                                                 onClick={this.onShowDrawer}
                    >独立窗查看</a>}
                </h3>
                {this.renderRealResult(isImageResult, isBinaryResult)}


                <Drawer
                    placement="right"
                    closable={true}
                    onClose={this.onDrawerClose}
                    visible={drawerVisible}
                    getContainer={false}
                    width={this.state.width}
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
    /**
     * 挂载完毕执行的回调函数
     */
    onMounted: PropTypes.func.isRequired,
    /**
     * 请求的返回结果是否为图片
     */
    isImageResult: PropTypes.bool.isRequired,
    /**
     * 请求的返回结果是否为二进制数据(文件)
     */
    isBinaryResult: PropTypes.bool.isRequired
};

export default ApiTestResponse;
