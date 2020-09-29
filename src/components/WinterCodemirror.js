import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'codemirror/lib/codemirror.js';

// 样式文件
import 'codemirror/lib/codemirror.css';

// 语法高亮
import 'codemirror/mode/javascript/javascript'

// require active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

import {throttle} from 'lodash'


const BLANK_STR = ''

/**
 * React整合Codemirror
 */
class WinterCodemirror extends Component {
    state = {
        id: new Date().getTime(),
        /**
         * 在内部存放代码内容
         */
        codeContent: null
    }

    showLog = true

    constructor(props) {
        super(props)
        this.onCodeMirrorContentChangeThrottled = throttle(this.onCodeMirrorContentChange, 300)
        if (this.showLog) {
            console.log('WinterCodemirror constructor')
        }
    }

    /**
     * 判断字符串是否非空
     * @param str
     * @return {boolean}
     */
    strNotBlank = (str) => {
        return (str !== undefined && str !== null && '' !== str.trim())
    }

    /**
     * 构建codemirror默认配置
     * @param cmOption
     */
    buildRealCodemirrorOption = (cmOption) => {
        const {
            // 默认语法
            mode = 'javascript',
            // 默认主题
            theme = 'eclipse',
            // 默认高亮当前行
            line = true,
            styleActiveLine = true,
            // 默认显示行号
            lineNumbers = true,
            // 强制换行
            lineWrapping = true,
            // 代码折叠
            foldGutter = true,
            gutters = ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        } = cmOption
        return {
            ...cmOption,
            mode, theme, line, styleActiveLine, lineNumbers, lineWrapping, foldGutter, gutters
        }
    }

    componentDidMount() {
        if (this.showLog) {
            console.log('WinterCodemirror componentDidMount')
        }
        this.codeMirrorInit()
    }

    codeMirrorInit() {
        if (!this.editor) {
            console.log('codeMirrorInit------->')
            const {
                // codemirror本身支持的选项
                cmOption = {},
                // codemirror组件的宽高, 默认宽度100%, 高度500px
                size = {width: '100%', height: 500},
                // 默认值
                defaultValue,
                // Codemirror初始化并挂载到dom节点中之后触发
                onMounted
            } = this.props

            const realCmOption = this.buildRealCodemirrorOption(cmOption)

            const textareaDom = document.getElementById(this.buildRealId())
            const editor = CodeMirror.fromTextArea(textareaDom, realCmOption)
            this.editor = editor

            const {width, height} = size
            // 设置宽高
            editor.setSize(width, height)
            const value = this.strNotBlank(defaultValue) ? defaultValue : BLANK_STR
            editor.setValue(value)

            editor.on("change", this.onCodeMirrorContentChangeThrottled);
            if (onMounted) {
                onMounted(this)
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.showLog) {
            console.log('WinterCodemirror shouldComponentUpdate:', nextState.codeContent !== this.state.codeContent)
        }
        return nextState.codeContent !== this.state.codeContent
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.editor) {
            console.log('------> componentDidUpdate')
            this.codeMirrorInit()
        }
    }

    componentWillUnmount() {
        // 此段代码的意义是避免这个段警告: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method
        this.setState = (state, callback) => {
            return;
        };
        console.log('--------> componentWillUnmount', this.editor, this.editor.getWrapperElement())
        this.editor.toTextArea()
        this.editor.getWrapperElement().remove()
        this.editor = null;
        // this.editor.off('change', this.onCodeMirrorContentChangeThrottled)
        // this.editor.toTextArea()
        // this.editor = null
    }

    /**
     * 监听codemirror的代码内容改变
     * @param editorInstance codemirror实例
     */
    onCodeMirrorContentChange = (editorInstance) => {
        const codeContent = editorInstance.getValue()
        this.setState({codeContent});
        const {onChange} = this.props
        if (onChange) {
            // 触发onChange监听事件
            onChange(codeContent, editorInstance)
        }
    }

    /**
     * 向codemirror中设置值
     * @param value {string}
     */
    setValue = (value) => {
        console.log('执行了:', value, this.editor)
        if (this.editor) {
            const realValue = this.strNotBlank(value) ? value : BLANK_STR
            this.editor.setValue(realValue)
            setTimeout(() => {
                this.editor.refresh();
            },1);
        }
    }

    /**
     * 修改codemirror的某项配置
     * @param option {string} 配置项key
     * @param value {any} 配置项值
     */
    setOption = (option, value) => {
        if (this.editor) {
            this.editor.setOption(option, value)
        } else {
            // throw "CodeMirror尚未实例化!"
        }
    }

    /**
     * 获取codemirror的配置项值
     * @param option {string} 配置项key
     * @return {*} 配置项值
     */
    getOption = (option) => {
        if (this.editor) {
            return this.editor.getOption()
        } else {
            // throw "CodeMirror尚未实例化!"
        }
    }

    /**
     * 设置codemirror的宽高
     * @param width {number|string} 宽度
     * @param height {number|string} 高度
     */
    setSize = (width, height) => {
        if (this.editor) {
            this.editor.setSize(width, height)
        } else {
            // throw "CodeMirror尚未实例化!"
        }
    }

    /**
     * 获取codemirror中的代码值
     * @return {string}
     */
    getValue = () => {
        if (this.editor) {
            return this.editor.getValue()
        } else {
            // throw "CodeMirror尚未实例化!"
        }
    }

    /**
     * 获取codemirror实例对象, 可以使用该实例调用codemirror的原生api
     */
    getCodemirrorInstance() {
        return this.editor
    }

    buildRealId = () => {
        const {id} = this.state
        const {idPrefix} = this.props
        return idPrefix ? idPrefix + '-' + id : id
    }

    render() {
        if (this.showLog) {
            console.log('WinterCodemirror render')
        }
        const id = this.buildRealId()
        return (
            <textarea id={id}></textarea>
        );
    }
}

WinterCodemirror.propTypes = {
    /**
     * codemirror原始配置项
     */
    cmOption: PropTypes.object,
    /**
     * codemirror的默认值
     */
    defaultValue: PropTypes.string,
    /**
     * codemirror内容改变时触发的回调函数
     */
    onChange: PropTypes.func,
    /**
     * WinterCodemirror挂载完毕之后,触发该函数,并将WinterCodemirror的实例作为该函数的入参
     */
    onMounted: PropTypes.func,
    /**
     * codemirror基础组件的id前缀, 当一个界面存在多个codemirror时,需要设置id前缀,避免组件的id重复
     */
    idPrefix: PropTypes.string,
    /**
     * codemirror的宽高
     */
    size: PropTypes.shape({
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
}

export default WinterCodemirror;
