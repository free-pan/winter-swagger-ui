import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// 将json转为FormData
import {objectToForm} from 'object-to-form';

import {message as antdMessage, notification, Form, Upload, Button, Icon} from 'antd'

import ApiTestFormParamPart from './ApiTestFormParamPart'
import ApiTestFormNormalFormParamPart from './ApiTestFormNormalFormParamPart'

import styles from './ApiTest.less'
import ApiTestFormBodyParamPart from "@/pages/right/ApiTestFormBodyParamPart";
import ApiTestResponse from "@/pages/right/ApiTestResponse";
import apiRemoteService from '@/services/ApiRemoteService'
import WinterUtil from '@/util/WinterUtil'

@Form.create()
class ApiTestForm extends PureComponent {

  state = {
    apiExecute: false,
    fileList: []
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.apiDetail !== this.props.apiDetail) {
      // 如果上一个apiDetail和当前的apiDetail不是同一个，则清除response codemirror中的内容
      if (this.responseCodeMirrorEditorWrapper) {
        this.responseCodeMirrorEditorWrapper.setWinterCodemirrorValue('')
      }
    }
  }

  /**
   * 删除对象的属性值为空或null的属性
   * @param tmpObj
   */
  removeEmptyValueField = (tmpObj) => {
    for (const idx in tmpObj) {
      if (tmpObj[idx] === null || tmpObj[idx] === '') {
        delete tmpObj[idx]
      }
    }
    return tmpObj
  }

  createFileUploadFormItem = (title, paramList) => {
    const {getFieldDecorator} = this.props.form;
    const formItemArr = [];
    if (paramList && paramList.length > 0) {

      const fileUploadProps = {
        onRemove: (file) => {
          this.setState(({fileList}) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
        },
        beforeUpload: (file) => {
          this.setState(({fileList}) => ({
            fileList: [...fileList, file],
          }));
          return false;
        },
        fileList: this.state.fileList
      };
      formItemArr.push(
        <Upload {...fileUploadProps} key={1}>
          <Button size={'small'}>
            <Icon type="upload"/> 选择文件
          </Button>
        </Upload>
      );
      return (
        <div>
          <h3 className={styles.header}>
            {title}
          </h3>
          {formItemArr}
        </div>
      )
    }
  }

  /**
   * 是否二进制结果
   */
  isBinaryResult = (contentType) => {
    if (contentType) {
      return (
        -1 !== contentType.indexOf('octet-stream')
        || -1 !== contentType.indexOf('excel')
        || -1 !== contentType.indexOf('download')
        || -1 !== contentType.indexOf('pdf')
        || -1 !== contentType.indexOf('word')
      )
    } else {
      return false
    }
  }

  /**
   * 打印相应结果
   * @param testApiUrl
   * @param result
   */
  printResponse = (testApiUrl, result) => {
    console.log('result', result)
    if (!result) {
      this.setState({
        apiExecute: false
      })
      antdMessage.error(testApiUrl + '  ===>  服务器未给出任何响应!');
      if (this.responseCodeMirrorEditorWrapper) {
        this.responseCodeMirrorEditorWrapper.setWinterCodemirrorValue('服务器未给出任何响应. \r\n可能的原因: \r\n1.网络异常. \r\n2.服务器响应超时 \r\n3.客户端的超时时间设置过短 \r\n4.测试地址错误 \r\n5.后端服务未开启跨域支持')
      }
    } else {
      const {data, response} = result
      if (response.status === 200 || response.status === 201) {
        antdMessage.info(testApiUrl + '   ===>  http响应状态码: ' + response.status);
        let isBinaryResult = this.isBinaryResult(response.headers['content-type']);
        if (isBinaryResult) {
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement('a');
          link.href = url;
          let fileName = '后台返回的下载文件(未在content-disposition中找到文件名)';
          if (response.headers['content-disposition']) {
            let tmp = response.headers['content-disposition'].replace(new RegExp("attachment;filename=", 'gm'), "");
            if ('' !== tmp) {
              fileName = decodeURI(tmp);
            }
          }
          link.setAttribute('download', fileName);
          link.setAttribute('id', 'real-download-file');
          link.textContent = fileName;
          let oldLink = document.getElementById('real-download-file');
          if (oldLink) {
            oldLink.remove();
          }
          document.getElementById('download-file').appendChild(link);
          this.setState({
            apiExecute: false
          })
        } else {
          this.setState({
            apiExecute: false
          })
          if (this.responseCodeMirrorEditorWrapper) {
            this.responseCodeMirrorEditorWrapper.setWinterCodemirrorValue(JSON.stringify(data, null, 4))
          }
        }
      } else {
        antdMessage.error(testApiUrl + ' ==> http响应状态码: ' + response.status + ', 错误信息:' + response.error, 10);
        this.setState({
          apiExecute: false
        })
      }
    }
  }

  /**
   * 提取有效的全局请求头，并将数组结构转换为对象结构
   */
  extractValidGlobalHeader = (globalHeaderArr) => {
    const globalHeader = {}
    for (const globalHeaderSingle of globalHeaderArr) {
      if (WinterUtil.strNotBlank(globalHeaderSingle.val) && WinterUtil.strNotBlank(globalHeaderSingle.name)) {
        globalHeader[globalHeaderSingle.name.trim()] = globalHeaderSingle.val.trim()
      }
    }
    return globalHeader
  }

  onSubmitForm = (e) => {
    e.preventDefault()
    this.setState({
      apiExecute: true
    })
    const {apiDetail, httpType, form, testApiFullUrl, globalHeaderArr} = this.props
    const {fileParams, produces, consumes, method} = apiDetail
    const realGlobalHeader = this.extractValidGlobalHeader(globalHeaderArr)

    let accept = "application/json";
    let isBinaryResult = false;
    let isImageResult = false;
    if (produces) {
      for (const single of produces) {
        if (single.indexOf('xml') >= 0) {
          accept = "application/xml";
          break;
        } else if (this.isBinaryResult(single)) {
          isBinaryResult = true;
          break;
        } else if (-1 !== single.indexOf('image/jpeg')
          || -1 !== single.indexOf('image/png')
          || -1 !== single.indexOf('image/gif')) {
          isImageResult = true;
          break;
        }
      }
    }

    let contentType = "application/json";
    let isUpload = false;
    if (typeof (fileParams) !== 'undefined' && fileParams.length > 0) {
      contentType = "multipart/form-data"
      isUpload = true;
    } else if (consumes) {
      for (const single of consumes) {
        if (single.toLowerCase().indexOf('xml') >= 0) {
          contentType = "application/xml";
          break;
        } else if (single.toLowerCase().indexOf('x-www-form-urlencoded') >= 0) {
          contentType = "application/x-www-form-urlencoded";
          break;
        }
      }
    }

    form.validateFields((err, values) => {
        if (this.requestCodeMirrorEditorWrapper) {
          const bodyParams = this.requestCodeMirrorEditorWrapper.getWinterCodeMirrorValue()
          if (bodyParams) {
            values['__bodyForm'] = bodyParams
          }
        }

        const {__path, __header, __form, __bodyForm} = values
        console.log(values);//__path, __header, __form, __bodyForm

        // 构建请求头参数
        let headers = values['__header'];
        if (!isUpload) {
          if (headers) {
            headers = {...realGlobalHeader, ...headers, Accept: accept, 'Content-Type': contentType}
          } else {
            headers = {...realGlobalHeader, Accept: accept, 'Content-Type': contentType}
          }
        }

        const upperMethod = method.toUpperCase()

        const realApiTestUrl = __path ? WinterUtil.formReplacePathVar(testApiFullUrl, __path) : testApiFullUrl;
        const that = this
        if (upperMethod === 'POST') {
          if (isUpload) {
            const {fileList} = this.state
            // post文件上传
            let previousFormData = new FormData();
            let idx = 0
            fileList.forEach((file) => {
              previousFormData.append(apiDetail.fileParams[idx].name, file);
              idx++
            });
            let normalFormData = __form ? __form : {};
            let formData = objectToForm(normalFormData, previousFormData);


            apiRemoteService.postUpload(realApiTestUrl, formData, {...realGlobalHeader, ...__header}).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            });
          } else if (__bodyForm) {
            if (isBinaryResult) {
              // 这个实际上是post文件下载
              apiRemoteService.normalBodyDownloadPost(realApiTestUrl, __bodyForm, {...realGlobalHeader, ...__header}).then(function (result) {
                that.printResponse(realApiTestUrl, result)
              });
            } else {
              // post使用request body传参
              apiRemoteService.normalBodyPost(realApiTestUrl, __bodyForm, headers).then(function (result) {
                that.printResponse(realApiTestUrl, result)
              });
            }
          } else {
            // post使用普通的表单传参
            const tmpObj = this.removeEmptyValueField(__form)
            apiRemoteService.normalFormPost(realApiTestUrl, tmpObj, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            });
          }
        } else if (upperMethod === 'GET') {
          if (isImageResult) {
            // 是获取图片的请求
            let oldImg = document.getElementById('image-content-image');
            if (oldImg) {
              oldImg.remove();
            }
            let img = document.createElement('img');
            const tmpObj = this.removeEmptyValueField(__form)
            img.src = WinterUtil.convertRealUrl(realApiTestUrl, tmpObj);
            img.setAttribute('id', 'image-content-image');
            document.getElementById('image-content').append(img);
            this.setState({
              apiExecute: false
            })
          } else {
            // 普通get提交
            const tmpObj = this.removeEmptyValueField(__form)
            console.log('tmpObj',tmpObj)
            apiRemoteService.normalGet(realApiTestUrl, tmpObj, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            });
          }
        } else if (upperMethod === 'PUT') {
          if (__bodyForm) {
            apiRemoteService.normalBodyPut(realApiTestUrl, __bodyForm, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            })
          } else {
            const tmpObj = this.removeEmptyValueField(__form)
            apiRemoteService.normalFormPut(realApiTestUrl, tmpObj, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            })
          }
        } else if (upperMethod === 'DELETE') {
          const tmpObj = this.removeEmptyValueField(__form)
          apiRemoteService.normalDelete(realApiTestUrl, tmpObj, headers).then(function (result) {
            that.printResponse(realApiTestUrl, result)
          })
        } else if (upperMethod === 'PATCH') {
          if (__bodyForm) {
            // patch使用request body传参
            apiRemoteService.normalBodyPath(realApiTestUrl, __bodyForm, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            });
          } else {
            // patch使用普通的表单传参
            const tmpObj = this.removeEmptyValueField(__form)
            apiRemoteService.normalGet(realApiTestUrl, tmpObj, headers).then(function (result) {
              that.printResponse(realApiTestUrl, result)
            });
          }
        }
      }
    )
  }

  onApiTestFormBodyParamPartMounted = (ApiTestFormBodyParamPartInstance) => {
    this.requestCodeMirrorEditorWrapper = ApiTestFormBodyParamPartInstance
  }

  onApiTestResponseMounted = (ApiTestResponseInstance) => {
    this.responseCodeMirrorEditorWrapper = ApiTestResponseInstance
  }

  render() {
    console.log('ApiTestForm')
    const {testApiFullUrl, apiDetail, swaggerDocBasicInfo, form} = this.props
    return (
      <div className={styles.container}>
        <Form onSubmit={this.onSubmitForm}>
          <ApiTestFormParamPart
            paramNamePrefix={'__path.'}
            title={'路径参数'}
            form={form}
            paramList={apiDetail.pathParams}/>
          <ApiTestFormParamPart
            paramNamePrefix={'__header.'}
            title={'请求头参数'}
            form={form}
            paramList={apiDetail.headerParams}/>
          <ApiTestFormNormalFormParamPart
            paramNamePrefix={'__form.'}
            title={'表单参数'}
            form={form}
            paramList={apiDetail.formParams}/>

          {this.createFileUploadFormItem('文件参数', apiDetail.fileParams)}

          <ApiTestFormBodyParamPart
            title={'请求体参数'}
            apiDetail={apiDetail}
            onMounted={this.onApiTestFormBodyParamPartMounted}
          />

          <Button type="primary" htmlType="submit" block style={{marginTop: 10}}
                  loading={this.state.apiExecute}>
            执行
          </Button>
        </Form>

        <ApiTestResponse onMounted={this.onApiTestResponseMounted}/>
      </div>
    );
  }
}

ApiTestForm.propTypes = {
  testApiFullUrl: PropTypes.string,
  apiDetail: PropTypes.object,
  swaggerDocBasicInfo: PropTypes.object,
  /**
   * 全局请求头
   */
  globalHeaderArr: PropTypes.array.isRequired
};

export default ApiTestForm;
